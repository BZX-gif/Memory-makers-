"use client";

import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { calculateLineTotal, formatINR, calculateCartDiscount } from "@/lib/utils";

export function CartView() {
  const { items, itemCount, subtotal, hydrated, removeItem, updateQuantity, clearCart } = useCart();

  if (!hydrated) {
    return (
      <div className="frame py-16" role="status" aria-label="Loading your shopping bag">
        <div className="h-8 w-44 animate-pulse bg-stone/70" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="h-64 animate-pulse bg-stone/50 lg:col-span-8" />
          <div className="h-64 animate-pulse bg-stone/50 lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="frame flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <ShoppingBag size={35} strokeWidth={1.1} aria-hidden="true" />
        <p className="eyebrow mt-8 text-muted">Your bag / 00 pieces</p>
        <h1 className="mt-5 text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.84] tracking-tightest">Nothing<br /><span className="font-serif font-normal normal-case italic tracking-normal">to remember yet.</span></h1>
        <p className="mt-7 max-w-sm text-sm leading-7 text-muted">Start with a graphic, a phrase or a piece of art. Your selected sizes and colours will be saved here on this device.</p>
        <Link href="/shop" className="button-dark mt-8">Explore the collection <ArrowRight size={15} /></Link>
      </div>
    );
  }

  // Calculate discount
  const discount = calculateCartDiscount(items);
  const finalTotal = subtotal !== null ? subtotal - discount : null;

  return (
    <div className="frame py-12 sm:py-16">
      <header className="flex flex-col justify-between gap-5 border-b border-ink/20 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-muted">Your selection / {String(itemCount).padStart(2, "0")} {itemCount === 1 ? "piece" : "pieces"}</p>
          <h1 className="mt-4 text-[clamp(3.8rem,8vw,8rem)] font-black uppercase leading-[0.84] tracking-tightest">Your <span className="font-serif font-normal normal-case italic tracking-normal">bag.</span></h1>
        </div>
        <button type="button" onClick={clearCart} className="self-start text-[10px] uppercase tracking-[0.12em] text-muted underline underline-offset-4 transition-colors hover:text-ink sm:self-auto">Clear bag</button>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <section className="lg:col-span-8" aria-label="Items in your bag">
          <ul>
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[104px_1fr] gap-4 border-b border-ink/15 pb-7 pt-7 first:pt-0 sm:grid-cols-[150px_1fr] sm:gap-6">
                <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] self-start overflow-hidden bg-stone">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 104px, 150px" className="object-contain" />
                </Link>
                <div className="flex min-w-0 flex-col justify-between gap-5">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-sm font-semibold uppercase tracking-[-0.02em] hover:underline sm:text-lg">{item.name}</Link>
                      <dl className="mt-3 space-y-1.5 text-[10px] uppercase tracking-[0.08em] text-muted sm:text-[11px]">
                        <div className="flex gap-2"><dt>Requested size:</dt><dd className="text-ink">{item.size}</dd></div>
                        <div className="flex items-center gap-2"><dt>Colour:</dt><dd className="flex items-center gap-1.5 text-ink"><span className="h-2.5 w-2.5 rounded-full border border-ink/20" style={{ backgroundColor: item.color.hex }} />{item.color.name}</dd></div>
                        <div className="flex gap-2"><dt>Unit price:</dt><dd className="tabular-nums text-ink">{formatINR(600)}</dd></div>
                      </dl>
                    </div>
                    <p className="shrink-0 text-xs font-semibold tabular-nums sm:text-base">{formatINR(calculateLineTotal(item), "To confirm")}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QuantityControl compact quantity={item.quantity} onChange={(quantity) => updateQuantity(item.key, quantity)} label={`quantity for ${item.name}, size ${item.size}`} />
                    <button type="button" onClick={() => removeItem(item.key)} className="inline-flex min-h-9 items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink" aria-label={`Remove ${item.name}, size ${item.size}, ${item.color.name}`}>
                      <Trash2 size={14} strokeWidth={1.4} /><span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="text-link mt-8"><ArrowLeft size={14} /> Continue shopping</Link>
        </section>

        <aside className="h-fit bg-chalk p-6 sm:p-8 lg:sticky lg:top-36 lg:col-span-4" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-xl font-semibold uppercase tracking-[-0.035em]">Order summary</h2>
          <dl className="mt-7 space-y-4 border-b border-ink/15 pb-6 text-xs">
            <div className="flex justify-between gap-4"><dt className="text-muted">Product subtotal</dt><dd className="font-medium tabular-nums">{formatINR(subtotal, "To confirm")}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Buy 4, Get 1 Free discount</dt>
                <dd className="font-medium tabular-nums text-red-500">-{formatINR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4"><dt className="text-muted">Shipping</dt><dd className="text-right">Confirmed on WhatsApp</dd></div>
          </dl>
          <div className="flex items-end justify-between gap-4 py-6">
            <div><p className="text-sm font-semibold uppercase">Product total</p><p className="mt-1 text-[9px] text-muted">Before any confirmed delivery charge</p></div>
            <p className="text-xl font-semibold tabular-nums">{formatINR(finalTotal, "To confirm")}</p>
          </div>
          {subtotal === null && <p className="mb-5 text-xs leading-6 text-muted">One or more product prices are awaiting confirmation. No monetary total is available yet.</p>}
          <Link href="/checkout" className="button-dark w-full">Proceed to checkout <ArrowRight size={15} /></Link>
          <p className="mt-5 text-[10px] leading-5 text-muted">No payment is collected. Prices, requested sizes, pictured colours and stock must be confirmed by the team; nothing is reserved by adding it to your bag.</p>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[9px] uppercase tracking-[0.1em] text-muted">Bag saved locally on this device.</p>
        </aside>
      </div>
    </div>
  );
}
