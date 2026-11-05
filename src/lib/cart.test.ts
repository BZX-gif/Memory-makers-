import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { BUY_NOW_STORAGE_KEY, CART_STORAGE_KEY, cartItemKey, cartReducer, createCartItem, normalizeCartItems, readStoredBuyNow, readStoredCart, remainingStockForProduct } from "@/lib/cart";
import { lowStockProduct, memoryStorage, multiColorProduct as product, picturedProduct, soldOutProduct, untrackedStockProduct } from "@/test/fixtures";
import type { CartItem, Product } from "@/types";
import { getSizeOptions } from "@/lib/products";
import { calculateOrderTotals, UNIT_PRICE } from "@/lib/pricing";

const blue = product.availableColors[0];
const grey = product.availableColors[1];

describe("cart variants and quantities", () => {
  it("stores the store price, never a caller-supplied amount", () => {
    const item = createCartItem(product, "XL", blue, 2)!;
    expect(item).toMatchObject({
      key: cartItemKey(product.id, "XL", blue.name),
      productId: product.id,
      price: UNIT_PRICE,
      compareAtPrice: 1200,
      size: "XL",
      quantity: 2,
    });
  });

  it("uses the selected colour photograph, not always the first image", () => {
    const item = createCartItem(product, "M", grey)!;
    expect(item.image).toBe(product.images[1]);
    expect(item.color).toEqual(grey);
  });

  it("keeps the same product in different sizes and colours separate", () => {
    const selections = [createCartItem(product, "L", blue)!, createCartItem(product, "XL", blue)!, createCartItem(product, "L", grey)!];
    const state = selections.reduce((items, item) => cartReducer(items, { type: "add", item }), [] as typeof selections);
    expect(state).toHaveLength(3);
    expect(new Set(state.map((item) => item.key)).size).toBe(3);
  });

  it("combines identical variants, updates, removes and clears", () => {
    const item = createCartItem(product, "L", blue, 3)!;
    let state = cartReducer([], { type: "add", item });
    state = cartReducer(state, { type: "add", item });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(6);
    state = cartReducer(state, { type: "update", key: item.key, quantity: 2 });
    expect(state[0].quantity).toBe(2);
    expect(cartReducer(state, { type: "remove", key: item.key })).toEqual([]);
    expect(cartReducer(state, { type: "clear" })).toEqual([]);
    expect(cartReducer([], { type: "hydrate", items: state })).toEqual(state);
  });

  it.each([[-2, 1], [0, 1], [0.8, 1], [4.9, 4], [100, 10], [NaN, 1], [Infinity, 1]])("clamps quantity %s to %s", (input, expected) => {
    expect(createCartItem(product, "L", blue, input)?.quantity).toBe(expected);
  });

  it("never lets a customer add more than the configured stock", () => {
    const item = createCartItem(lowStockProduct, "M", lowStockProduct.availableColors[0], 9)!;
    expect(item.maxQuantity).toBe(5);
    expect(item.quantity).toBe(5);

    let state = cartReducer([], { type: "add", item });
    state = cartReducer(state, { type: "add", item });
    expect(state[0].quantity).toBe(5);
    state = cartReducer(state, { type: "update", key: item.key, quantity: 9 });
    expect(state[0].quantity).toBe(5);
  });

  it("shares one product's stock across its colour variants", () => {
    const stockFive = { ...lowStockProduct, availableColors: [blue, grey], images: lowStockProduct.images };
    const a = createCartItem(stockFive, "M", blue, 3)!;
    const b = createCartItem(stockFive, "M", grey, 2)!;
    expect(remainingStockForProduct([], stockFive.id, a.maxQuantity)).toBe(5);
    expect(remainingStockForProduct([a], stockFive.id, a.maxQuantity)).toBe(2);
    expect(remainingStockForProduct([a, b], stockFive.id, a.maxQuantity)).toBe(0);

    let state = cartReducer([], { type: "add", item: a });
    state = cartReducer(state, { type: "add", item: b });
    const total = state.reduce((count, entry) => count + entry.quantity, 0);
    expect(total).toBeLessThanOrEqual(5);

    // Updating one variant can never push the product above its stock.
    state = cartReducer(state, { type: "update", key: a.key, quantity: 9 });
    expect(state.reduce((count, entry) => count + entry.quantity, 0)).toBeLessThanOrEqual(5);
  });

  it("allows up to ten per variant when stock is not tracked", () => {
    const item = createCartItem(untrackedStockProduct, "M", untrackedStockProduct.availableColors[0], 25)!;
    expect(item.maxQuantity).toBe(10);
    expect(item.quantity).toBe(10);
  });

  it("rejects sold-out products and invalid options", () => {
    expect(createCartItem(soldOutProduct, "M", soldOutProduct.availableColors[0])).toBeNull();
    expect(createCartItem(product, "INVALID", blue)).toBeNull();
    expect(createCartItem(product, "M", { name: "Invented", hex: "#fff" })).toBeNull();
  });

  it("supports owner-confirmed sizes without offering fallback sizes", () => {
    const verified = { ...picturedProduct, availableSizes: ["M"] };
    expect(createCartItem(verified, "M", verified.availableColors[0])?.price).toBe(600);
    expect(createCartItem(verified, "S", verified.availableColors[0])).toBeNull();
  });

  it.each([-1, NaN, Infinity, undefined, "100", 0])("ignores a tampered catalogue price %s and keeps ₹600", (price) => {
    const invalid = { ...product, price } as Product;
    expect(createCartItem(invalid, "M", blue)?.price).toBe(UNIT_PRICE);
  });
});

