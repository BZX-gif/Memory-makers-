import { describe, expect, it } from "vitest";
import { createCartItem } from "@/lib/cart";
import { formatINR } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/pricing";
import { buildWhatsAppMessage, buildWhatsAppUrl, cleanMessageField, generateOrderReference } from "@/lib/whatsapp";
import { multiColorProduct, picturedProduct, testCustomer as customer } from "@/test/fixtures";
import type { CartItem } from "@/types";

const item = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0], 1)!;
const greyItem = createCartItem(multiColorProduct, "XL", multiColorProduct.availableColors[1], 1)!;
const build = (items: CartItem[] = [item]) => buildWhatsAppMessage({ reference: "MM-ABC234", customer, items });

describe("WhatsApp order generation", () => {
  it("uses the exact required order format", () => {
    const message = build();
    expect(message).toBe([
      "MEMORY MAKERS — NEW ORDER",
      "",
      "Order Reference: MM-ABC234",
      "",
      "Customer Details:",
      "Name: Test Customer",
      "Mobile: 9876543210",
      "Address: 42, Sample Street, Apartment 4, Jodhpur, Rajasthan",
      "Pincode: 342001",
      "",
      "ORDER DETAILS:",
      "",
      `Product: ${picturedProduct.name}`,
      "Size: M",
      "Color: Yellow",
      "Quantity: 1",
      "Unit Price: ₹600",
      "Item Total: ₹600",
      "",
      "Delivery Note: Call before delivery",
      "",
      "Subtotal: ₹600",
      "Bundle Discount: -₹0",
      "Shipping: FREE",
      "FINAL AMOUNT PAYABLE: ₹600",
      "",
      "Payment Method: Confirm with seller",
      "",
      "Please confirm availability and delivery details.",
    ].join("\n"));
  });

  it.each([
    [1, 600, 0, 600],
    [2, 1200, 0, 1200],
    [3, 1800, 0, 1800],
    [4, 2400, 600, 1800],
    [8, 4800, 600, 4200],
  ])("quotes the same final amount as the cart for %i tee(s): ₹%i", (quantity, subtotal, discount, total) => {
    const cartItem = { ...item, quantity, maxQuantity: 10 };
    const message = build([cartItem]);
    expect(message).toContain(`Subtotal: ${formatINR(subtotal)}`);
    expect(message).toContain(`Bundle Discount: -${formatINR(discount)}`);
    expect(message).toContain("Shipping: FREE");
    expect(message).toContain(`FINAL AMOUNT PAYABLE: ${formatINR(total)}`);
    expect(total).toBe(calculateOrderTotals([cartItem]).total);
  });

  it("applies the discount once for a large order and prints every line", () => {
    const message = build([{ ...item, quantity: 4, maxQuantity: 10 }, { ...greyItem, quantity: 4, maxQuantity: 10 }]);
    expect(message).toContain(`Product: ${picturedProduct.name}`);
    expect(message).toContain(`Product: ${multiColorProduct.name}`);
    expect(message).toContain("Color: Grey");
    expect(message).toContain("Subtotal: ₹4,800");
    expect(message).toContain("Bundle Discount: -₹600");
    expect(message).toContain("FINAL AMOUNT PAYABLE: ₹4,200");
    expect(message.match(/Bundle Discount/g)).toHaveLength(1);
    expect(message).not.toContain("₹3,600\n");
  });

  it("never prints a stale or made-up price", () => {
    const message = build([{ ...item, price: 99, quantity: 2, maxQuantity: 10 }]);
    expect(message).toContain("Unit Price: ₹600");
    expect(message).toContain("Item Total: ₹1,200");
    expect(message).toContain("Subtotal: ₹1,200");
    expect(message).not.toContain("₹99");
    expect(message).not.toContain("NaN");
  });

  it("supports a mixed-colour multi-item order with no delivery note", () => {
    const message = buildWhatsAppMessage({
      reference: "MM-ABC234",
      customer: { ...customer, instructions: "" },
      items: [{ ...item, quantity: 2, maxQuantity: 10 }, { ...greyItem, quantity: 3, maxQuantity: 10 }],
    });
    expect(message).toContain("Color: Yellow");
    expect(message).toContain("Color: Grey");
    expect(message).toContain("Subtotal: ₹3,000");
    expect(message).toContain("FINAL AMOUNT PAYABLE: ₹2,400");
    expect(message).not.toContain("Delivery Note:");
  });

  it("uses the official click-to-chat URL with proper encoding", () => {
    const message = build();
    const url = buildWhatsAppUrl(message, "919876543210")!;
    expect(new URL(url).origin).toBe("https://wa.me");
    expect(new URL(url).searchParams.get("text")).toBe(message);
    expect(buildWhatsAppUrl("NEW ORDER\nTotal: ₹2,197", "919876543210")).toBe("https://wa.me/919876543210?text=NEW%20ORDER%0ATotal%3A%20%E2%82%B92%2C197");
  });

  it("refuses placeholders, malformed numbers and the owner placeholder", () => {
    expect(buildWhatsAppUrl("Order", "91XXXXXXXXXX")).toBeNull();
    expect(buildWhatsAppUrl("Order", "+91 98765 43210")).toBeNull();
    expect(buildWhatsAppUrl("", "919876543210")).toBeNull();
    expect(buildWhatsAppUrl(build())).not.toBeNull();
  });

  it("generates six-character client-side order references", () => {
    const references = new Set(Array.from({ length: 100 }, generateOrderReference));
    for (const reference of references) expect(reference).toMatch(/^MM-[A-Z2-9]{6}$/);
    expect(references.size).toBeGreaterThan(95);
  });

  it("removes control characters and injected line breaks from user fields", () => {
    expect(cleanMessageField("Name\nORDER TOTAL: ₹1\u0000")).toBe("Name ORDER TOTAL: ₹1");
    const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer: { ...customer, fullName: "Name\nORDER TOTAL: ₹1" }, items: [item] });
    expect(message).not.toContain("\nORDER TOTAL: ₹1");
  });

  it("returns a safe fallback instead of crashing on malformed items", () => {
    const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer, items: [{ color: null } as never] });
    expect(message).toContain("could not format the order automatically");
  });
});
