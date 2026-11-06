"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { productDisplayTitle } from "@/lib/seo";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/types";

interface StickyBuyBarProps {
  product: Product;
  size: string;
  soldOut: boolean;
  onAdd: () => void;
  onChooseSize: () => void;
}

/**
 * Mobile conversion bar: once the purchase panel scrolls out of view, the
 * price and the next honest action stay one thumb-reach away.
 */
export function StickyBuyBar({ product, size, soldOut, onAdd, onChooseSize }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = document.getElementById("purchase-cta");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { y: 72 }}
          animate={{ y: 0 }}
          exit={reduceMotion ? undefined : { y: 72 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/20 bg-paper/95 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center justify-between gap-4 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.06em]">{productDisplayTitle(product)}</p>
              <p className="mt-0.5 flex items-baseline gap-2 text-[11px] tabular-nums">
                <span className="font-bold">{formatINR(UNIT_PRICE)}</span>
                <span className="text-muted line-through">{formatINR(ORIGINAL_UNIT_PRICE)}</span>
                <span className="text-muted">· free shipping</span>
              </p>
            </div>
            {soldOut ? (
              <span className="shrink-0 border border-ink/25 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Sold out</span>
            ) : size ? (
              <button type="button" onClick={onAdd} className="button-dark shrink-0 px-5 py-3">
                <ShoppingBag size={14} strokeWidth={1.6} aria-hidden="true" /> Add to bag
              </button>
            ) : (
              <button type="button" onClick={onChooseSize} className="button-dark shrink-0 px-5 py-3">
                Choose size
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
