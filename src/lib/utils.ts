export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function isConfirmedPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Never turn a missing or invalid price into a misleading ₹0. */
export function formatINR(value: number | null, pendingLabel = "Price to confirm") {
  if (!isConfirmedPrice(value)) return pendingLabel;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(10, Math.max(1, Math.floor(value)));
}

export function calculateLineTotal(item: { price: number | null; quantity: number }): number | null {
  if (!isConfirmedPrice(item.price) || !Number.isFinite(item.quantity) || item.quantity < 1) return null;
  // Fixed selling price: ₹600 per T-shirt (Original ₹1,200, 50% OFF)
  const unitPrice = 600;
  const total = unitPrice * item.quantity;
  return Number.isFinite(total) ? total : null;
}

/** A mixed quoted/unquoted bag has no complete total yet; do not show a partial sum. */
export function calculateSubtotal(items: Array<{ price: number | null; quantity: number }>): number | null {
  let subtotal = 0;
  let totalQuantity = 0;
  for (const item of items) {
    const lineTotal = calculateLineTotal(item);
    if (lineTotal === null) return null;
    subtotal += lineTotal;
    totalQuantity += item.quantity;
  }
  
  // Buy 4, Get 1 Free promotion: fixed ₹600 discount once per order if quantity >= 4
  if (totalQuantity >= 4) {
    subtotal -= 600;
  }
  
  return Number.isFinite(subtotal) ? subtotal : null;
}

// New utility for cart discount calculation
export function calculateCartDiscount(items: Array<{ price: number | null; quantity: number }>): number {
  let totalQuantity = 0;
  for (const item of items) {
    if (!isConfirmedPrice(item.price) || !Number.isFinite(item.quantity)) continue;
    totalQuantity += item.quantity;
  }
  return totalQuantity >= 4 ? 600 : 0;
}

// New utility for final payable amount
export function calculateFinalTotal(items: Array<{ price: number | null; quantity: number }>): number | null {
  const subtotal = calculateSubtotal(items);
  if (subtotal === null) return null;
  return subtotal;
}
