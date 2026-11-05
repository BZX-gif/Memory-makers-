import { MAX_LINE_QUANTITY } from "@/lib/pricing";

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

/**
 * Keeps every quantity control inside real, owner-configured limits.
 * `max` is the product's available stock; a non-positive value is a sold-out
 * product and is treated as 1 so the control never becomes unusable.
 */
export function clampQuantity(value: number, max: number = MAX_LINE_QUANTITY) {
  const ceiling = Number.isFinite(max) && max >= 1 ? Math.min(MAX_LINE_QUANTITY, Math.floor(max)) : MAX_LINE_QUANTITY;
  if (!Number.isFinite(value)) return 1;
  return Math.min(ceiling, Math.max(1, Math.floor(value)));
}

/** All money calculations live in one authoritative module. */
export {
  calculateLineTotal,
  calculateOrderTotals,
  bundleMessage,
  UNIT_PRICE,
  ORIGINAL_UNIT_PRICE,
  BUNDLE_QUANTITY,
  BUNDLE_DISCOUNT,
  SHIPPING_FEE,
  MAX_LINE_QUANTITY,
} from "@/lib/pricing";
