import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { CatalogueNotice } from "@/components/ui/CatalogueNotice";
import { heroProduct, products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Filtered views (?category=, ?q=) are personal, transient states of one page:
 * they must not compete with the canonical /shop/ URL or the collection pages.
 */
export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Object.values(params).some((value) => value !== undefined && value !== "");
  return pageMetadata({
    path: "/shop",
    title: "Shop the Collection",
    description: "Explore the MEMORY MAKERS collection: graphic T-shirts, polos and stand-collar styles. Every tee is ₹600 (MRP ₹1,200) with free shipping and ₹600 off at four tees.",
    image: heroProduct.images[0],
    imageAlt: "Graphic T-shirt from the photographed MEMORY MAKERS collection",
    imageWidth: 960,
    imageHeight: 1280,
    noindex: filtered,
  });
}

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
