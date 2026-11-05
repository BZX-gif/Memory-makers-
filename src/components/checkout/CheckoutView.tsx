"use client";

import { ArrowLeft, ArrowRight, Info, LockKeyhole, MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { FormField } from "@/components/checkout/FormField";
import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { saveOrderDraft } from "@/lib/order";
import { calculateSubtotal, formatINR } from "@/lib/utils";
import { hasCheckoutErrors, validateCheckout } from "@/lib/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl, generateOrderReference } from "@/lib/whatsapp";
import type { CheckoutCustomer, CheckoutErrors, OrderDraft } from "@/types";

const emptyCustomer: CheckoutCustomer = {
  fullName: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  instructions: "",
};

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, itemCount, buyNowItem, hydrated } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(emptyCustomer);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState("");
  const isBuyNow = searchParams.get("mode") === "buy-now";
  const checkoutItems = useMemo(() => (isBuyNow ? (buyNowItem ? [buyNowItem] : []) : items), [buyNowItem, isBuyNow, items]);
  const subtotal = calculateSubtotal(checkoutItems);

  const updateField = (field: keyof CheckoutCustomer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (checkoutItems.length === 0) {
      setSubmitError("Your checkout is empty. Add a piece before continuing.");
      return;
    }

    const nextErrors = validateCheckout(customer);
    setErrors(nextErrors);
    if (hasCheckoutErrors(nextErrors)) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    const reference = generateOrderReference();
    const cleanCustomer = {
      ...customer,
      fullName: customer.fullName.trim(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      pinCode: customer.pinCode.trim(),
      instructions: customer.instructions.trim(),
    };
    const message = buildWhatsAppMessage({ reference, customer: cleanCustomer, items: checkoutItems });
    const whatsappUrl = buildWhatsAppUrl(message);

    if (!whatsappUrl) {
      setSubmitError("WhatsApp checkout is not configured yet. The owner must add a real WhatsApp Business number in src/config/store.ts. No message was opened or sent.");
      return;
    }

    const draft: OrderDraft = {
      reference,
      createdAt: new Date().toISOString(),
      source: isBuyNow ? "buy-now" : "cart",
      customer: cleanCustomer,
      items: checkoutItems,
      subtotal,
      total: subtotal,
      message,
    };

    const savedLocally = saveOrderDraft(window.localStorage, draft);
    const savedForSession = savedLocally || saveOrderDraft(window.sessionStorage, draft);

    // This must remain in the submit click handler so mobile browsers allow it.
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (!savedForSession) {
      setSubmitError("WhatsApp was asked to open, but this browser could not save your handoff summary. Your complete order is in the WhatsApp message; review it and press Send there yourself.");
      return;
    }

    // Do not silently clear the main bag: opening WhatsApp is not proof of ordering.
    router.push(`/order/${reference}`);
  };

  if (!hydrated) {
    return (
      <div className="frame py-16" role="status" aria-label="Loading checkout">
        <div className="h-16 w-2/3 animate-pulse bg-stone/60" />
        <div className="mt-12 grid gap-8 lg:grid-cols-2"><div className="h-96 animate-pulse bg-stone/50" /><div className="h-96 animate-pulse bg-stone/50" /></div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="frame flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <ShoppingBag size={34} strokeWidth={1.2} />
        <p className="eyebrow mt-7 text-muted">Checkout / Nothing to check out</p>
        <h1 className="mt-5 text-5xl font-semibold uppercase tracking-[-0.055em] sm:text-7xl">{isBuyNow ? "Selection missing." : "Your bag is empty."}</h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-muted">{isBuyNow ? "Your Buy Now selection may have expired or been cleared. Your main shopping bag has not been changed." : "Choose a piece, size and colour before coming to checkout."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="button-dark">Explore collection <ArrowRight size={15} /></Link>
          {isBuyNow && items.length > 0 && <Link href="/checkout" className="button-light">Checkout your bag instead</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="frame py-12 sm:py-16">
      <header className="border-b border-ink/20 pb-8">
        <Link href={isBuyNow ? `/product/${checkoutItems[0].slug}` : "/cart"} className="text-link mb-8"><ArrowLeft size={14} /> {isBuyNow ? "Back to product" : "Back to bag"}</Link>
        <p className="eyebrow text-muted">{isBuyNow ? "Direct checkout / This piece only" : "Review your selection / Order request"}</p>
        <h1 className="mt-4 text-[clamp(3.7rem,8vw,8rem)] font-black uppercase leading-[0.84] tracking-tightest">Almost <span className="font-serif font-normal normal-case italic tracking-normal">yours.</span></h1>
        {isBuyNow && <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted"><Info size={14} className="mt-0.5 shrink-0" /> Only this Buy Now item is included. Your bag{itemCount > 0 ? ` with ${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""} remains saved separately.</p>}
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <form onSubmit={handleSubmit} noValidate className="order-2 lg:order-1 lg:col-span-7" aria-label="Delivery and customer information">
          <section aria-labelledby="customer-heading">
            <div className="mb-7 flex items-baseline gap-4">
              <span className="eyebrow text-muted">01</span>
              <h2 id="customer-heading" className="text-xl font-semibold uppercase tracking-[-0.03em]">Customer details</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField label="Full name" name="fullName" autoComplete="name" placeholder="Your full name" value={customer.fullName} onChange={(event) => updateField("fullName", event.target.value)} error={errors.fullName} maxLength={81} />
              <FormField label="Mobile number" name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={customer.mobile} onChange={(event) => updateField("mobile", event.target.value)} error={errors.mobile} maxLength={16} />
            </div>
          </section>

          <section className="mt-12" aria-labelledby="delivery-heading">
            <div className="mb-7 flex items-baseline gap-4">
              <span className="eyebrow text-muted">02</span>
              <h2 id="delivery-heading" className="text-xl font-semibold uppercase tracking-[-0.03em]">Delivery address</h2>
            </div>
            <div className="space-y-6">
              <FormField textarea label="Complete delivery address" name="address" autoComplete="street-address" placeholder="House / flat, street, area and landmark" value={customer.address} onChange={(event) => updateField("address", event.target.value)} error={errors.address} maxLength={241} />
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="City" name="city" autoComplete="address-level2" placeholder="City" value={customer.city} onChange={(event) => updateField("city", event.target.value)} error={errors.city} maxLength={60} />
                <FormField label="State" name="state" autoComplete="address-level1" placeholder="State" value={customer.state} onChange={(event) => updateField("state", event.target.value)} error={errors.state} maxLength={60} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="PIN code" name="pinCode" inputMode="numeric" autoComplete="postal-code" placeholder="6-digit PIN code" value={customer.pinCode} onChange={(event) => updateField("pinCode", event.target.value.replace(/[^\d]/g, "").slice(0, 6))} error={errors.pinCode} />
              </div>
              <div>
                <FormField textarea optional label="Delivery instructions" name="instructions" placeholder="Anything the team should know?" value={customer.instructions} onChange={(event) => updateField("instructions", event.target.value)} error={errors.instructions} />
                <p className="mt-2 text-right text-[9px] tabular-nums text-muted">{customer.instructions.length}/300</p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="handoff-heading">
            <div className="mb-7 flex items-baseline gap-4">
              <span className="eyebrow text-muted">03</span>
              <h2 id="handoff-heading" className="text-xl font-semibold uppercase tracking-[-0.03em]">WhatsApp handoff</h2>
            </div>
            <div className="border border-ink/20 bg-chalk p-5 sm:p-6">
              <MessageCircle size={23} strokeWidth={1.3} aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold uppercase">You stay in control.</h3>
              <p className="mt-3 text-xs leading-6 text-muted">You’ll be redirected to WhatsApp to send your order request. Review the prepared message and manually press <strong className="font-semibold text-ink">SEND</strong>. Your order will be confirmed by our team—not by this website.</p>
              <ul className="mt-4 space-y-2 text-[10px] leading-relaxed text-muted">
                <li>— No card, UPI or payment details are requested.</li>
                <li>— Opening WhatsApp does not place or confirm an order.</li>
                <li>— Availability, delivery and any shipping charge are confirmed separately.</li>
              </ul>
            </div>
          </section>

          {!hasConfiguredWhatsApp() && (
            <div className="mt-6 border border-[#9d291f]/40 bg-[#9d291f]/5 p-4 text-xs leading-6 text-[#79221b]" role="note">
              <strong className="font-semibold">Owner setup required.</strong> Add the real WhatsApp Business number in <code className="font-mono text-[11px]">src/config/store.ts</code>. Until then, no order message can be opened or sent.
            </div>
          )}

          {submitError && <div className="mt-6 border border-[#9d291f]/40 p-4 text-xs leading-6 text-[#79221b]" role="alert">{submitError}</div>}

          <button type="submit" className="button-dark mt-7 w-full sm:min-h-14">
            Place order on WhatsApp <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <p className="mt-4 flex items-start justify-center gap-2 text-center text-[9px] uppercase leading-relaxed tracking-[0.1em] text-muted"><LockKeyhole size={12} className="shrink-0" /> Details stay in your browser and in the message you choose to send.</p>
        </form>

        <aside className="order-1 h-fit bg-chalk p-6 sm:p-8 lg:sticky lg:top-36 lg:order-2 lg:col-span-5" aria-labelledby="checkout-summary">
          <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-5">
            <h2 id="checkout-summary" className="text-xl font-semibold uppercase tracking-[-0.035em]">Your request</h2>
            <span className="eyebrow text-muted">{checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
          </div>
          <ul className="divide-y divide-ink/10">
            {checkoutItems.map((item) => (
              <li key={item.key} className="grid grid-cols-[64px_1fr_auto] gap-4 py-5">
                <div className="relative aspect-[4/5] bg-stone"><Image src={item.image} alt="" fill sizes="64px" className="object-cover" /></div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold uppercase">{item.name}</h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted">{item.size} / {item.color.name}<br />Qty {item.quantity} × {formatINR(item.price)}</p>
                </div>
                <p className="text-xs font-medium tabular-nums">{formatINR(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-4 border-t border-ink/15 pt-5 text-xs">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Shipping</dt><dd className="text-right">Confirmed on WhatsApp</dd></div>
          </dl>
          <div className="mt-5 flex items-end justify-between border-t border-ink/20 pt-5">
            <div><p className="text-sm font-semibold uppercase">Product total</p><p className="mt-1 text-[9px] text-muted">Delivery not included unless confirmed</p></div>
            <p className="text-xl font-semibold tabular-nums">{formatINR(subtotal)}</p>
          </div>
          {!isBuyNow && <Link href="/cart" className="mt-5 inline-block text-[10px] uppercase tracking-[0.1em] text-muted underline underline-offset-4">Edit bag</Link>}
        </aside>
      </div>
    </div>
  );
}
