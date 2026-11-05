import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { createCartItem } from "@/lib/cart";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppMessage, buildWhatsAppUrl, cleanMessageField, generateOrderReference } from "@/lib/whatsapp";
import type { CheckoutCustomer } from "@/types";

const first = products[0];
const second = products[1];
const items = [
  createCartItem(first, "XL", first.availableColors[0], 2)!,
  createCartItem(second, "L", second.availableColors[0], 1)!,
];
const customer: CheckoutCustomer = {
  fullName: "Customer Name",
  mobile: "9876543210",
  address: "Full Address, Apartment 4",
  city: "Jodhpur",
  state: "Rajasthan",
  pinCode: "342001",
  instructions: "Leave at reception",
};

describe("WhatsApp order generation", () => {
  it("builds a readable message with every customer and item detail", () => {
    const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer, items });
    expect(message).toContain("NEW ORDER — MEMORY MAKERS");
    expect(message).toContain("Order Reference: MM-ABC234");
    expect(message).toContain("Name: Customer Name");
    expect(message).toContain("Address: Full Address, Apartment 4");
    expect(message).toContain("PIN: 342001");
    expect(message).toContain("Delivery note: Leave at reception");
    expect(message).toContain(`1. ${first.name}`);
    expect(message).toContain("Size: XL");
    expect(message).toContain(`Colour: ${first.availableColors[0].name}`);
    expect(message).toContain("Quantity: 2");
    expect(message).toContain(`Price: ${formatINR(first.price)} each`);
    expect(message).toContain(`2. ${second.name}`);
    const total = first.price * 2 + second.price;
    expect(message).toContain(`ORDER TOTAL: ${formatINR(total)}`);
    expect(message).toContain("Please confirm the availability and order.");
  });

  it("uses the official click-to-chat URL with proper encoding", () => {
    const url = buildWhatsAppUrl("NEW ORDER\nTotal: ₹2,197", "919876543210");
    expect(url).toBe("https://wa.me/919876543210?text=NEW%20ORDER%0ATotal%3A%20%E2%82%B92%2C197");
  });

  it("refuses placeholders and malformed business numbers", () => {
    expect(buildWhatsAppUrl("Order", "91XXXXXXXXXX")).toBeNull();
    expect(buildWhatsAppUrl("Order", "+91 98765 43210")).toBeNull();
    expect(buildWhatsAppUrl("", "919876543210")).toBeNull();
  });

  it("generates six-character client-side order references", () => {
    const references = new Set(Array.from({ length: 100 }, generateOrderReference));
    for (const reference of references) expect(reference).toMatch(/^MM-[A-Z2-9]{6}$/);
    expect(references.size).toBeGreaterThan(95);
  });

  it("removes control characters and injected line breaks from user fields", () => {
    expect(cleanMessageField("Name\nORDER TOTAL: ₹1\u0000")).toBe("Name ORDER TOTAL: ₹1");
  });

  it("returns a safe fallback instead of crashing on malformed items", () => {
    const message = buildWhatsAppMessage({
      reference: "MM-ABC234",
      customer,
      items: [{ color: null } as never],
    });
    expect(message).toContain("could not format the order automatically");
  });
});
