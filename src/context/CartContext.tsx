"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BUY_NOW_STORAGE_KEY,
  CART_STORAGE_KEY,
  cartReducer,
  createCartItem,
  readStoredBuyNow,
  remainingStockForProduct,
  readStoredCart,
} from "@/lib/cart";
import { calculateOrderTotals, type OrderTotals } from "@/lib/pricing";
import { clampQuantity } from "@/lib/utils";
import type { CartItem, Product, ProductColor } from "@/types";

export interface AddNotice {
  id: number;
  productName: string;
  /** Quantity of the tee as it now sits in the bag. */
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  /** The single shared pricing result for every money display. */
  totals: OrderTotals;
  hydrated: boolean;
  buyNowItem: CartItem | null;
  addItem: (product: Product, size: string, color: ProductColor, quantity?: number) => boolean;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  startBuyNow: (product: Product, size: string, color: ProductColor, quantity?: number) => boolean;
  clearBuyNow: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addNotice: AddNotice | null;
  dismissAddNotice: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addNotice, setAddNotice] = useState<AddNotice | null>(null);
  const noticeId = useRef(0);

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

      // The product, not the colour variant, owns the stock count.
      const available = remainingStockForProduct(items, product.id, item.maxQuantity);
      if (available <= 0) return false;

      const cappedItem = { ...item, quantity: clampQuantity(item.quantity, available) };
      dispatch({ type: "add", item: cappedItem });
      noticeId.current += 1;
      setAddNotice({ id: noticeId.current, productName: product.name, quantity: cappedItem.quantity });
      return true;
    },
    [items],
  );

  const openDrawer = useCallback(() => {
    setAddNotice(null);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const dismissAddNotice = useCallback(() => setAddNotice(null), []);

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
      totals: calculateOrderTotals(items),
      hydrated,
      buyNowItem,
      addItem,
      removeItem: (key) => dispatch({ type: "remove", key }),
      updateQuantity: (key, quantity) => dispatch({ type: "update", key, quantity }),
      clearCart: () => {
        dispatch({ type: "clear" });
        setAddNotice(null);
      },
      startBuyNow,
      clearBuyNow: () => setBuyNowItem(null),
      drawerOpen,
      openDrawer,
      closeDrawer,
      addNotice,
      dismissAddNotice,
    }),
    [items, hydrated, buyNowItem, addItem, startBuyNow, drawerOpen, openDrawer, closeDrawer, addNotice, dismissAddNotice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
