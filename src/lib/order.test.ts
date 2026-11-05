import { describe, expect, it } from "vitest";
import { createCartItem, ORDER_STORAGE_PREFIX } from "@/lib/cart";
import { readOrderDraft, saveOrderDraft } from "@/lib/order";
import { memoryStorage, multiColorProduct, pricedProduct, testOrderDraft } from "@/test/fixtures";
import type { OrderDraft } from "@/types";

function readPayload(payload: unknown) {
  const reference = "MM-ABC234";
  return readOrderDraft(memoryStorage({ [`${ORDER_STORAGE_PREFIX}${reference}`]: JSON.stringify(payload) }), reference);
}

describe("browser-local order handoff drafts", () => {
  it("round-trips unpriced requests without rejecting null totals", () => {
    const storage = memoryStorage();
    const draft = testOrderDraft();
    expect(saveOrderDraft(storage, draft)).toBe(true);
    expect(readOrderDraft(storage, draft.reference)).toEqual(draft);
    expect(draft.total).toBeNull();
  });

  it("retains numeric totals for a fully priced historical draft", () => {
    const draft = testOrderDraft([createCartItem(pricedProduct, "L", pricedProduct.availableColors[0], 2)!]);
    expect(draft.total).toBe(2400);
    expect(readPayload(draft)).toEqual(draft);
  });

  it("supports mixed-price requests and independent Buy Now handoffs", () => {
    const priced = createCartItem(pricedProduct, "M", pricedProduct.availableColors[0])!;
    const unpriced = createCartItem(multiColorProduct, "L", multiColorProduct.availableColors[1], 2)!;
    const draft: OrderDraft = { ...testOrderDraft([priced, unpriced]), source: "buy-now" };
    expect(readPayload(draft)?.total).toBeNull();
    expect(readPayload(draft)?.items[1].image).toBe(multiColorProduct.images[1]);
    expect(readPayload(draft)?.source).toBe("buy-now");
  });

  it("rejects a fake zero or partial total for an unpriced request", () => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, total: 0, subtotal: 0 })).toBeNull();
    expect(readPayload({ ...draft, total: 1200 })).toBeNull();
    expect(readPayload({ ...draft, subtotal: undefined })).toBeNull();
  });

  it.each([0, 11, -1, 1.5, null, "2"])("rejects invalid persisted quantity %s", (quantity) => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, items: [{ ...draft.items[0], quantity }] })).toBeNull();
  });

  it.each([-1, "100", undefined])("rejects invalid persisted price %s", (price) => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, items: [{ ...draft.items[0], price }] })).toBeNull();
  });

  it("rejects unsafe image paths and malformed drafts", () => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, items: [{ ...draft.items[0], image: "https://untrusted.example/image.jpg" }] })).toBeNull();
    expect(readPayload({ ...draft, items: [] })).toBeNull();
    expect(readPayload({ ...draft, source: "unknown" })).toBeNull();
    expect(readPayload({ ...draft, customer: {} })).toBeNull();
    expect(readPayload(null)).toBeNull();
  });

  it("handles missing, malformed and mismatched references", () => {
    const storage = memoryStorage();
    expect(readOrderDraft(storage, "invalid-reference")).toBeNull();
    expect(readOrderDraft(storage, "MM-ABC234")).toBeNull();
    storage.setItem(`${ORDER_STORAGE_PREFIX}MM-ABC234`, "bad-json");
    expect(readOrderDraft(storage, "MM-ABC234")).toBeNull();
    expect(readPayload({ ...testOrderDraft(), reference: "MM-ZZZ999" })).toBeNull();
  });

  it("returns safely if browser storage is blocked", () => {
    const storage = memoryStorage();
    storage.setItem = () => { throw new Error("Storage denied"); };
    storage.getItem = () => { throw new Error("Storage denied"); };
    expect(saveOrderDraft(storage, testOrderDraft())).toBe(false);
    expect(readOrderDraft(storage, "MM-ABC234")).toBeNull();
  });
});
