"use client";

import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BundleProgress } from "@/components/cart/BundleProgress";
import { OrderBreakdown } from "@/components/cart/OrderBreakdown";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { useCart } from "@/context/CartContext";
import { calculateLineTotal, SHIPPING_LABEL } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

export function CartView() {
  const { items, totals, hydrated, removeItem, updateQuantity, clearCart } = useCart();
  const { itemCount } = totals;

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

  return (
    <div className="frame py-10 sm:py-16">
      <header className="flex flex-col justify-between gap-5 border-b border-ink/20 pb-7 sm:flex-row sm:items-end sm:pb-8">
        <div>
          <p className="eyebrow text-muted">Your selection / {String(itemCount).padStart(2, "0")} {itemCount === 1 ? "piece" : "pieces"}</p>
          <h1 className="mt-4 text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.84] tracking-tightest">Your <span className="font-serif font-normal normal-case italic tracking-normal">bag.</span></h1>
        </div>
        <button type="button" onClick={clearCart} className="self-start text-[10px] uppercase tracking-[0.12em] text-muted underline underline-offset-4 transition-colors hover:text-ink sm:self-auto">Clear bag</button>
      </header>

      <p className="mt-5 inline-flex items-center gap-2 border border-ink/15 bg-chalk px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em]">
        <Truck size={13} strokeWidth={1.5} aria-hidden="true" /> Shipping {SHIPPING_LABEL} on every order
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-10">
        <section className="lg:col-span-8" aria-label="Items in your bag">
          <BundleProgress totals={totals} className="mb-2 max-w-md" />
          <ul className="mt-6 border-t border-ink/15">
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[92px_1fr] gap-4 border-b border-ink/15 py-6 sm:grid-cols-[140px_1fr] sm:gap-6 sm:py-7">
                <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] self-start overflow-hidden bg-stone">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 92px, 140px" className="object-contain" />
                </Link>
                <div className="flex min-w-0 flex-col justify-between gap-4">
                  <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-3">
                    <div className="min-w-0">
                      <Link href={`/product/${item.slug}`} className="text-[13px] font-semibold uppercase leading-snug tracking-[-0.02em] hover:underline sm:text-lg">{item.name}</Link>
                      <dl className="mt-2.5 space-y-1.5 text-[10px] uppercase tracking-[0.08em] text-muted sm:text-[11px]">
                        <div className="flex gap-2"><dt>Size:</dt><dd className="text-ink">{item.size}</dd></div>
                        <div className="flex items-center gap-2"><dt>Colour:</dt><dd className="flex items-center gap-1.5 text-ink"><span className="h-2.5 w-2.5 rounded-full border border-ink/20" style={{ backgroundColor: item.color.hex }} />{item.color.name}</dd></div>
                        <div className="flex flex-wrap items-center gap-2"><dt>Unit price:</dt><dd className="tabular-nums text-ink">{formatINR(item.price)} <span className="ml-1 text-muted line-through">{formatINR(item.compareAtPrice)}</span></dd></div>
                      </dl>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums sm:text-base">{formatINR(calculateLineTotal(item))}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QuantityControl compact quantity={item.quantity} max={item.maxQuantity} onChange={(quantity) => updateQuantity(item.key, quantity)} label={`quantity for ${item.name}, size ${item.size}`} />
                    <button type="button" onClick={() => removeItem(item.key)} className="inline-flex min-h-9 items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink" aria-label={`Remove ${item.name}, size ${item.size}, ${item.color.name}`}>
                      <Trash2 size={14} strokeWidth={1.4} aria-hidden="true" /><span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="text-link mt-8"><ArrowLeft size={14} /> Continue shopping</Link>
        </section>

        <aside className="h-fit bg-chalk p-5 sm:p-8 lg:sticky lg:top-36 lg:col-span-4" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-xl font-semibold uppercase tracking-[-0.035em]">Order summary</h2>
          <OrderBreakdown totals={totals} className="mt-6" />
          <Link href="/checkout" className="button-dark mt-7 flex w-full">Proceed to checkout <ArrowRight size={15} /></Link>
          <p className="mt-5 text-[10px] leading-5 text-muted">No payment is collected online. Your request is sent on WhatsApp and confirmed by the team.</p>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[9px] uppercase tracking-[0.1em] text-muted">Bag saved locally on this device.</p>
        </aside>
      </div>
    </div>
  );
}
