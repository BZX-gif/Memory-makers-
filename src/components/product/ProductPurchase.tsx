"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { getAvailabilityLabel, getSizeOptions } from "@/lib/products";
import type { Product, ProductColor } from "@/types";

export function ProductPurchase({ product, color, onColorChange }: {
  product: Product;
  color: ProductColor;
  onColorChange: (color: ProductColor) => void;
}) {
  const router = useRouter();
  const { addItem, startBuyNow } = useCart();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const sizeOptions = getSizeOptions(product);
  const sizesUnconfirmed = product.availableSizes.length === 0;
  const unavailable = product.inStock === false;

  useEffect(() => setAdded(false), [color.name]);

  const validateSelection = () => {
    if (unavailable) {
      setError("This product is currently unavailable.");
      return false;
    }
    if (!size || !sizeOptions.includes(size)) {
      setError("Choose a requested size before continuing.");
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow text-muted">{product.category}</p>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${product.inStock === true ? "bg-ink" : "bg-muted"}`} />
          {getAvailabilityLabel(product)}
        </p>
      </div>
      <h1 className="mt-5 text-[clamp(2.3rem,4vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em]">{product.name}</h1>
      <p className="mt-5 text-lg font-medium tabular-nums">{formatINR(product.price)}</p>
      {product.name.startsWith("Sample ") && <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-muted">Editable descriptive label / Official name to confirm</p>}
      <p className="mt-6 max-w-lg text-sm leading-7 text-muted">{product.description}</p>
      {(product.price === null || product.inStock === null) && (
        <p className="mt-4 border border-ink/15 bg-chalk p-4 text-xs leading-6 text-muted">Price and availability must be confirmed by the owner. Add to bag and Buy Now prepare a request only; they do not reserve stock or collect payment.</p>
      )}

      <div className="mt-9 border-t border-ink/20 pt-7">
        <div>
          <fieldset disabled={unavailable} className="border-0 p-0">
            <legend className="eyebrow w-full">
              <span className="flex items-center justify-between gap-4">
                <span>{sizesUnconfirmed ? "Request size" : "Select size"} <span className="text-muted">/ Required</span></span>
                {size && <span className="text-[10px] font-normal normal-case tracking-normal text-muted">Selected: {size}</span>}
              </span>
            </legend>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {sizeOptions.map((option) => (
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

          {sizesUnconfirmed && <p className="mt-3 text-[10px] leading-relaxed text-muted">Sample size labels only, not verified stock or measurements. Select your preferred label; the team must confirm the size and fit.</p>}

          <fieldset disabled={unavailable} className="mt-7 border-0 p-0">
            <legend className="eyebrow">Pictured colour <span className="font-normal normal-case tracking-normal text-muted">— {color.name}</span></legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.availableColors.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => { onColorChange(option); setAdded(false); }}
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

        {unavailable && (
          <p className="mt-6 border border-ink/20 p-4 text-xs leading-relaxed text-muted">The owner has marked this product unavailable. Adding it to the bag and Buy Now are disabled.</p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <button type="button" onClick={handleAdd} disabled={unavailable} className="button-dark w-full">
            <ShoppingBag size={15} strokeWidth={1.5} /> Add to bag
          </button>
          <button type="button" onClick={handleBuyNow} disabled={unavailable} className="button-light w-full">
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
            <p className="mt-4 text-[10px] leading-relaxed text-muted">Only visible features are described above. Material, fit and measurements are awaiting owner confirmation; claims printed inside supplied photographs have not been verified.</p>
          </details>
          <details className="group border-b border-ink/20 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">Ordering & delivery <span className="text-lg font-light group-open:rotate-45">+</span></summary>
            <p className="mt-4 text-xs leading-6 text-muted">No payment is taken here. Send your request on WhatsApp; the team must confirm the price, requested size, availability, delivery and any shipping charge with you.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
