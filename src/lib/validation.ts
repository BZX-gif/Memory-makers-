import type { CheckoutCustomer, CheckoutErrors } from "@/types";

export function normalizeIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(value: string) {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(value));
}

export function isValidPinCode(value: string) {
  return /^[1-9]\d{5}$/.test(value.trim());
}

export function validateCheckout(customer: CheckoutCustomer): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (customer.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name (at least 2 characters).";
  } else if (customer.fullName.length > 80) {
    errors.fullName = "Name must be 80 characters or fewer.";
  }

  if (!isValidIndianMobile(customer.mobile)) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  }

  if (customer.address.trim().length < 8) {
    errors.address = "Enter your complete delivery address.";
  } else if (customer.address.length > 240) {
    errors.address = "Address must be 240 characters or fewer.";
  }

  if (customer.city.trim().length < 2) {
    errors.city = "Enter your city.";
  }

  if (customer.state.trim().length < 2) {
    errors.state = "Enter your state.";
  }

  if (!isValidPinCode(customer.pinCode)) {
    errors.pinCode = "Enter a valid six-digit PIN code.";
  }

  if (customer.instructions.length > 300) {
    errors.instructions = "Delivery instructions must be 300 characters or fewer.";
  }

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutErrors) {
  return Object.keys(errors).length > 0;
}
