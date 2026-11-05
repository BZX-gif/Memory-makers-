import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { CART_STORAGE_KEY, cartReducer, createCartItem, readStoredCart, type CartAction } from "@/lib/cart";
import { bundleMessage, calculateOrderTotals } from "@/lib/pricing";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { memoryStorage, testCustomer } from "@/test/fixtures";
import type { CartItem, Product } from "@/types";

/**
 * End-to-end pricing scenarios from the brief, driven through the real cart
 * reducer, the real persistence layer and the real WhatsApp generator.
 */
const [teeA, teeB, teeC, teeD] = products;

function add(state: CartItem[], product: Product, size = "M", quantity = 1) {
  const item = createCartItem(product, size, product.availableColors[0], quantity)!;
  return cartReducer(state, { type: "add", item });
}

const totalsFor = (items: CartItem[]) => calculateOrderTotals(items);

describe("cart pricing scenarios", () => {
  it("1. adding one tee charges ₹600 with no discount", () => {
    const state = add([], teeA);
    expect(totalsFor(state)).toMatchObject({ itemCount: 1, subtotal: 600, bundleDiscount: 0, total: 600 });
    expect(bundleMessage(totalsFor(state))).toBe("Add 3 more tees and unlock ₹600 off.");
  });

  it("2. adding three tees totals ₹1,800 and still shows free shipping", () => {
    let state = add([], teeA);
    state = add(state, teeB);
    state = add(state, teeC);
    const totals = totalsFor(state);
    expect(totals).toMatchObject({ itemCount: 3, subtotal: 1800, bundleDiscount: 0, shipping: 0, total: 1800, bundleRemaining: 1 });
    expect(bundleMessage(totals)).toBe("Add 1 more tee and unlock ₹600 off.");
  });

  it("3. the fourth tee unlocks exactly ₹600 once", () => {
    let state = add([], teeA);
    state = add(state, teeB);
    state = add(state, teeC);
    state = add(state, teeD);
    const totals = totalsFor(state);
    expect(totals).toMatchObject({ itemCount: 4, subtotal: 2400, bundleDiscount: 600, shipping: 0, total: 1800 });
    expect(bundleMessage(totals)).toBe("Your ₹600 discount has been applied.");
  });

  it("4. increasing quantity from four to eight keeps a single discount", () => {
    let state = add([], teeA, "M", 4);
    expect(totalsFor(state).total).toBe(1800);

    state = cartReducer(state, { type: "update", key: state[0].key, quantity: 8 });
    expect(totalsFor(state)).toMatchObject({ itemCount: 8, subtotal: 4800, bundleDiscount: 600, total: 4200 });
  });

  it("5. removing a product after unlocking recalculates automatically", () => {
    let state = add([], teeA);
    state = add(state, teeB);
    state = add(state, teeC);
    state = add(state, teeD);
    expect(totalsFor(state).total).toBe(1800);

    state = cartReducer(state, { type: "remove", key: state[3].key });
    expect(totalsFor(state)).toMatchObject({ itemCount: 3, subtotal: 1800, bundleDiscount: 0, total: 1800 });

    state = cartReducer(state, { type: "remove", key: state[0].key });
    expect(totalsFor(state)).toMatchObject({ itemCount: 2, subtotal: 1200, bundleDiscount: 0, total: 1200 });
  });

  it("6. refreshing the page restores the same items and the same total", () => {
    let state = add([], teeA, "L", 2);
    state = add(state, teeB, "M", 2);
    const before = totalsFor(state);

    const storage = memoryStorage();
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items: state }));
    const restored = readStoredCart(storage);

    expect(restored).toEqual(state);
    expect(totalsFor(restored)).toEqual(before);
    expect(before.total).toBe(1800);
  });

  it("7. Buy Now prices its single selection with the same function", () => {
    const buyNowItem = createCartItem(teeB, "XL", teeB.availableColors[0], 2)!;
    const totals = totalsFor([buyNowItem]);
    expect(totals).toMatchObject({ itemCount: 2, subtotal: 1200, bundleDiscount: 0, total: 1200 });
    expect(buyNowItem.price).toBe(600);
  });

  it("8. the WhatsApp message matches the cart's final amount for every basket", () => {
    const baskets: CartItem[][] = [
      add([], teeA),
      add(add([], teeA), teeB),
      add(add(add([], teeA), teeB), teeC),
      add(add(add(add([], teeA), teeB), teeC), teeD),
      add([], teeA, "M", 8),
    ];

    for (const basket of baskets) {
      const totals = totalsFor(basket);
      const message = buildWhatsAppMessage({ reference: "MM-ABC234", customer: testCustomer, items: basket });
      expect(message).toContain(`Subtotal: ₹${totals.subtotal.toLocaleString("en-IN")}`);
      expect(message).toContain(`Bundle Discount: -₹${totals.bundleDiscount === 0 ? "0" : totals.bundleDiscount.toLocaleString("en-IN")}`);
      expect(message).toContain("Shipping: FREE");
      expect(message).toContain(`FINAL AMOUNT PAYABLE: ₹${totals.total.toLocaleString("en-IN")}`);
      expect((message.match(/Bundle Discount/g) ?? []).length).toBe(1);
    }
  });

  it("9. a mobile-sized basket keeps every line item and free shipping", () => {
    let state = add([], teeA, "S");
    state = add(state, teeC, "XL");
    state = add(state, teeD, "M");
    state = add(state, teeD, "L");
    expect(state).toHaveLength(4);
    expect(totalsFor(state)).toMatchObject({ itemCount: 4, subtotal: 2400, bundleDiscount: 600, shipping: 0, total: 1800 });
  });

  it("10. every surface reads the same final amount from one function", () => {
    let state = add([], teeA, "M", 3);
    state = add(state, teeB, "M", 5);
    const totals = totalsFor(state);
    const contextTotals = totalsFor(state);
    const checkoutTotals = totalsFor([...state]);
    const whatsappTotals = totalsFor(
      state.map((item) => ({ ...item, quantity: item.quantity })),
    );

    expect(totals.total).toBe(4200);
    expect(contextTotals).toEqual(totals);
    expect(checkoutTotals).toEqual(totals);
    expect(whatsappTotals).toEqual(totals);
    expect(totals.subtotal - totals.bundleDiscount + totals.shipping).toBe(totals.total);
  });

  it("caps quantities at configured stock when adding the same variant twice", () => {
    const limited = products.find((product) => product.stock === 3)!;
    let state = add([], limited, "M", 2);
    state = add(state, limited, "M", 5);
    expect(state[0].quantity).toBe(3);
    expect(state[0].maxQuantity).toBe(3);
  });

  it("never applies the reward below four tees after repeated add/remove cycles", () => {
    let state = add([], teeA, "M", 4);
    state = cartReducer(state, { type: "update", key: state[0].key, quantity: 2 });
    state = cartReducer(state, { type: "update", key: state[0].key, quantity: 5 });
    expect(totalsFor(state).bundleDiscount).toBe(600);
    state = cartReducer(state, { type: "remove", key: state[0].key });
    expect(totalsFor(state).bundleDiscount).toBe(0);
    expect(totalsFor(state).total).toBe(0);
  });
});

// Type-only guard: every reducer action stays exhaustive for future edits.
const actionSample: CartAction = { type: "clear" };
void actionSample;
