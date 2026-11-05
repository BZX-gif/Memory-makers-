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
  const total = item.price * item.quantity;
  return Number.isFinite(total) ? total : null;
}

/** A mixed quoted/unquoted bag has no complete total yet; do not show a partial sum. */
export function calculateSubtotal(items: Array<{ price: number | null; quantity: number }>): number | null {
  let subtotal = 0;
  for (const item of items) {
    const lineTotal = calculateLineTotal(item);
    if (lineTotal === null) return null;
    subtotal += lineTotal;
  }
  return Number.isFinite(subtotal) ? subtotal : null;
}
