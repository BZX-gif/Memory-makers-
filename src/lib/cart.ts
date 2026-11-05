import { products } from "@/data/products";
import type { CartItem, Product, ProductColor } from "@/types";
import { clampQuantity } from "@/lib/utils";
import { ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { getMaxQuantity, getProductImage, getSizeOptions, isProductSoldOut } from "@/lib/products";

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
    isProductSoldOut(product) ||
    !getSizeOptions(product).includes(size) ||
    !verifiedColor ||
    !product.images[0]
  ) {
    return null;
  }

  const maxQuantity = getMaxQuantity(product);

  return {
    key: cartItemKey(product.id, size, verifiedColor.name),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    // Store policy price, not a value supplied by the browser or the caller.
    price: UNIT_PRICE,
    compareAtPrice: ORIGINAL_UNIT_PRICE,
    maxQuantity,
    image: getProductImage(product, verifiedColor.name),
    size,
    color: verifiedColor,
    quantity: clampQuantity(quantity, maxQuantity),
  };
}

/** Rebuild persisted items from trusted catalogue data; ignore malformed entries. */
export function normalizeCartItems(value: unknown, catalogue: Product[] = products): CartItem[] {
  if (!Array.isArray(value)) return [];
  const normalized: CartItem[] = [];

  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const raw = candidate as Record<string, unknown>;
    if (typeof raw.productId !== "string" || typeof raw.size !== "string") continue;

    const product = catalogue.find((item) => item.id === raw.productId);
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
      existing.quantity = clampQuantity(existing.quantity + item.quantity, existing.maxQuantity);
    } else {
      normalized.push(item);
    }
  }

  return normalized;
}

/**
 * Stock is configured per product, not per colour. This returns how many more
 * pieces of that product the bag may still hold across every variant.
 */
export function remainingStockForProduct(items: CartItem[], productId: string, maxQuantity: number) {
  const inBag = items
    .filter((item) => item.productId === productId)
    .reduce((total, item) => total + item.quantity, 0);
  return Math.max(0, maxQuantity - inBag);
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
          ? { ...item, quantity: clampQuantity(item.quantity + action.item.quantity, item.maxQuantity) }
          : item,
      );
    }
    case "remove":
      return state.filter((item) => item.key !== action.key);
    case "update":
      return state.map((item) => {
        if (item.key !== action.key) return item;
        const otherVariants = state
          .filter((entry) => entry.productId === item.productId && entry.key !== item.key)
          .reduce((total, entry) => total + entry.quantity, 0);
        const ceiling = Math.max(1, item.maxQuantity - otherVariants);
        return { ...item, quantity: clampQuantity(action.quantity, ceiling) };
      });
    case "clear":
      return [];
    case "hydrate":
      return action.items;
    default:
      return state;
  }
}

export function readStoredCart(storage: Storage, catalogue: Product[] = products): CartItem[] {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return [];
    return normalizeCartItems((parsed as { items?: unknown }).items, catalogue);
  } catch {
    return [];
  }
}

export function readStoredBuyNow(storage: Storage, catalogue: Product[] = products): CartItem | null {
  try {
    const raw = storage.getItem(BUY_NOW_STORAGE_KEY);
    if (!raw) return null;
    return normalizeCartItems([JSON.parse(raw)], catalogue)[0] ?? null;
  } catch {
    return null;
  }
}
