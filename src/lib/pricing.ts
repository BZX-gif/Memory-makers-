/**
 * THE ONLY PRICING SOURCE OF TRUTH.
 *
 * Product cards, product pages, quick view, the cart drawer, the cart page,
 * checkout, saved order drafts and the WhatsApp message all read their money
 * values from this file. Never hardcode a rupee amount in a component.
 *
 * Rules:
 *  - Every T-shirt sells for ₹600 (original ₹1,200).
 *  - Shipping is always free.
 *  - 4 or more tees unlock exactly one ₹600 bundle discount per order.
 *    The discount is never multiplied — 8 tees still get one ₹600 discount.
 */

export const UNIT_PRICE = 600;
export const ORIGINAL_UNIT_PRICE = 1200;
export const BUNDLE_QUANTITY = 4;
export const BUNDLE_DISCOUNT = 600;
export const SHIPPING_FEE = 0;
export const SHIPPING_LABEL = "FREE";

/** Maximum quantity a customer may hold of any single variant. */
export const MAX_LINE_QUANTITY = 10;

export type PriceableItem = { quantity: number };

export interface OrderTotals {
  /** Total number of tees in the order. */
  itemCount: number;
  /** Quantity × ₹600, before any bundle reward. */
  subtotal: number;
  /** Exactly ₹600 when 4+ tees are present, otherwise ₹0. */
  bundleDiscount: number;
  /** Always ₹0 — shipping is free on every order. */
  shipping: number;
  /** subtotal − bundleDiscount + shipping. */
  total: number;
  /** How many more tees unlock the ₹600 reward. */
  bundleRemaining: number;
  /** True once the order qualifies for the bundle reward. */
  bundleUnlocked: boolean;
  /** Bundle progress from 0 to 1, for progress indicators. */
  bundleProgress: number;
  /** ₹1,200 − ₹600 on every tee, plus the bundle reward. */
  savings: number;
}

function safeQuantity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(MAX_LINE_QUANTITY, Math.max(0, Math.floor(value)));
}

/** ₹600 × quantity. Always a whole, formatted rupee amount. */
export function calculateLineTotal(item: PriceableItem): number {
  return safeQuantity(item?.quantity) * UNIT_PRICE;
}

/** The same value as the product page, used on every list surface. */
export function calculateOriginalLineTotal(item: PriceableItem): number {
  return safeQuantity(item?.quantity) * ORIGINAL_UNIT_PRICE;
}

/**
 * Shared, pure calculation used by the cart, checkout, order drafts and the
 * WhatsApp message. Safe for malformed or tampered item arrays.
 */
export function calculateOrderTotals(items: readonly PriceableItem[]): OrderTotals {
  const itemCount = Array.isArray(items)
    ? items.reduce<number>((total, item) => total + safeQuantity(item?.quantity), 0)
    : 0;

  const subtotal = itemCount * UNIT_PRICE;
  const bundleUnlocked = itemCount >= BUNDLE_QUANTITY;
  const bundleDiscount = bundleUnlocked ? BUNDLE_DISCOUNT : 0;
  const shipping = SHIPPING_FEE;
  const total = Math.max(0, subtotal - bundleDiscount + shipping);
  const bundleRemaining = Math.max(0, BUNDLE_QUANTITY - itemCount);

  return {
    itemCount,
    subtotal,
    bundleDiscount,
    shipping,
    total,
    bundleRemaining,
    bundleUnlocked,
    bundleProgress: Math.min(1, itemCount / BUNDLE_QUANTITY),
    savings: itemCount * (ORIGINAL_UNIT_PRICE - UNIT_PRICE) + bundleDiscount,
  };
}

/** Human copy for the bundle reward, shared by every surface. */
export function bundleMessage(totals: OrderTotals) {
  if (totals.itemCount === 0) {
    return `Add ${BUNDLE_QUANTITY} tees and unlock ₹${BUNDLE_DISCOUNT} off.`;
  }
  if (totals.bundleUnlocked) {
    return `Your ₹${BUNDLE_DISCOUNT} discount has been applied.`;
  }
  const noun = totals.bundleRemaining === 1 ? "tee" : "tees";
  return `Add ${totals.bundleRemaining} more ${noun} and unlock ₹${BUNDLE_DISCOUNT} off.`;
}
