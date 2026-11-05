import { describe, expect, it } from "vitest";
import { createCartItem } from "@/lib/cart";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppMessage, buildWhatsAppUrl, cleanMessageField, generateOrderReference } from "@/lib/whatsapp";
import { multiColorProduct, picturedProduct, pricedProduct, testCustomer as customer } from "@/test/fixtures";

const requestItem = createCartItem(multiColorProduct, "XL", multiColorProduct.availableColors[1], 2)!;
const pricedItem = createCartItem(pricedProduct, "L", pricedProduct.availableColors[0], 1)!;
const build = (items = [requestItem]) => buildWhatsAppMessage({ reference: "MM-ABC234", customer, items });

describe("WhatsApp order generation", () => {
  it("includes every customer and requested variant detail with an honest pending total", () => {
    const message = build();
    expect(message).toContain("NEW ORDER — MEMORY MAKERS");
    expect(message).toContain("Order Reference: MM-ABC234");
    expect(message).toContain("Name: Test Customer");
    expect(message).toContain("Address: 42, Sample Street, Apartment 4");
    expect(message).toContain("PIN: 342001");
    expect(message).toContain("Delivery note: Call before delivery");
    expect(message).toContain(`1. ${multiColorProduct.name}`);
    expect(message).toContain(`Product reference: ${multiColorProduct.id}`);
    expect(message).toContain("Size: XL (requested)");
    expect(message).toContain("Colour: Grey (pictured)");
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("Price: To be confirmed");
    expect(message).toContain("Item total: To be confirmed");
    expect(message).toContain("ORDER TOTAL: To be confirmed — product prices pending");
    expect(message).toContain("Please confirm prices, sizes, availability and the order.");
    expect(message).not.toContain("₹0");
    expect(message).not.toContain("NaN");
  });

  it("still calculates a fully owner-priced order correctly", () => {
    const message = build([{ ...pricedItem, quantity: 2 }, pricedItem]);
    expect(message).toContain(`Price: ${formatINR(1200)} each`);
    expect(message).toContain(`Item total: ${formatINR(2400)}`);
    expect(message).toContain(`ORDER TOTAL: ${formatINR(3600)}`);
    expect(message).toContain("Shipping: To be confirmed separately.");
  });

  it("does not report a partial total as the total of a mixed-price bag", () => {
    const message = build([pricedItem, requestItem]);
    expect(message).toContain(`Price: ${formatINR(1200)} each`);
    expect(message).toContain("ORDER TOTAL: To be confirmed");
    expect(message).not.toContain(`ORDER TOTAL: ${formatINR(1200)}`);
  });

  it("uses consistently clamped quantities in both line totals and order totals", () => {
    const message = build([{ ...pricedItem, quantity: 100 }]);
    expect(message).toContain("Quantity: 10");
    expect(message).toContain(`ORDER TOTAL: ${formatINR(12000)}`);
  });

  it("uses the official click-to-chat URL with proper encoding", () => {
    const message = build();
    const url = buildWhatsAppUrl(message, "919876543210")!;
    expect(new URL(url).origin).toBe("https://wa.me");
    expect(new URL(url).searchParams.get("text")).toBe(message);
    expect(buildWhatsAppUrl("NEW ORDER\nTotal: ₹2,197", "919876543210")).toBe("https://wa.me/919876543210?text=NEW%20ORDER%0ATotal%3A%20%E2%82%B92%2C197");
  });

  it("refuses placeholders and malformed business numbers", () => {
    expect(buildWhatsAppUrl("Order", "91XXXXXXXXXX")).toBeNull();
    expect(buildWhatsAppUrl("Order", "+91 98765 43210")).toBeNull();
    expect(buildWhatsAppUrl("", "919876543210")).toBeNull();
    expect(buildWhatsAppUrl(build())).toBeNull();
  });

  it("generates six-character client-side order references", () => {
    const references = new Set(Array.from({ length: 100 }, generateOrderReference));
    for (const reference of references) expect(reference).toMatch(/^MM-[A-Z2-9]{6}$/);
    expect(references.size).toBeGreaterThan(95);
  });

  it("removes control characters and injected line breaks from user fields", () => {
    expect(cleanMessageField("Name\nORDER TOTAL: ₹1\u0000")).toBe("Name ORDER TOTAL: ₹1");
    const item = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0])!;
    const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer: { ...customer, fullName: "Name\nORDER TOTAL: ₹1" }, items: [item] });
    expect(message).not.toContain("\nORDER TOTAL: ₹1");
  });

  it("returns a safe fallback instead of crashing on malformed items", () => {
    const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer, items: [{ color: null } as never] });
    expect(message).toContain("could not format the order automatically");
  });
});
