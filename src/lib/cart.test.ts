import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { cartItemKey, cartReducer, createCartItem, normalizeCartItems } from "@/lib/cart";

const available = products.find((product) => product.slug === "after-hours")!;
const unavailable = products.find((product) => product.slug === "memory-no-01")!;
const black = available.availableColors[0];
const bone = available.availableColors[1];

describe("cart variants and quantities", () => {
  it("creates a variant-aware item using catalogue data", () => {
    const item = createCartItem(available, "XL", black, 2);
    expect(item).toMatchObject({
      key: cartItemKey(available.id, "XL", black.name),
      productId: available.id,
      price: available.price,
      size: "XL",
      quantity: 2,
    });
  });

  it("keeps the same product in different sizes and colours separate", () => {
    const large = createCartItem(available, "L", black)!;
    const extraLarge = createCartItem(available, "XL", black)!;
    const largeBone = createCartItem(available, "L", bone)!;
    let state = cartReducer([], { type: "add", item: large });
    state = cartReducer(state, { type: "add", item: extraLarge });
    state = cartReducer(state, { type: "add", item: largeBone });
    expect(state).toHaveLength(3);
  });

  it("combines identical variants and clamps quantity to ten", () => {
    const item = createCartItem(available, "L", black, 8)!;
    let state = cartReducer([], { type: "add", item });
    state = cartReducer(state, { type: "add", item });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(10);
    state = cartReducer(state, { type: "update", key: item.key, quantity: 3 });
    expect(state[0].quantity).toBe(3);
    state = cartReducer(state, { type: "remove", key: item.key });
    expect(state).toEqual([]);
  });

  it("rejects unavailable products and invalid options", () => {
    expect(createCartItem(unavailable, "M", unavailable.availableColors[0])).toBeNull();
    expect(createCartItem(available, "INVALID", black)).toBeNull();
    expect(createCartItem(available, "M", { name: "Invented", hex: "#fff" })).toBeNull();
  });
});

describe("persisted cart recovery", () => {
  it("drops malformed and unavailable entries", () => {
    const recovered = normalizeCartItems([
      null,
      "bad",
      { productId: "missing", size: "M", color: { name: "Black" }, quantity: 1 },
      { productId: unavailable.id, size: "M", color: unavailable.availableColors[0], quantity: 1 },
      { productId: available.id, size: "M", color: black, quantity: 2 },
    ]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].productId).toBe(available.id);
  });

  it("ignores browser-tampered prices and restores trusted catalogue values", () => {
    const [recovered] = normalizeCartItems([
      { productId: available.id, price: 1, name: "Tampered", size: "M", color: black, quantity: 1 },
    ]);
    expect(recovered.price).toBe(available.price);
    expect(recovered.name).toBe(available.name);
  });

  it("merges duplicate persisted variants safely", () => {
    const recovered = normalizeCartItems([
      { productId: available.id, size: "M", color: black, quantity: 8 },
      { productId: available.id, size: "M", color: black, quantity: 8 },
    ]);
    expect(recovered).toHaveLength(1);
    expect(recovered[0].quantity).toBe(10);
  });
});
