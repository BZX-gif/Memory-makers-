import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { BUY_NOW_STORAGE_KEY, CART_STORAGE_KEY, cartItemKey, cartReducer, createCartItem, normalizeCartItems, readStoredBuyNow, readStoredCart } from "@/lib/cart";
import { memoryStorage, multiColorProduct as product, picturedProduct, pricedProduct, unavailableProduct } from "@/test/fixtures";
import type { Product } from "@/types";
import { getSizeOptions } from "@/lib/products";

const blue = product.availableColors[0];
const grey = product.availableColors[1];

describe("cart variants and quantities", () => {
  it("allows an unpriced request without pretending availability is confirmed", () => {
    const item = createCartItem(product, "XL", blue, 2);
    expect(product.inStock).toBeNull();
    expect(item).toMatchObject({ key: cartItemKey(product.id, "XL", blue.name), productId: product.id, price: null, size: "XL", quantity: 2 });
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
    const item = createCartItem(product, "L", blue, 8)!;
    let state = cartReducer([], { type: "add", item });
    state = cartReducer(state, { type: "add", item });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(10);
    state = cartReducer(state, { type: "update", key: item.key, quantity: 3 });
    expect(state[0].quantity).toBe(3);
    expect(cartReducer(state, { type: "remove", key: item.key })).toEqual([]);
    expect(cartReducer(state, { type: "clear" })).toEqual([]);
    expect(cartReducer([], { type: "hydrate", items: state })).toEqual(state);
  });

  it.each([[-2, 1], [0, 1], [0.8, 1], [4.9, 4], [100, 10], [NaN, 1], [Infinity, 1]])("clamps quantity %s to %s", (input, expected) => {
    expect(createCartItem(product, "L", blue, input)?.quantity).toBe(expected);
  });

  it("rejects unavailable products and invalid options", () => {
    expect(createCartItem(unavailableProduct, "M", blue)).toBeNull();
    expect(createCartItem(product, "INVALID", blue)).toBeNull();
    expect(createCartItem(product, "M", { name: "Invented", hex: "#fff" })).toBeNull();
  });

  it("supports owner-confirmed sizes and prices without offering fallback sizes", () => {
    const verified = { ...pricedProduct, availableSizes: ["M"] };
    expect(createCartItem(verified, "M", verified.availableColors[0])?.price).toBe(1200);
    expect(createCartItem(verified, "S", verified.availableColors[0])).toBeNull();
  });

  it.each([-1, NaN, Infinity, undefined, "100"]) ("rejects invalid price %s rather than turning it into a free item", (price) => {
    const invalid = { ...product, price } as Product;
    expect(createCartItem(invalid, "M", blue)).toBeNull();
  });
});

describe("persisted cart recovery", () => {
  it("drops malformed, retired demo and explicitly unavailable entries", () => {
    const recovered = normalizeCartItems([
      null, "bad", {}, { productId: "missing", size: "M", color: blue },
      { productId: "mm-001", size: "M", color: { name: "Washed Black" }, price: 1299 },
      { productId: unavailableProduct.id, size: "M", color: blue, quantity: 1 },
      { productId: picturedProduct.id, size: "M", color: picturedProduct.availableColors[0], quantity: 2 },
    ], [picturedProduct, unavailableProduct]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].productId).toBe(picturedProduct.id);
    expect(normalizeCartItems({ items: [] })).toEqual([]);
  });

  it("ignores tampered prices, names, image paths, keys and colour swatches", () => {
    const [recovered] = normalizeCartItems([
      { key: "tampered", productId: product.id, price: 0, image: "/fake.jpg", name: "Tampered", size: "M", color: { name: grey.name, hex: "#fff", image: "/fake.jpg" }, quantity: 1 },
    ], [product]);
    expect(recovered).toEqual(createCartItem(product, "M", grey));
    expect(recovered.price).toBeNull();
  });

  it("merges duplicate persisted variants safely", () => {
    const recovered = normalizeCartItems([
      { productId: product.id, size: "M", color: blue, quantity: 8 },
      { productId: product.id, size: "M", color: blue, quantity: 8 },
    ], [product]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].quantity).toBe(10);
  });

  it("round-trips requestable real products using trusted business data through existing v1 storage", () => {
    const items = products.filter((item) => item.inStock !== false).map((item) => createCartItem(item, getSizeOptions(item)[0], item.availableColors[0])!);
    const storage = memoryStorage({ [CART_STORAGE_KEY]: JSON.stringify({ version: 1, items }) });
    expect(readStoredCart(storage)).toEqual(items);
  });

  it.each(["invalid-json", "null", "[]", "42", '{"items":"bad"}']) ("recovers safely from corrupt storage: %s", (value) => {
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
});
