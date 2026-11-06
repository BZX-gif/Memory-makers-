import { ArrowRight, MessageCircle, PackageCheck, Send } from "lucide-react";
import Link from "next/link";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

const steps = [
  {
    icon: PackageCheck,
    title: "Pick your piece",
    copy: "Browse the photographed collection, choose a pictured colour and send your requested size. Stock limits shown on each piece are the real catalogue counts.",
  },
  {
    icon: Send,
    title: "Send the request",
    copy: `Checkout builds a WhatsApp message with your pieces and the exact total — ${formatINR(UNIT_PRICE)} a tee, free shipping, ${formatINR(BUNDLE_DISCOUNT)} off once at ${BUNDLE_QUANTITY}+ tees. You review it and press Send yourself.`,
  },
  {
    icon: MessageCircle,
    title: "Get personal confirmation",
    copy: "The store team replies on WhatsApp to confirm availability, size and delivery. No payment is taken on this website and nothing is reserved until they confirm.",
  },
];

/** The honest ordering model, told in three steps. */
export function OrderSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section
      className={dark ? "bg-ink text-chalk" : "border-y border-ink/15 bg-chalk"}
      aria-labelledby="order-steps-heading"
    >
      <div className="frame py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className={`eyebrow mb-4 ${dark ? "text-chalk/50" : "text-muted"}`}>How ordering works</p>
            <h2 id="order-steps-heading" className="section-title text-balance">
              Three honest steps.<br />
              <span className="font-serif font-normal normal-case italic tracking-normal">No surprises.</span>
            </h2>
          </div>
          <Link
            href="/shipping"
            className={`text-link self-start sm:self-auto ${dark ? "text-chalk" : ""}`}
          >
            Read the full order guide <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className={`relative border-t pt-7 ${dark ? "border-chalk/20" : "border-ink/20"}`}>
              <div className="flex items-center justify-between">
                <step.icon size={22} strokeWidth={1.3} aria-hidden="true" />
                <span className={`text-[10px] tabular-nums ${dark ? "text-chalk/45" : "text-muted"}`}>0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold uppercase tracking-[-0.03em]">{step.title}</h3>
              <p className={`mt-3 text-[13px] leading-relaxed ${dark ? "text-chalk/65" : "text-muted"}`}>{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
