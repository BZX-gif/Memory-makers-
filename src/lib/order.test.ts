import { describe, expect, it } from "vitest";
import { createCartItem, ORDER_STORAGE_PREFIX } from "@/lib/cart";
import { readOrderDraft, saveOrderDraft } from "@/lib/order";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { memoryStorage, multiColorProduct, picturedProduct, testCustomer, testOrderDraft } from "@/test/fixtures";
import type { OrderDraft } from "@/types";

function readPayload(payload: unknown) {
  const reference = "MM-ABC234";
  return readOrderDraft(
    memoryStorage({ [`${ORDER_STORAGE_PREFIX}${reference}`]: JSON.stringify(payload) }),
    reference,
  );
}

describe("browser-local order handoff drafts", () => {
  it("round-trips a priced order with its shared totals", () => {
    const storage = memoryStorage();
    const draft = testOrderDraft();
    expect(saveOrderDraft(storage, draft)).toBe(true);
    expect(readOrderDraft(storage, draft.reference)).toEqual(draft);
    expect(draft).toMatchObject({ subtotal: 600, bundleDiscount: 0, shipping: 0, total: 600 });
  });

  it("stores one ₹600 discount for a four-tee order", () => {
    const item = createCartItem(picturedProduct, "L", picturedProduct.availableColors[0], 4)!;
    const draft = testOrderDraft([item]);
    expect(draft).toMatchObject({ subtotal: 2400, bundleDiscount: 600, shipping: 0, total: 1800 });
    expect(readPayload(draft)).toEqual(draft);
    expect(draft.message).toContain("FINAL AMOUNT PAYABLE: ₹1,800");
  });

  it("supports independent Buy Now handoffs with their own totals", () => {
    const item = createCartItem(multiColorProduct, "L", multiColorProduct.availableColors[1], 2)!;
    const draft: OrderDraft = { ...testOrderDraft([item]), source: "buy-now" };
    expect(readPayload(draft)?.total).toBe(1200);
    expect(readPayload(draft)?.items[0].image).toBe(multiColorProduct.images[1]);
    expect(readPayload(draft)?.source).toBe("buy-now");
  });

  it("allows the bundle discount to disappear when the order drops below four", () => {
    const four = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0], 4)!;
    const unlocked = testOrderDraft([four]);
    expect(unlocked.total).toBe(1800);

    const three = { ...four, quantity: 3 };
    const reduced: OrderDraft = {
      ...unlocked,
      items: [three],
      subtotal: 1800,
      bundleDiscount: 0,
      total: 1800,
      message: buildWhatsAppMessage({ reference: unlocked.reference, customer: testCustomer, items: [three] }),
    };

    expect(readPayload(reduced)?.bundleDiscount).toBe(0);
    expect(readPayload(reduced)?.total).toBe(1800);
    expect(reduced.message).toContain("Bundle Discount: -₹0");
  });

  it("rejects edited or inconsistent money values", () => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, total: 0 })).toBeNull();
    expect(readPayload({ ...draft, subtotal: 1200 })).toBeNull();
    expect(readPayload({ ...draft, bundleDiscount: 600, total: 0 })).toBeNull();
    expect(readPayload({ ...draft, shipping: 49 })).toBeNull();
    expect(readPayload({ ...draft, total: undefined })).toBeNull();
    expect(readPayload({ ...draft, subtotal: undefined })).toBeNull();
  });

  it("rejects a repeated discount that the pricing rule would not apply", () => {
    const item = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0], 8)!;
    const draft = testOrderDraft([item]);
    expect(draft.bundleDiscount).toBe(600);
    expect(readPayload({ ...draft, bundleDiscount: 1200, total: 3600 })).toBeNull();
    expect(readPayload({ ...draft, bundleDiscount: 1200, total: 3600 })).toBeNull();
  });

  it.each([0, 11, -1, 1.5, null, "2"])("rejects invalid persisted quantity %s", (quantity) => {
    const draft = testOrderDraft();
    expect(readPayload({ ...draft, items: [{ ...draft.items[0], quantity }] })).toBeNull();
  });

  it.each([-1, "100", undefined, null])("rejects invalid persisted price %s", (price) => {
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
