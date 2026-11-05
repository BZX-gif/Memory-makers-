import { describe, expect, it } from "vitest";
import { isValidIndianMobile, isValidPinCode, validateCheckout } from "@/lib/validation";
import type { CheckoutCustomer } from "@/types";

const validCustomer: CheckoutCustomer = {
  fullName: "Aarav Sharma",
  mobile: "98765 43210",
  address: "42, Sample Street, Near Central Park",
  city: "Jodhpur",
  state: "Rajasthan",
  pinCode: "342001",
  instructions: "Call before delivery",
};

describe("checkout validation", () => {
  it("accepts valid customer information and common Indian mobile formats", () => {
    expect(validateCheckout(validCustomer)).toEqual({});
    expect(isValidIndianMobile("+91 98765 43210")).toBe(true);
    expect(isValidIndianMobile("09876543210")).toBe(true);
    expect(isValidPinCode("342001")).toBe(true);
  });

  it("rejects every required field when empty", () => {
    const errors = validateCheckout({ fullName: "", mobile: "", address: "", city: "", state: "", pinCode: "", instructions: "" });
    expect(Object.keys(errors).sort()).toEqual(["address", "city", "fullName", "mobile", "pinCode", "state"]);
  });

  it("rejects invalid Indian mobiles and PIN codes", () => {
    expect(isValidIndianMobile("1234567890")).toBe(false);
    expect(isValidIndianMobile("987654321")).toBe(false);
    expect(isValidIndianMobile("98765432100")).toBe(false);
    expect(isValidPinCode("012345")).toBe(false);
    expect(isValidPinCode("12345")).toBe(false);
    expect(isValidPinCode("1234567")).toBe(false);
  });

  it("rejects incomplete addresses and overlong instructions", () => {
    const errors = validateCheckout({ ...validCustomer, address: "Short", instructions: "x".repeat(301) });
    expect(errors.address).toBeTruthy();
    expect(errors.instructions).toBeTruthy();
  });
});
