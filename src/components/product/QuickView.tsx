"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye, ShoppingBag, Truck, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { getMaxQuantity, getProductImage, getSizeOptions, getStockScarcity, isProductSoldOut } from "@/lib/products";
import { ORIGINAL_UNIT_PRICE, SHIPPING_LABEL, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import type { Product, ProductColor } from "@/types";

/**
 * Compact quick view from a product card. Same price, stock and cart rules as
 * the product page; adding here also raises the shared add-to-bag notice.
 */
export function QuickView({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, startBuyNow } = useCart();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<ProductColor>(product.availableColors[0]);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  const soldOut = isProductSoldOut(product);
  const inBag = items
    .filter((item) => item.productId === product.id)
    .reduce((total, item) => total + item.quantity, 0);
  const maxQuantity = Math.max(1, Math.min(getMaxQuantity(product), getMaxQuantity(product) - inBag));
  const scarcity = getStockScarcity(product);
  const image = getProductImage(product, color.name);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const validate = () => {
    if (soldOut) {
      setError("This piece is sold out.");
      return false;
    }
    if (!size) {
      setError("Choose a size before continuing.");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    if (addItem(product, size, color, quantity)) {
      setOpen(false);
      setError("");
    } else {
      setError(inBag >= getMaxQuantity(product) ? "Your bag already holds every available piece of this design." : "This selection could not be added. Please review the available options.");
    }
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    if (startBuyNow(product, size, color, quantity)) {
      setOpen(false);
      router.push("/checkout?mode=buy-now");
    } else {
      setError("This selection is not available for Buy Now.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-9 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
        aria-label={`Quick view ${product.name}`}
      >
        <Eye size={13} strokeWidth={1.5} aria-hidden="true" /> Quick view
      </button>

      <AnimatePresence>
        {open && (
          <motion.div key="quick-view" className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
            <motion.div
              className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`quick-view-${product.id}`}
              className="relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto border border-ink/20 bg-paper shadow-[0_40px_120px_-40px_rgba(17,17,15,0.65)]"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center bg-paper/80 text-ink backdrop-blur transition-opacity hover:opacity-55"
                aria-label="Close quick view"
              >
                <X size={20} strokeWidth={1.4} aria-hidden="true" />
              </button>

              <div className="grid sm:grid-cols-2">
                <div className="relative aspect-[4/5] bg-stone sm:aspect-auto sm:min-h-[32rem]">
                  <Image src={image} alt={`${product.name} in ${color.name}`} fill sizes="(max-width: 640px) 100vw, 380px" className="object-contain" />
                  {scarcity && (
                    <span className="absolute left-4 top-4 border border-ink/25 bg-paper/95 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em]">
                      {scarcity.label}
                    </span>
                  )}
                </div>

                <div className="flex flex-col p-5 sm:p-7">
                  <p className="eyebrow text-muted">{product.category}</p>
                  <h2 id={`quick-view-${product.id}`} className="mt-3 text-2xl font-semibold uppercase leading-[0.95] tracking-[-0.04em]">
                    {product.name}
                  </h2>

                  <p className="mt-4 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-semibold tabular-nums tracking-[-0.03em]">{formatINR(UNIT_PRICE)}</span>
                    <span className="text-sm text-muted line-through">{formatINR(ORIGINAL_UNIT_PRICE)}</span>
                    <span className="border border-ink/25 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]">50% off</span>
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                    <Truck size={12} strokeWidth={1.5} aria-hidden="true" /> Shipping {SHIPPING_LABEL} · 4 tees = ₹600 off
                  </p>

                  <p className="mt-4 line-clamp-3 text-xs leading-6 text-muted">{product.description}</p>

                  <fieldset className="mt-5 border-0 p-0" disabled={soldOut}>
                    <legend className="eyebrow">
                      Size <span className="text-muted">/ Required</span>
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getSizeOptions(product).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSize(option); setError(""); }}
                          aria-pressed={size === option}
                          className={`min-w-11 border px-3 py-2 text-[11px] font-medium transition-colors ${size === option ? "border-ink bg-ink text-chalk" : "border-ink/25 hover:border-ink"}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-4 border-0 p-0" disabled={soldOut}>
                    <legend className="eyebrow">Colour</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.availableColors.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setColor(option)}
                          aria-pressed={color.name === option.name}
                          className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.08em] transition-colors ${color.name === option.name ? "border-ink" : "border-ink/20 hover:border-ink/60"}`}
                        >
                          <span className="h-3 w-3 rounded-full border border-ink/20" style={{ backgroundColor: option.hex }} />
                          {option.name}
                          {color.name === option.name && <Check size={11} aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="eyebrow">Quantity</span>
                    <QuantityControl quantity={quantity} max={maxQuantity} compact onChange={(value) => setQuantity(value)} label="quick view quantity" />
                  </div>

                  {error && <p className="mt-3 text-[11px] font-medium text-[#9d291f]" role="alert">{error}</p>}
                  {soldOut && <p className="mt-3 text-[11px] text-muted">Sold out — this piece cannot be added.</p>}

                  <div className="mt-auto grid gap-2 pt-5">
                    <button type="button" onClick={handleAdd} disabled={soldOut} className="button-dark w-full">
                      <ShoppingBag size={14} strokeWidth={1.5} aria-hidden="true" /> Add to bag
                    </button>
                    <button type="button" onClick={handleBuyNow} disabled={soldOut} className="button-light w-full">
                      Buy now <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
