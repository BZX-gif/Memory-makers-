import { describe, expect, it } from "vitest";
import {
  BUNDLE_DISCOUNT,
  BUNDLE_QUANTITY,
  ORIGINAL_UNIT_PRICE,
  SHIPPING_FEE,
  UNIT_PRICE,
  bundleMessage,
  calculateLineTotal,
  calculateOrderTotals,
} from "@/lib/pricing";

const items = (quantity: number) => [{ quantity }];
const spread = (a: number, b: number) => [{ quantity: a }, { quantity: b }];

describe("single-source pricing", () => {
  it("keeps the store rule: ₹600 per tee, ₹1,200 MRP, free shipping", () => {
    expect(UNIT_PRICE).toBe(600);
    expect(ORIGINAL_UNIT_PRICE).toBe(1200);
    expect(SHIPPING_FEE).toBe(0);
    expect(BUNDLE_QUANTITY).toBe(4);
    expect(BUNDLE_DISCOUNT).toBe(600);
  });

  it.each([
    [1, 600, 0, 600],
    [2, 1200, 0, 1200],
    [3, 1800, 0, 1800],
    [4, 2400, 600, 1800],
    [5, 3000, 600, 2400],
    [8, 4800, 600, 4200],
    [10, 6000, 600, 5400],
  ])("prices %i tee(s) as subtotal ₹%i, discount ₹%i, final ₹%i", (quantity, subtotal, discount, total) => {
    const totals = calculateOrderTotals(items(quantity));
    expect(totals.subtotal).toBe(subtotal);
    expect(totals.bundleDiscount).toBe(discount);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(total);
  });

  it("applies the ₹600 reward exactly once no matter how many tees are added", () => {
    for (const quantity of [4, 5, 8, 12, 20]) {
      expect(calculateOrderTotals(items(quantity)).bundleDiscount).toBe(600);
    }
    expect(calculateOrderTotals(spread(2, 2)).bundleDiscount).toBe(600);
    expect(calculateOrderTotals(spread(4, 4)).bundleDiscount).toBe(600);
  });

  it("counts every variant across separate lines toward the bundle", () => {
    const totals = calculateOrderTotals([{ quantity: 1 }, { quantity: 2 }]);
    expect(totals.itemCount).toBe(3);
    expect(totals.subtotal).toBe(1800);
    expect(totals.bundleDiscount).toBe(0);
    expect(totals.bundleRemaining).toBe(1);
    expect(totals.bundleProgress).toBe(0.75);
  });

  it("starts from zero for an empty bag and never charges shipping", () => {
    const totals = calculateOrderTotals([]);
    expect(totals).toMatchObject({ itemCount: 0, subtotal: 0, bundleDiscount: 0, shipping: 0, total: 0, bundleRemaining: 4, bundleUnlocked: false });
    expect(calculateOrderTotals(items(6)).shipping).toBe(0);
  });

  it("recalculates automatically when quantities shrink back below four", () => {
    expect(calculateOrderTotals(items(4)).total).toBe(1800);
    expect(calculateOrderTotals(items(3)).total).toBe(1800);
    expect(calculateOrderTotals(items(3)).bundleDiscount).toBe(0);
    expect(calculateOrderTotals(items(1)).total).toBe(600);
  });

  it("calculates a line total for every variant without reading stored prices", () => {
    expect(calculateLineTotal({ quantity: 1 })).toBe(600);
    expect(calculateLineTotal({ quantity: 3 })).toBe(1800);
    expect(calculateLineTotal({ quantity: 0 })).toBe(0);
  });

  it("ignores malformed quantities instead of producing NaN or a negative total", () => {
    const malformed = [{ quantity: NaN }, { quantity: -4 }, { quantity: Infinity }, { quantity: 2.7 }, null as never];
    const totals = calculateOrderTotals(malformed);
    expect(Number.isInteger(totals.total)).toBe(true);
    expect(totals.total).toBeGreaterThanOrEqual(0);
    expect(totals.itemCount).toBe(2);
    expect(calculateOrderTotals(null as never).total).toBe(0);
  });

  it("reports savings against the ₹1,200 original price", () => {
    expect(calculateOrderTotals(items(1)).savings).toBe(600);
    expect(calculateOrderTotals(items(4)).savings).toBe(3000);
  });

  it("shares one bundle message between every surface", () => {
    expect(bundleMessage(calculateOrderTotals(items(1)))).toBe("Add 3 more tees and unlock ₹600 off.");
    expect(bundleMessage(calculateOrderTotals(items(3)))).toBe("Add 1 more tee and unlock ₹600 off.");
    expect(bundleMessage(calculateOrderTotals(items(4)))).toBe("Your ₹600 discount has been applied.");
    expect(bundleMessage(calculateOrderTotals(items(8)))).toBe("Your ₹600 discount has been applied.");
    expect(bundleMessage(calculateOrderTotals([]))).toBe("Add 4 tees and unlock ₹600 off.");
  });
});
