import { products } from "@/data/products";
import { createCartItem } from "@/lib/cart";
import { calculateOrderTotals } from "@/lib/pricing";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import type { CartItem, CheckoutCustomer, OrderDraft, Product } from "@/types";

/** Real catalogue records, used as-is so tests exercise the shipped pricing. */
export const picturedProduct: Product = products[0];
export const multiColorProduct: Product = products.find((product) => product.id === "mm-real-07")!;
export const lowStockProduct: Product = { ...products[2], stock: 5 };
export const untrackedStockProduct: Product = { ...products[1], stock: null, stockLabel: null };
export const soldOutProduct: Product = { ...products[1], inStock: false };

/** Kept for older regression cases; pricing is now the same for every tee. */
export const pricedProduct: Product = { ...picturedProduct, availableSizes: ["M", "L", "XL"] };
export const unavailableProduct: Product = soldOutProduct;

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

export function testOrderDraft(
  items: CartItem[] = [createCartItem(picturedProduct, "M", picturedProduct.availableColors[0])!],
): OrderDraft {
  const reference = "MM-ABC234";
  const totals = calculateOrderTotals(items);
  return {
    reference,
    createdAt: "2026-11-05T00:00:00.000Z",
    source: "cart",
    customer: testCustomer,
    items,
    subtotal: totals.subtotal,
    bundleDiscount: totals.bundleDiscount,
    shipping: totals.shipping,
    total: totals.total,
    message: buildWhatsAppMessage({ reference, customer: testCustomer, items }),
  };
}
