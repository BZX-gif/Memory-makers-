import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Shipping & Orders",
  description: "How MEMORY MAKERS order requests, availability, delivery and WhatsApp confirmation work.",
};

export default function ShippingPage() {
  return (
    <div className="frame py-14 sm:py-20">
      <header className="max-w-4xl border-b border-ink/20 pb-10">
        <p className="eyebrow text-muted">Good to know / Before you order</p>
        <h1 className="section-title mt-6">Shipping<br /><span className="font-serif font-normal normal-case italic tracking-normal">& order requests.</span></h1>
      </header>
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          {[
            ["01", "Send a request, not a payment", "Checkout prepares a WhatsApp message containing your selected pieces and delivery information. You must review it and press Send inside WhatsApp yourself. No online payment is collected."],
            ["02", "Wait for personal confirmation", "Opening WhatsApp—or even sending the message—does not mean your order is accepted. The store team must confirm availability, delivery details and the final amount directly with you."],
            ["03", "Confirm delivery before payment", storeConfig.shipping.information + " No delivery timeline is promised by this website. Ask the team for verified costs and timing before agreeing to pay."],
          ].map(([number, title, copy]) => (
            <section key={number} className="grid gap-3 border-b border-ink/15 pb-8 sm:grid-cols-[50px_1fr]">
              <span className="eyebrow text-muted">{number}</span>
              <div><h2 className="text-xl font-semibold uppercase tracking-[-0.03em]">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{copy}</p></div>
            </section>
          ))}
        </div>
        <aside className="h-fit bg-ink p-7 text-chalk lg:col-span-4 lg:col-start-9">
          <MessageCircle size={25} strokeWidth={1.3} aria-hidden="true" />
          <h2 className="mt-6 text-2xl font-semibold uppercase tracking-[-0.04em]">One honest step at a time.</h2>
          <p className="mt-4 text-sm leading-7 text-chalk/65">Your WhatsApp order is only a request until the business confirms it. Never treat a redirect as proof of purchase.</p>
        </aside>
      </div>
    </div>
  );
}
