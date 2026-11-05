import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import type { CartItem, CheckoutCustomer } from "@/types";
import { calculateSubtotal, clampQuantity, formatINR } from "@/lib/utils";
import { normalizeIndianMobile } from "@/lib/validation";

/** Keep user-entered content readable without allowing fake message sections. */
export function cleanMessageField(value: unknown, maxLength = 240) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function generateOrderReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  try {
    const random = new Uint32Array(6);
    globalThis.crypto.getRandomValues(random);
    code = Array.from(random, (number) => alphabet[number % alphabet.length]).join("");
  } catch {
    // Non-cryptographic fallback: this is a reference, not a security token.
    code = Array.from({ length: 6 }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join("");
  }

  return `MM-${code}`;
}

interface BuildMessageInput {
  reference: string;
  customer: CheckoutCustomer;
  items: CartItem[];
}

export function buildWhatsAppMessage({ reference, customer, items }: BuildMessageInput) {
  try {
    const lines = [
      `NEW ORDER — ${storeConfig.brandName}`,
      "",
      `Order Reference: ${cleanMessageField(reference, 20)}`,
      "",
      "CUSTOMER DETAILS",
      `Name: ${cleanMessageField(customer.fullName, 80)}`,
      `Mobile: ${normalizeIndianMobile(customer.mobile)}`,
      "",
      "DELIVERY ADDRESS",
      `Address: ${cleanMessageField(customer.address, 240)}`,
      `City: ${cleanMessageField(customer.city, 60)}`,
      `State: ${cleanMessageField(customer.state, 60)}`,
      `PIN: ${cleanMessageField(customer.pinCode, 6)}`,
    ];

    const instructions = cleanMessageField(customer.instructions, 300);
    if (instructions) lines.push(`Delivery note: ${instructions}`);

    lines.push("", "ORDER DETAILS", "");

    items.forEach((item, index) => {
      const quantity = clampQuantity(item.quantity);
      lines.push(
        `${index + 1}. ${cleanMessageField(item.name, 100)}`,
        `Size: ${cleanMessageField(item.size, 12)}`,
        `Colour: ${cleanMessageField(item.color.name, 40)}`,
        `Quantity: ${quantity}`,
        `Price: ${formatINR(item.price)} each`,
        `Item total: ${formatINR(item.price * quantity)}`,
        "",
      );
    });

    lines.push(
      `ORDER TOTAL: ${formatINR(calculateSubtotal(items))}`,
      "",
      "Please confirm the availability and order.",
      "",
      `Thank you for choosing ${storeConfig.brandName}.`,
    );

    return lines.join("\n");
  } catch {
    return `NEW ORDER — ${storeConfig.brandName}\n\nWe could not format the order automatically. Please contact the customer to confirm their request.`;
  }
}

export function buildWhatsAppUrl(message: string, number: string = storeConfig.whatsappNumber) {
  if (!hasConfiguredWhatsApp(number) || !message.trim()) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
