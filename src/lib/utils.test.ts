import { describe, expect, it } from "vitest";
import { clampQuantity, formatINR, isConfirmedPrice } from "@/lib/utils";
import { calculateLineTotal, calculateOrderTotals, MAX_LINE_QUANTITY, UNIT_PRICE } from "@/lib/pricing";

describe("money formatting", () => {
  it("formats confirmed values, including an explicitly verified zero", () => {
    expect(formatINR(600)).toBe("₹600");
    expect(formatINR(1200)).toBe("₹1,200");
    expect(formatINR(0)).toBe("₹0");
  });

  it.each([null, NaN, Infinity, -1])("never displays an unknown or invalid price %s as zero", (value) => {
    expect(formatINR(value)).toBe("Price to confirm");
    expect(formatINR(value, "To confirm")).toBe("To confirm");
    expect(isConfirmedPrice(value)).toBe(false);
  });

  it("exposes the shared calculation rather than a second price table", () => {
    expect(UNIT_PRICE).toBe(600);
    expect(calculateLineTotal({ quantity: 2 })).toBe(1200);
    expect(calculateOrderTotals([{ quantity: 4 }]).total).toBe(1800);
  });
});

describe("quantity limits", () => {
  it("clamps to the default ceiling", () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(2.9)).toBe(2);
    expect(clampQuantity(50)).toBe(MAX_LINE_QUANTITY);
    expect(clampQuantity(NaN)).toBe(1);
  });

  it("clamps to configured stock and never trusts a bad ceiling", () => {
    expect(clampQuantity(5, 3)).toBe(3);
    expect(clampQuantity(2, 0)).toBe(2);
    expect(clampQuantity(2, -4)).toBe(2);
    expect(clampQuantity(40, 99)).toBe(MAX_LINE_QUANTITY);
  });
});
