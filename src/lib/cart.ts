import { products } from "@/data/products";
import type { CartItem, Product, ProductColor } from "@/types";
import { clampQuantity } from "@/lib/utils";

export const CART_STORAGE_KEY = "memory-makers:cart:v1";
export const BUY_NOW_STORAGE_KEY = "memory-makers:buy-now:v1";
export const ORDER_STORAGE_PREFIX = "memory-makers:order:";

export function cartItemKey(productId: string, size: string, colorName: string) {
  return `${productId}::${size}::${colorName}`;
}

export function createCartItem(
  product: Product,
  size: string,
  color: ProductColor,
  quantity = 1,
): CartItem | null {
  const verifiedColor = product.availableColors.find((candidate) => candidate.name === color.name);
  if (
    !product.inStock ||
    !product.availableSizes.includes(size) ||
    !verifiedColor ||
    !product.images[0] ||
    !Number.isFinite(product.price) ||
    product.price < 0
  ) {
    return null;
  }

  return {
    key: cartItemKey(product.id, size, verifiedColor.name),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0],
    size,
    color: verifiedColor,
    quantity: clampQuantity(quantity),
  };
}

/** Rebuild persisted items from trusted catalogue data; ignore malformed entries. */
export function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const normalized: CartItem[] = [];

  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const raw = candidate as Record<string, unknown>;
    if (typeof raw.productId !== "string" || typeof raw.size !== "string") continue;

    const product = products.find((item) => item.id === raw.productId);
    const rawColor = raw.color as Record<string, unknown> | undefined;
    if (!product || !rawColor || typeof rawColor.name !== "string") continue;

    const item = createCartItem(
      product,
      raw.size,
      { name: rawColor.name, hex: "" },
      typeof raw.quantity === "number" ? raw.quantity : 1,
    );
    if (!item) continue;

    const existing = normalized.find((entry) => entry.key === item.key);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + item.quantity);
    } else {
      normalized.push(item);
    }
  }

  return normalized;
}

export type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; key: string }
  | { type: "update"; key: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((item) => item.key === action.item.key);
      if (!existing) return [...state, action.item];
      return state.map((item) =>
        item.key === action.item.key
          ? { ...item, quantity: clampQuantity(item.quantity + action.item.quantity) }
          : item,
      );
    }
    case "remove":
      return state.filter((item) => item.key !== action.key);
    case "update":
      return state.map((item) =>
        item.key === action.key
          ? { ...item, quantity: clampQuantity(action.quantity) }
          : item,
      );
    case "clear":
      return [];
    case "hydrate":
      return action.items;
    default:
      return state;
  }
}

export function readStoredCart(storage: Storage): CartItem[] {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return [];
    return normalizeCartItems((parsed as { items?: unknown }).items);
  } catch {
    return [];
  }
}

export function readStoredBuyNow(storage: Storage): CartItem | null {
  try {
    const raw = storage.getItem(BUY_NOW_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCartItems([JSON.parse(raw)])[0] ?? null;
  } catch {
    return null;
  }
}
