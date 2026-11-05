import { describe, expect, it } from "vitest";
import { calculateLineTotal, calculateSubtotal, formatINR, isConfirmedPrice } from "@/lib/utils";

describe("pending prices and totals", () => {
  it("formats confirmed values, including an explicitly verified zero", () => {
    expect(formatINR(1200)).toBe("₹1,200");
    expect(formatINR(0)).toBe("₹0");
  });

  it.each([null, NaN, Infinity, -1])("never displays an unknown or invalid price %s as zero", (value) => {
    expect(formatINR(value)).toBe("Price to confirm");
    expect(formatINR(value, "To confirm")).toBe("To confirm");
    expect(isConfirmedPrice(value)).toBe(false);
  });

  it("calculates numeric line totals and a fully priced subtotal", () => {
    const items = [{ price: 100, quantity: 2 }, { price: 300, quantity: 3 }];
    expect(calculateLineTotal(items[0])).toBe(200);
    expect(calculateSubtotal(items)).toBe(1100);
    expect(calculateSubtotal([])).toBe(0);
  });

  it("preserves unknown totals for unpriced and mixed-price selections", () => {
    expect(calculateLineTotal({ price: null, quantity: 3 })).toBeNull();
    expect(calculateSubtotal([{ price: null, quantity: 3 }])).toBeNull();
    expect(calculateSubtotal([{ price: 100, quantity: 1 }, { price: null, quantity: 2 }])).toBeNull();
  });

  it("does not render invalid arithmetic as a total", () => {
    expect(calculateLineTotal({ price: 10, quantity: NaN })).toBeNull();
    expect(calculateLineTotal({ price: -1, quantity: 2 })).toBeNull();
    expect(calculateSubtotal([{ price: Number.MAX_VALUE, quantity: 2 }])).toBeNull();
  });
});
