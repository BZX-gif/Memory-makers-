"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { readOrderDraft } from "@/lib/order";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { OrderDraft } from "@/types";

export function OrderHandoff({ reference }: { reference: string }) {
  const router = useRouter();
  const { clearCart, clearBuyNow } = useCart();
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readOrderDraft(window.localStorage, reference) || readOrderDraft(window.sessionStorage, reference);
    setDraft(saved);
    setLoaded(true);
  }, [reference]);

  const copyMessage = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = draft.message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand("copy");
      textarea.remove();
      setCopied(successful);
      if (successful) window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const finish = () => {
    if (draft?.source === "cart") clearCart();
    if (draft?.source === "buy-now") clearBuyNow();
    router.push("/shop");
  };

  if (!loaded) {
    return <div className="frame flex min-h-[65vh] items-center justify-center" role="status"><p className="eyebrow">Finding your order request…</p></div>;
  }

  if (!draft) {
    return (
      <div className="frame flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <MessageCircle size={34} strokeWidth={1.2} />
        <p className="eyebrow mt-7 text-muted">Order request / Not found</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl">We couldn’t find<br /><span className="font-serif font-normal normal-case italic tracking-normal">that request.</span></h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-muted">Order handoffs are stored only in the browser that prepared them. Return to your saved bag and prepare the WhatsApp message again. No order has been placed.</p>
        <Link href="/cart" className="button-dark mt-8"><ArrowLeft size={15} /> Return to your bag</Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(draft.message);

  return (
    <div className="frame py-12 sm:py-16">
      <header className="max-w-5xl">
        <p className="eyebrow text-muted">Order request / {draft.reference}</p>
        <h1 className="mt-5 text-[clamp(3.8rem,8vw,8.5rem)] font-black uppercase leading-[0.82] tracking-tightest">One last<br /><span className="font-serif font-normal normal-case italic tracking-normal">step.</span></h1>
      </header>

      <div className="mt-10 border-y border-ink bg-ink px-5 py-5 text-chalk sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-7">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.04em]">Not ordered yet.</p>
          <p className="mt-2 text-xs leading-relaxed text-chalk/65">WhatsApp may have opened in another tab. Review the message there and press Send yourself.</p>
        </div>
        <p className="eyebrow mt-4 shrink-0 text-chalk/50 sm:mt-0">Awaiting your message</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="text-xl font-semibold uppercase tracking-[-0.03em]">What happens next</h2>
            <ol className="mt-7 border-t border-ink/15">
              {[
                ["01", "Open WhatsApp", "Use the button below if it did not open automatically. On mobile it can open the app; on desktop it can open WhatsApp Web."],
                ["02", "Review and press Send", `Check reference ${draft.reference}, your products and delivery details. Nothing is sent to the store until you press Send.`],
                ["03", "Wait for the team", "The business must confirm availability, delivery, final charges and acceptance. A sent message is still a request, not a confirmation."],
              ].map(([number, title, copy]) => (
                <li key={number} className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[45px_1fr]">
                  <span className="eyebrow text-muted">{number}</span>
                  <div><h3 className="text-sm font-semibold uppercase">{title}</h3><p className="mt-2 text-xs leading-6 text-muted">{copy}</p></div>
                </li>
              ))}
            </ol>
          </section>

          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-dark mt-8 w-full sm:w-auto sm:min-w-72">
              <MessageCircle size={16} strokeWidth={1.5} /> Open WhatsApp & review <ArrowUpRight size={15} />
            </a>
          ) : (
            <p className="mt-8 border border-[#9d291f]/40 p-4 text-xs leading-6 text-[#79221b]" role="alert">The store WhatsApp number is not configured. Copy your message below and contact the owner once the business number is available. Nothing has been sent.</p>
          )}
          <button type="button" onClick={copyMessage} className="button-light mt-3 w-full sm:ml-3 sm:w-auto">
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Message copied" : "Copy order message"}
          </button>

          <details className="mt-9 border-y border-ink/15 py-5">
            <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.1em]">Review prepared message</summary>
            <pre className="mt-5 max-h-[480px] overflow-auto whitespace-pre-wrap break-words bg-chalk p-5 font-sans text-xs leading-6 text-muted">{draft.message}</pre>
          </details>
        </div>

        <aside className="h-fit bg-chalk p-6 sm:p-7 lg:col-span-5" aria-labelledby="request-summary">
          <div className="flex items-center justify-between border-b border-ink/15 pb-5">
            <h2 id="request-summary" className="text-lg font-semibold uppercase tracking-[-0.03em]">Request summary</h2>
            <p className="text-[10px] font-medium">{draft.reference}</p>
          </div>
          <ul className="divide-y divide-ink/10">
            {draft.items.map((item) => (
              <li key={item.key} className="grid grid-cols-[56px_1fr_auto] gap-3 py-5">
                <div className="relative aspect-[4/5] bg-stone"><Image src={item.image} alt="" fill sizes="56px" className="object-cover" /></div>
                <div><h3 className="text-[11px] font-semibold uppercase">{item.name}</h3><p className="mt-2 text-[9px] leading-relaxed text-muted">{item.size} / {item.color.name}<br />Qty {item.quantity} × {formatINR(item.price)}</p></div>
                <p className="text-[11px] font-medium tabular-nums">{formatINR(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between border-t border-ink/20 pt-5">
            <div><p className="text-xs font-semibold uppercase">Product total</p><p className="mt-1 text-[9px] text-muted">Shipping confirmed separately</p></div>
            <p className="text-lg font-semibold tabular-nums">{formatINR(draft.total)}</p>
          </div>
          <dl className="mt-6 space-y-2 border-t border-ink/15 pt-5 text-[10px] leading-relaxed text-muted">
            <div className="flex gap-3"><dt className="w-12 shrink-0">Name</dt><dd className="text-ink">{draft.customer.fullName}</dd></div>
            <div className="flex gap-3"><dt className="w-12 shrink-0">Mobile</dt><dd className="text-ink">{draft.customer.mobile}</dd></div>
            <div className="flex gap-3"><dt className="w-12 shrink-0">Send to</dt><dd className="text-ink">{draft.customer.address}, {draft.customer.city}, {draft.customer.state} — {draft.customer.pinCode}</dd></div>
          </dl>
        </aside>
      </div>

      <div className="mt-14 flex flex-col justify-between gap-5 border-t border-ink/15 pt-7 sm:flex-row sm:items-center">
        <p className="max-w-md text-[10px] leading-5 text-muted">Your main bag is intentionally kept until you choose to clear it. This prevents losing pieces if WhatsApp did not open or you did not press Send.</p>
        <button type="button" onClick={finish} className="text-link shrink-0">
          {draft.source === "cart" ? <ShoppingBag size={14} /> : <ArrowRight size={14} />}
          {draft.source === "cart" ? "Clear bag & return to shop" : "Finish & return to shop"}
        </button>
      </div>
    </div>
  );
}
