import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { CatalogueNotice } from "@/components/ui/CatalogueNotice";
import { heroProduct, products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description: "Explore the supplied MEMORY MAKERS product photographs: graphic T-shirts, polos and stand-collar styles. Prices, sizes and availability are confirmed before an order is accepted.",
  openGraph: {
    title: "Shop the Collection — MEMORY MAKERS",
    description: "Find the piece that feels like you.",
    images: [heroProduct.images[0]],
  },
};

function ShopFallback() {
  return (
    <div className="frame py-16" role="status" aria-label="Loading collection">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[3/4] animate-pulse bg-stone/60" />)}
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
            <p className="eyebrow text-muted">The catalogue / {products.length} designs / {products.reduce((count, product) => count + product.images.length, 0)} photographs</p>
            <h1 className="mt-5 text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.82] tracking-tightest">All <span className="font-serif font-normal normal-case italic tracking-normal">pieces.</span></h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted">Character graphics on tees, polos and stand-collar styles, shown in the supplied photographs. Choose a piece and prepare an order request.</p>
        </div>
        <div className="mt-8"><CatalogueNotice /></div>
      </header>
      <Suspense fallback={<ShopFallback />}>
        <ShopExperience />
      </Suspense>
    </>
  );
}