describe("cart totals and persistence", () => {
  it("produces the documented totals from real cart items", () => {
    const item = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0], 4)!;
    expect(calculateOrderTotals([item])).toMatchObject({ itemCount: 4, subtotal: 2400, bundleDiscount: 600, shipping: 0, total: 1800 });
    expect(calculateOrderTotals([{ ...item, quantity: 8 }]).total).toBe(4200);
  });

  it("drops malformed and retired entries", () => {
    const recovered = normalizeCartItems([
      null, "bad", {}, { productId: "missing", size: "M", color: blue },
      { productId: "mm-001", size: "M", color: { name: "Washed Black" }, price: 1299 },
      { productId: soldOutProduct.id, size: "M", color: soldOutProduct.availableColors[0], quantity: 1 },
      { productId: picturedProduct.id, size: "M", color: picturedProduct.availableColors[0], quantity: 2 },
    ], [picturedProduct, soldOutProduct]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].productId).toBe(picturedProduct.id);
    expect(normalizeCartItems({ items: [] })).toEqual([]);
  });

  it("ignores tampered prices, names, image paths, keys and colour swatches", () => {
    const [recovered] = normalizeCartItems([
      { key: "tampered", productId: product.id, price: 1, image: "/fake.jpg", name: "Tampered", size: "M", color: { name: grey.name, hex: "#fff", image: "/fake.jpg" }, quantity: 1 },
    ], [product]);
    expect(recovered).toEqual(createCartItem(product, "M", grey));
    expect(recovered.price).toBe(600);
  });

  it("merges duplicate persisted variants safely and clamps to stock", () => {
    const recovered = normalizeCartItems([
      { productId: product.id, size: "M", color: blue, quantity: 8 },
      { productId: product.id, size: "M", color: blue, quantity: 8 },
    ], [product]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].quantity).toBe(Math.min(product.stock ?? 10, 10));
  });

  it("round-trips real products through the existing v1 storage key", () => {
    const items = products.filter((item) => item.inStock !== false).map((item) => createCartItem(item, getSizeOptions(item)[0], item.availableColors[0])!);
    const storage = memoryStorage({ [CART_STORAGE_KEY]: JSON.stringify({ version: 1, items }) });
    expect(readStoredCart(storage)).toEqual(items);
  });

  it.each(["invalid-json", "null", "[]", "42", '{"items":"bad"}'])("recovers safely from corrupt storage: %s", (value) => {
    const storage = memoryStorage({ [CART_STORAGE_KEY]: value, [BUY_NOW_STORAGE_KEY]: value });
    expect(readStoredCart(storage)).toEqual([]);
    expect(readStoredBuyNow(storage)).toBeNull();
  });

  it("keeps Buy Now independent from the main bag and preserves its colour", () => {
    const bagItem = createCartItem(picturedProduct, "M", picturedProduct.availableColors[0])!;
    const buyNowItem = createCartItem(product, "L", grey, 2)!;
    const bag = JSON.stringify({ version: 1, items: [bagItem] });
    const storage = memoryStorage({ [CART_STORAGE_KEY]: bag, [BUY_NOW_STORAGE_KEY]: JSON.stringify(buyNowItem) });
    expect(readStoredBuyNow(storage, [product])).toEqual(buyNowItem);
    expect(readStoredCart(storage, [picturedProduct])).toEqual([bagItem]);
    expect(storage.getItem(CART_STORAGE_KEY)).toBe(bag);
  });

  it("drops a retired Buy Now item rather than mapping it to a new garment", () => {
    const storage = memoryStorage({ [BUY_NOW_STORAGE_KEY]: JSON.stringify({ productId: "mm-001", size: "M", color: { name: "Washed Black" } }) });
    expect(readStoredBuyNow(storage)).toBeNull();
  });

  it("handles storage read failures", () => {
    const storage = memoryStorage();
    storage.getItem = () => { throw new Error("Storage denied"); };
    expect(readStoredCart(storage)).toEqual([]);
    expect(readStoredBuyNow(storage)).toBeNull();
  });

  it("rebuilds a refreshed cart with the same totals", () => {
    const item = createCartItem(lowStockProduct, "L", lowStockProduct.availableColors[0], 4)!;
    const storage = memoryStorage({ [CART_STORAGE_KEY]: JSON.stringify({ version: 1, items: [item] }) });
    const restored: CartItem[] = readStoredCart(storage);
    expect(restored).toEqual([item]);
    expect(calculateOrderTotals(restored).total).toBe(calculateOrderTotals([item]).total);
  });
});
