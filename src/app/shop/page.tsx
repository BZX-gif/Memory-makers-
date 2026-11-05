import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description: "Explore the MEMORY MAKERS demonstration collection of graphic, typography, art and minimal T-shirts. Filter, search and request your piece on WhatsApp.",
  openGraph: {
    title: "Shop the Collection — MEMORY MAKERS",
    description: "Find the piece that feels like you.",
    images: ["/images/products/after-hours.jpg"],
  },
};

function ShopFallback() {
  return (
    <div className="frame py-16" role="status" aria-label="Loading collection">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[4/5] animate-pulse bg-stone/60" />)}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <header className="frame pb-10 pt-12 sm:pb-14 sm:pt-16">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-muted">The catalogue / 001—008</p>
            <h1 className="mt-5 text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.82] tracking-tightest">All <span className="font-serif font-normal normal-case italic tracking-normal">pieces.</span></h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted">A demonstration wardrobe of graphics, words and original ideas. Find your expression, then send an order request on WhatsApp.</p>
        </div>
      </header>
      <Suspense fallback={<ShopFallback />}>
        <ShopExperience />
      </Suspense>
    </>
  );
}
