"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  BUY_NOW_STORAGE_KEY,
  CART_STORAGE_KEY,
  cartReducer,
  createCartItem,
  readStoredBuyNow,
  readStoredCart,
} from "@/lib/cart";
import { calculateSubtotal } from "@/lib/utils";
import type { CartItem, Product, ProductColor } from "@/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  buyNowItem: CartItem | null;
  addItem: (product: Product, size: string, color: ProductColor, quantity?: number) => boolean;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  startBuyNow: (product: Product, size: string, color: ProductColor, quantity?: number) => boolean;
  clearBuyNow: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", items: readStoredCart(window.localStorage) });
    setBuyNowItem(readStoredBuyNow(window.localStorage));
    setHydrated(true);

    const syncCart = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        dispatch({ type: "hydrate", items: readStoredCart(window.localStorage) });
      }
      if (event.key === BUY_NOW_STORAGE_KEY) {
        setBuyNowItem(readStoredBuyNow(window.localStorage));
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items }));
    } catch {
      // Storage can be unavailable in private mode; the in-memory cart still works.
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (buyNowItem) {
        window.localStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(buyNowItem));
      } else {
        window.localStorage.removeItem(BUY_NOW_STORAGE_KEY);
      }
    } catch {
      // Keep the temporary checkout item in memory if storage is unavailable.
    }
  }, [buyNowItem, hydrated]);

  const addItem = useCallback(
    (product: Product, size: string, color: ProductColor, quantity = 1) => {
      const item = createCartItem(product, size, color, quantity);
      if (!item) return false;
      dispatch({ type: "add", item });
      return true;
    },
    [],
  );

  const startBuyNow = useCallback(
    (product: Product, size: string, color: ProductColor, quantity = 1) => {
      const item = createCartItem(product, size, color, quantity);
      if (!item) return false;
      setBuyNowItem(item);
      return true;
    },
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: calculateSubtotal(items),
      hydrated,
      buyNowItem,
      addItem,
      removeItem: (key) => dispatch({ type: "remove", key }),
      updateQuantity: (key, quantity) => dispatch({ type: "update", key, quantity }),
      clearCart: () => dispatch({ type: "clear" }),
      startBuyNow,
      clearBuyNow: () => setBuyNowItem(null),
    }),
    [items, hydrated, buyNowItem, addItem, startBuyNow],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
