"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { getAvailabilityLabel, getMaxQuantity, getSizeOptions, getStockScarcity, isProductSoldOut } from "@/lib/products";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, ORIGINAL_UNIT_PRICE, SHIPPING_LABEL, UNIT_PRICE } from "@/lib/pricing";
import type { Product, ProductColor } from "@/types";

export function ProductPurchase({ product, color, onColorChange }: {
  product: Product;
  color: ProductColor;
  onColorChange: (color: ProductColor) => void;
}) {
  const router = useRouter();
  const { items, addItem, startBuyNow } = useCart();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const sizeOptions = getSizeOptions(product);
  const sizesUnconfirmed = product.availableSizes.length === 0;
  const soldOut = isProductSoldOut(product);
  const scarcity = getStockScarcity(product);
  const inBag = items
    .filter((item) => item.productId === product.id)
    .reduce((total, item) => total + item.quantity, 0);
  const maxQuantity = Math.max(1, Math.min(getMaxQuantity(product), getMaxQuantity(product) - inBag));

  const validateSelection = () => {
    if (soldOut) {
      setError("This piece is currently sold out.");
      return false;
    }
    if (!size || !sizeOptions.includes(size)) {
      setError("Choose a size before continuing.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAdd = () => {
    if (!validateSelection()) return;
    if (!addItem(product, size, color, quantity)) {
      setError(inBag >= getMaxQuantity(product) ? "Your bag already holds every available piece of this design." : "This selection could not be added. Please review the available options.");
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
          <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-muted" : "bg-ink"}`} />
          {getAvailabilityLabel(product)}
        </p>
      </div>
      <h1 className="mt-5 text-[clamp(2.3rem,4vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em]">{product.name}</h1>

      <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-2xl font-bold tabular-nums tracking-[-0.03em] sm:text-3xl">{formatINR(UNIT_PRICE)}</span>
        <span className="text-base text-muted line-through sm:text-lg">{formatINR(ORIGINAL_UNIT_PRICE)}</span>
        <span className="border border-ink/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]">50% off</span>
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
        <span className="inline-flex items-center gap-1.5"><Truck size={13} strokeWidth={1.5} aria-hidden="true" /> Shipping {SHIPPING_LABEL}</span>
        <span aria-hidden="true">/</span>
        <span>{BUNDLE_QUANTITY} tees = ₹{BUNDLE_DISCOUNT} off</span>
      </p>

      {scarcity && (
        <p className={`mt-4 inline-flex border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${scarcity.tone === "out" ? "border-ink bg-ink text-chalk" : "border-ink/30 bg-chalk text-ink"}`}>
          {scarcity.label}
        </p>
      )}

      {product.name.startsWith("Sample ") && <p className="mt-4 text-[10px] uppercase tracking-[0.1em] text-muted">Editable descriptive label / Official name to confirm</p>}
      <p className="mt-5 max-w-lg text-sm leading-7 text-muted">{product.description}</p>

      <div className="mt-9 border-t border-ink/20 pt-7">
        <div>
          <fieldset disabled={soldOut} className="border-0 p-0">
            <legend className="eyebrow w-full">
              <span className="flex items-center justify-between gap-4">
                <span>Select size <span className="text-muted">/ Required</span></span>
                {size && <span className="text-[10px] font-normal normal-case tracking-normal text-muted">Selected: {size}</span>}
              </span>
            </legend>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { setSize(option); setError(""); }}
                  aria-pressed={size === option}
                  className={`h-12 border text-xs font-medium transition-colors ${size === option ? "border-ink bg-ink text-chalk" : "border-ink/25 hover:border-ink"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          {sizesUnconfirmed && <p className="mt-3 text-[10px] leading-relaxed text-muted">Size labels are requests — the team confirms fit and measurements on WhatsApp.</p>}

          <fieldset disabled={soldOut} className="mt-7 border-0 p-0">
            <legend className="eyebrow">Colour <span className="font-normal normal-case tracking-normal text-muted">— {color.name}</span></legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.availableColors.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => onColorChange(option)}
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
            <QuantityControl quantity={quantity} max={maxQuantity} onChange={setQuantity} label="product quantity" />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden text-xs font-medium text-[#9d291f]" role="alert">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {soldOut && (
          <p className="mt-6 border border-ink/20 p-4 text-xs leading-relaxed text-muted">This piece is sold out. Add to bag and Buy Now are disabled.</p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <button type="button" onClick={handleAdd} disabled={soldOut} className="button-dark w-full">
            <ShoppingBag size={15} strokeWidth={1.5} aria-hidden="true" /> Add to bag
          </button>
          <button type="button" onClick={handleBuyNow} disabled={soldOut} className="button-light w-full">
            Buy now <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-muted"><MessageCircle size={14} className="mt-0.5 shrink-0" strokeWidth={1.5} aria-hidden="true" /> Buy Now opens checkout for this piece only. Your existing bag stays saved.</p>

        <div className="mt-8 border-t border-ink/20">
          <details className="group border-b border-ink/20 py-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">Product details <span className="text-lg font-light group-open:rotate-45">+</span></summary>
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted">
              {product.details.map((detail) => <li key={detail}>— {detail}</li>)}
            </ul>
          </details>
          <details className="group border-b border-ink/20 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em]">Ordering & delivery <span className="text-lg font-light group-open:rotate-45">+</span></summary>
            <p className="mt-4 text-xs leading-6 text-muted">₹600 per tee with free shipping. Add four or more tees and ₹600 is taken off the order once. No payment is taken here — send your request on WhatsApp and the team confirms delivery details with you.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
