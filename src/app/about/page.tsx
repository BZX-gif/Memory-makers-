import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { OrderSteps } from "@/components/ui/OrderSteps";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { siteUrl, storeConfig } from "@/config/store";
import { breadcrumbSchema, organizationSchema, pageMetadata, priceLine } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About MEMORY MAKERS — The Studio Behind MM Wearable",
  description:
    "A small Indian streetwear label printing character graphics on tees, polos and stand-collar styles. What we make, how we price it, and exactly what we will never promise.",
});

const photographCount = products.reduce((count, product) => count + product.images.length, 0);

const promises = [
  "Real photographs of the actual garments, shown unchanged.",
  "One fixed price for every piece, with the MRP visible beside it.",
  "Free shipping on every order, with no minimum spend.",
  "A human confirming availability and delivery on WhatsApp before any order is accepted.",
  "Manual stock counts we cap your order to — never an invented warehouse feed.",
];

const refusals = [
  "No online payment, so no card details ever pass through this site.",
  "No fake reviews, ratings or 'verified buyer' badges.",
  "No countdown timers or invented deadlines.",
  "No delivery windows we cannot guarantee.",
  "No material, fit or measurement claims until the owner verifies them.",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          organizationSchema(),
          {
            "@type": "AboutPage",
            "@id": "/about/#about",
            name: `About ${storeConfig.brandName}`,
            description: metadata.description as string,
            mainEntity: { "@id": `${siteUrl}/#organization` },
          },
        ]}
      />

      <header className="frame pb-12 pt-12 sm:pb-16 sm:pt-20">
        <p className="eyebrow text-muted">The studio / MM Wearable</p>
        <h1 className="mt-6 max-w-[14ch] text-[clamp(3.2rem,8.5vw,9rem)] font-black uppercase leading-[0.82] tracking-tightest">
          Art, words, ideas —<br />
          <span className="font-serif font-normal normal-case italic tracking-normal">made wearable.</span>
        </h1>
        <div className="mt-10 grid gap-8 border-t border-ink/20 pt-9 lg:grid-cols-12">
          <p className="text-lg leading-relaxed text-ink sm:text-xl lg:col-span-5">
            MEMORY MAKERS is a small Indian label that prints the characters, lettering and artwork people
            already carry in their heads — and puts them on garments worth keeping.
          </p>
          <div className="space-y-5 text-sm leading-7 text-muted lg:col-span-5 lg:col-start-8">
            <p>
              The collection began with photographs, not mockups: every design on this site is a studio
              photograph of a real garment. {products.length} designs, {photographCount} photographs, three
              collar silhouettes — crew necks, fold-down polos and upright stand collars.
            </p>
            <p>
              We sell the way we would want to be sold to: one honest price, {priceLine()} Ordering happens in
              a WhatsApp conversation with a person, not a checkout funnel — because a small label should be
              able to say &ldquo;yes, that piece is available&rdquo; before anyone pays for it.
            </p>
          </div>
        </div>
      </header>

      <section className="border-y border-ink/15 bg-chalk">
        <dl className="frame grid grid-cols-2 gap-8 py-12 sm:py-14 lg:grid-cols-4">
          {[
            [String(products.length), "designs in the catalogue"],
            [String(photographCount), "supplied photographs, unchanged"],
            [String(collections.length), "collar silhouettes"],
            ["₹600", "one price, every piece"],
          ].map(([value, label]) => (
            <div key={label} className="border-l border-ink/20 pl-5">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="block text-[clamp(2.4rem,5vw,4.4rem)] font-black leading-none tracking-tightest tabular-nums">{value}</span>
                <span className="mt-3 block text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="frame grid gap-12 py-16 sm:py-24 lg:grid-cols-12" aria-labelledby="about-story-heading">
        <div className="relative aspect-square overflow-hidden bg-white lg:col-span-5">
          <Image
            src={storeConfig.brandImage}
            alt="Supplied MM Wearable logo: a black MM monogram above the word Wearable"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-contain"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-muted">What we stand behind</p>
          <h2 id="about-story-heading" className="mt-6 text-[clamp(2.2rem,4.4vw,4.4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Small label.<br /><span className="font-serif font-normal normal-case italic tracking-normal">Serious rules.</span>
          </h2>
          <div className="mt-9 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow mb-4 text-ink">What we promise</h3>
              <ul className="space-y-3">
                {promises.map((item) => (
                  <li key={item} className="flex gap-3 text-[12px] leading-relaxed text-muted">
                    <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-4 text-ink">What we won&rsquo;t do</h3>
              <ul className="space-y-3">
                {refusals.map((item) => (
                  <li key={item} className="flex gap-3 text-[12px] leading-relaxed text-muted">
                    <X size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="button-dark">See the collection <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/contact" className="button-light">Talk to us</Link>
          </div>
        </div>
      </section>

      <OrderSteps tone="dark" />
    </>
  );
}
