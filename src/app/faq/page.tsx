import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/data/faq";
import { breadcrumbSchema, faqPageSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/faq",
  title: "FAQ — Ordering, Pricing, Sizes & Delivery Questions",
  description:
    "Straight answers: what a tee costs, how WhatsApp ordering works, whether photos are real, how sizes and stock counts behave, and what this site never promises.",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]), faqPageSchema(faqs)]} />
      <div className="frame grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow text-muted">Good to know / {faqs.length} answers</p>
            <h1 className="mt-6 text-[clamp(3rem,6.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-tightest">
              Asked<br /><span className="font-serif font-normal normal-case italic tracking-normal">often.</span>
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-muted">
              Every answer here repeats a fact the store can stand behind. Where something is not confirmed
              yet, the answer says so instead of guessing.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/shipping" className="text-link self-start">Order & shipping guide <ArrowRight size={14} aria-hidden="true" /></Link>
              <Link href="/contact" className="text-link self-start">Ask us on WhatsApp <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        </header>

        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group border-b border-ink/15 py-6 first:border-t" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h2 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] sm:text-lg">{faq.question}</h2>
                <span className="mt-0.5 shrink-0 text-lg font-light transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted sm:text-sm sm:leading-7">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
