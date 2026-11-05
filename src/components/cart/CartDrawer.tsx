"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BundleProgress } from "@/components/cart/BundleProgress";
import { OrderBreakdown } from "@/components/cart/OrderBreakdown";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { calculateLineTotal, SHIPPING_LABEL } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

/** The premium slide-over bag. One page-level instance, opened from anywhere. */
export function CartDrawer() {
  const { items, totals, hydrated, drawerOpen, closeDrawer, removeItem, updateQuantity } = useCart();
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Close on navigation so the bag never lingers over a new page.
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
      if (event.key !== "Tab") return;
      const panel = document.getElementById("cart-drawer-panel");
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div key="cart-drawer" className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            aria-hidden="true"
          />

          <motion.aside
            id="cart-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
            className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col border-l border-ink/20 bg-paper shadow-[-30px_0_80px_-40px_rgba(17,17,15,0.6)]"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-ink/15 px-5 pb-5 pt-5 sm:px-6">
              <div>
                <p className="eyebrow text-muted">
                  Your bag / {String(totals.itemCount).padStart(2, "0")} {totals.itemCount === 1 ? "piece" : "pieces"}
                </p>
                <h2 id="cart-drawer-heading" className="mt-2 text-2xl font-semibold uppercase leading-none tracking-[-0.04em]">
                  Selected <span className="font-serif font-normal normal-case italic tracking-normal">pieces.</span>
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="-mr-2 -mt-1 inline-flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-55"
                aria-label="Close bag"
              >
                <X size={21} strokeWidth={1.4} aria-hidden="true" />
              </button>
            </header>

            <div className="flex items-center gap-2 border-b border-ink/10 bg-chalk px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] sm:px-6">
              <Truck size={13} strokeWidth={1.5} aria-hidden="true" />
              Free shipping · {SHIPPING_LABEL} on every order
            </div>

            {!hydrated ? (
              <div className="flex-1 space-y-4 px-5 py-6 sm:px-6" role="status" aria-label="Loading your bag">
                <div className="h-24 animate-pulse bg-stone/50" />
                <div className="h-24 animate-pulse bg-stone/50" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 py-14 text-center">
                <ShoppingBag size={30} strokeWidth={1.2} aria-hidden="true" />
                <p className="mt-6 font-serif text-3xl italic">Nothing here yet.</p>
                <p className="mt-3 text-xs leading-6 text-muted">Add a piece and it will wait for you here, saved on this device.</p>
                <Link href="/shop" onClick={closeDrawer} className="button-dark mt-7">
                  Explore the collection <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                  <BundleProgress totals={totals} />
                  <ul className="mt-5 divide-y divide-ink/10 border-t border-ink/10">
                    {items.map((item) => (
                      <li key={item.key} className="grid grid-cols-[68px_1fr] gap-4 py-4">
                        <Link href={`/product/${item.slug}`} onClick={closeDrawer} className="relative aspect-[3/4] self-start overflow-hidden bg-stone">
                          <Image src={item.image} alt={item.name} fill sizes="68px" className="object-contain" />
                        </Link>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <Link href={`/product/${item.slug}`} onClick={closeDrawer} className="text-[11px] font-semibold uppercase leading-snug tracking-[-0.01em] hover:underline">
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
                              aria-label={`Remove ${item.name}, size ${item.size}, ${item.color.name}`}
                            >
                              <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                          <p className="mt-1.5 text-[9px] uppercase tracking-[0.08em] text-muted">
                            Size {item.size} · {item.color.name}
                          </p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-muted">
                            <span className="line-through">{formatINR(item.compareAtPrice)}</span>
                            <span className="ml-1.5 text-ink">{formatINR(item.price)}</span> each
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <QuantityControl
                              compact
                              quantity={item.quantity}
                              max={item.maxQuantity}
                              onChange={(quantity) => updateQuantity(item.key, quantity)}
                              label={`quantity for ${item.name}, size ${item.size}`}
                            />
                            <p className="text-xs font-semibold tabular-nums">{formatINR(calculateLineTotal(item))}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="border-t border-ink/15 bg-chalk px-5 pb-5 pt-5 sm:px-6">
                  <OrderBreakdown totals={totals} size="compact" />
                  <Link href="/checkout" onClick={closeDrawer} className="button-dark mt-5 w-full">
                    Checkout on WhatsApp <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="mt-3 block text-center text-[9px] uppercase tracking-[0.14em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    View full bag
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
