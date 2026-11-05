"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useEffect } from "react";
import { BundleProgress } from "@/components/cart/BundleProgress";
import { useCart } from "@/context/CartContext";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, bundleMessage } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

const VISIBLE_MS = 8000;

/**
 * A quiet, corner-anchored confirmation — not a modal. It never traps focus
 * and dismisses itself, so the customer is interrupted at most once per add.
 */
export function AddToCartNotice() {
  const { addNotice, dismissAddNotice, totals, openDrawer, hydrated } = useCart();
  const reduceMotion = useReducedMotion();
  const visible = Boolean(addNotice) && hydrated;

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(dismissAddNotice, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [addNotice, visible, dismissAddNotice]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissAddNotice();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, dismissAddNotice]);

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {visible && addNotice && (
          <motion.section
            key={addNotice.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-sm border border-ink/20 bg-paper/98 p-5 shadow-[0_28px_70px_-38px_rgba(17,17,15,0.55)] backdrop-blur-sm sm:p-6"
            aria-label="Added to bag"
            role="status"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                <Check size={12} strokeWidth={2} aria-hidden="true" />
                Added to bag · {addNotice.quantity} {addNotice.quantity === 1 ? "piece" : "pieces"}
              </p>
              <button
                type="button"
                onClick={dismissAddNotice}
                className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
                aria-label="Dismiss added-to-bag notice"
              >
                <X size={15} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <h2 className="mt-3 text-xl font-semibold uppercase leading-none tracking-[-0.04em]">
              {totals.bundleUnlocked ? "Reward unlocked." : "Good choice."}
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">{bundleMessage(totals)}</p>

            <BundleProgress totals={totals} className="mt-4" showMessage={false} />

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/15 pt-3 text-[10px] uppercase tracking-[0.08em]">
              <span className="text-muted">
                {totals.itemCount} {totals.itemCount === 1 ? "tee" : "tees"} · {String(Math.min(totals.itemCount, BUNDLE_QUANTITY)).padStart(2, "0")}/{String(BUNDLE_QUANTITY).padStart(2, "0")}
              </span>
              <span className="text-muted">
                Subtotal <span className="ml-1 font-semibold tabular-nums text-ink">{formatINR(totals.subtotal)}</span>
              </span>
            </div>

            {totals.bundleUnlocked && (
              <dl className="mt-3 space-y-1.5 border border-ink/15 bg-chalk px-3 py-2.5 text-[10px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Bundle discount</dt>
                  <dd className="font-medium tabular-nums">−{formatINR(totals.bundleDiscount)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold uppercase tracking-[0.06em]">Payable</dt>
                  <dd className="font-semibold tabular-nums">{formatINR(totals.total)}</dd>
                </div>
              </dl>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={dismissAddNotice}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex min-h-10 items-center gap-2 border border-ink bg-ink px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-chalk transition-colors hover:bg-transparent hover:text-ink"
              >
                View bag <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>

            {!totals.bundleUnlocked && (
              <p className="mt-3 text-[9px] uppercase tracking-[0.1em] text-muted">
                {formatINR(BUNDLE_DISCOUNT)} off automatically at {BUNDLE_QUANTITY} tees
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
