import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import type { CartItem, CheckoutCustomer } from "@/types";
import { calculateLineTotal, calculateOrderTotals, SHIPPING_LABEL, UNIT_PRICE } from "@/lib/pricing";
import { clampQuantity, formatINR } from "@/lib/utils";
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

/**
 * The WhatsApp order message. Every rupee figure comes from
 * calculateOrderTotals(), the exact same function that renders the cart and
 * checkout, so the sent message can never disagree with the screen.
 */
export function buildWhatsAppMessage({ reference, customer, items }: BuildMessageInput) {
  try {
    const orderItems = items.map((item) => ({ ...item, quantity: clampQuantity(item.quantity, item.maxQuantity) }));
    const totals = calculateOrderTotals(orderItems);

    const address = [
      cleanMessageField(customer.address, 240),
      cleanMessageField(customer.city, 60),
      cleanMessageField(customer.state, 60),
    ].filter(Boolean).join(", ");

    const lines = [
      `${storeConfig.brandName} — NEW ORDER`,
      "",
      `Order Reference: ${cleanMessageField(reference, 20)}`,
      "",
      "Customer Details:",
      `Name: ${cleanMessageField(customer.fullName, 80)}`,
      `Mobile: ${normalizeIndianMobile(customer.mobile)}`,
      `Address: ${address}`,
      `Pincode: ${cleanMessageField(customer.pinCode, 6)}`,
      "",
      "ORDER DETAILS:",
      "",
    ];

    orderItems.forEach((item) => {
      lines.push(
        `Product: ${cleanMessageField(item.name, 100)}`,
        `Size: ${cleanMessageField(item.size, 12)}`,
        `Color: ${cleanMessageField(item.color.name, 40)}`,
        `Quantity: ${item.quantity}`,
        `Unit Price: ${formatINR(UNIT_PRICE)}`,
        `Item Total: ${formatINR(calculateLineTotal(item))}`,
        "",
      );
    });

    const instructions = cleanMessageField(customer.instructions, 300);
    if (instructions) lines.push(`Delivery Note: ${instructions}`, "");

    lines.push(
      `Subtotal: ${formatINR(totals.subtotal)}`,
      `Bundle Discount: -${formatINR(totals.bundleDiscount)}`,
      `Shipping: ${SHIPPING_LABEL}`,
      `FINAL AMOUNT PAYABLE: ${formatINR(totals.total)}`,
      "",
      "Payment Method: Confirm with seller",
      "",
      "Please confirm availability and delivery details.",
    );

    return lines.join("\n");
  } catch {
    return `${storeConfig.brandName} — NEW ORDER\n\nWe could not format the order automatically. Please contact the customer to confirm their request.`;
  }
}

export function buildWhatsAppUrl(message: string, number: string = storeConfig.whatsappNumber) {
  if (!hasConfiguredWhatsApp(number) || !message.trim()) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
