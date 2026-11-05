"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, startBuyNow } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState(product.availableColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const validateSelection = () => {
    if (!product.inStock) {
      setError("This sample product is currently unavailable.");
      return false;
    }
    if (!size || !product.availableSizes.includes(size)) {
      setError("Choose a size before continuing.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAdd = () => {
    if (!validateSelection()) return;
    if (addItem(product, size, color, quantity)) {
      setAdded(true);
    } else {
      setError("This selection could not be added. Please review the available options.");
    }
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    if (startBuyNow(product, size, color, quantity)) {
      router.push("/checkout?mode=buy-now");
    } else {
      setError("This selection is not available for Buy Now.");
    }
  };

  return (
    <div className="lg:sticky lg:top-36">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-muted">{product.category}</p>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-ink" : "bg-muted"}`} />
          {product.inStock ? "Available to request" : "Currently unavailable"}
        </p>
      </div>
      <h1 className="mt-5 text-[clamp(2.9rem,5vw,5.8rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em]">{product.name}</h1>
      <p className="mt-5 text-lg font-medium tabular-nums">{formatINR(product.price)}</p>
      <p className="mt-6 max-w-lg text-sm leading-7 text-muted">{product.description}</p>

      <div className="mt-9 border-t border-ink/20 pt-7">
        <div>
          <fieldset disabled={!product.inStock} className="border-0 p-0">
            <legend className="eyebrow w-full">
              <span className="flex items-center justify-between gap-4">
                <span>Select size <span className="text-muted">/ Required</span></span>
                {size && <span className="text-[10px] font-normal normal-case tracking-normal text-muted">Selected: {size}</span>}
              </span>
            </legend>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.availableSizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setSize(option); setError(""); setAdded(false); }}
                aria-pressed={size === option}
                className={`h-12 border text-xs font-medium transition-colors ${size === option ? "border-ink bg-ink text-chalk" : "border-ink/25 hover:border-ink"}`}
              >
                {option}
              </button>
            ))}
            </div>
          </fieldset>

          <fieldset disabled={!product.inStock} className="mt-7 border-0 p-0">
            <legend className="eyebrow">Colour <span className="font-normal normal-case tracking-normal text-muted">— {color.name}</span></legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.availableColors.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => { setColor(option); setAdded(false); }}
                  className={`flex h-11 items-center gap-2 border px-3 text-[10px] uppercase tracking-[0.08em] transition-colors ${color.name === option.name ? "border-ink" : "border-ink/20 hover:border-ink/60"}`}
                  aria-pressed={color.name === option.name}
                >
                  <span className="h-4 w-4 rounded-full border border-ink/20" style={{ backgroundColor: option.hex }} />
                  {option.name}
                  {color.name === option.name && <Check size={12} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex items-center justify-between gap-4">
            <span className="eyebrow">Quantity</span>
            <QuantityControl quantity={quantity} onChange={(value) => { setQuantity(value); setAdded(false); }} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden text-xs font-medium text-[#9d291f]" role="alert">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {!product.inStock && (
          <p className="mt-6 border border-ink/20 p-4 text-xs leading-relaxed text-muted">This demonstration item is marked unavailable in the catalogue. Adding it to the bag and Buy Now are disabled.</p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <button type="button" onClick={handleAdd} disabled={!product.inStock} className="button-dark w-full">
            <ShoppingBag size={15} strokeWidth={1.5} /> Add to bag
          </button>
          <button type="button" onClick={handleBuyNow} disabled={!product.inStock} className="button-light w-full">
            Buy now <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </div>

        <AnimatePresence>
          {added && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center justify-between gap-4 border-b border-ink/20 pb-4 text-xs" role="status">
              <span className="flex items-center gap-2"><Check size={14} /> Added to your bag.</span>
              <Link href="/cart" className="font-semibold underline underline-offset-4">View bag</Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-muted"><MessageCircle size={14} className="mt-0.5 shrink-0" strokeWidth={1.5} /> Buy Now opens checkout for this piece only. Your existing bag stays saved.</p>

        <div className="mt-8 border-t border-ink/20">
          <details className="group border-b border-ink/20 py-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">Product details <span className="text-lg font-light group-open:rotate-45">+</span></summary>
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted">
              {product.details.map((detail) => <li key={detail}>— {detail}</li>)}
            </ul>
            <p className="mt-4 text-[10px] leading-relaxed text-muted">Demonstration specifications. The owner must add verified garment and fit information before launch.</p>
          </details>
          <details className="group border-b border-ink/20 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">Ordering & delivery <span className="text-lg font-light group-open:rotate-45">+</span></summary>
            <p className="mt-4 text-xs leading-6 text-muted">No payment is taken here. Send your request on WhatsApp; the team will confirm availability, delivery and any shipping charge with you.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
