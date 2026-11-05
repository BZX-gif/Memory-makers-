import { products } from "@/data/products";
import { createCartItem } from "@/lib/cart";
import { calculateSubtotal } from "@/lib/utils";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import type { CartItem, CheckoutCustomer, OrderDraft, Product } from "@/types";

// Keep pending-state regression cases stable when the owner fills real prices/sizes.
export const picturedProduct: Product = { ...products[0], price: null, inStock: null, availableSizes: [] };
export const multiColorProduct: Product = { ...products.find((product) => product.id === "mm-real-07")!, price: null, inStock: null, availableSizes: [] };

/** Test-only numbers/stock; never imported by storefront code or live inventory. */
export const pricedProduct: Product = { ...picturedProduct, price: 1200, inStock: true, availableSizes: ["M", "L", "XL"] };
export const unavailableProduct: Product = { ...multiColorProduct, inStock: false };

export const testCustomer: CheckoutCustomer = {
  fullName: "Test Customer",
  mobile: "9876543210",
  address: "42, Sample Street, Apartment 4",
  city: "Jodhpur",
  state: "Rajasthan",
  pinCode: "342001",
  instructions: "Call before delivery",
};

export function memoryStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

export function testOrderDraft(items: CartItem[] = [createCartItem(picturedProduct, "M", picturedProduct.availableColors[0])!]): OrderDraft {
  const reference = "MM-ABC234";
  const subtotal = calculateSubtotal(items);
  return {
    reference,
    createdAt: "2026-11-05T00:00:00.000Z",
    source: "cart",
    customer: testCustomer,
    items,
    subtotal,
    total: subtotal,
    message: buildWhatsAppMessage({ reference, customer: testCustomer, items }),
  };
}
