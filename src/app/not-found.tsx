import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { collections } from "@/data/collections";
import { featuredProducts } from "@/data/products";
import { productDisplayTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page or product may have moved. The photographed collection is a good place to start again.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="frame flex min-h-[72vh] flex-col justify-center py-20">
      <p className="eyebrow text-muted">404 / Missing memory</p>
      <h1 className="mt-6 max-w-5xl text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.8] tracking-tightest">
        Not here.<br /><span className="font-serif font-normal normal-case italic tracking-normal">Still somewhere.</span>
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
        This page or product may have moved. The collection is a good place to start again.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="button-dark"><ArrowLeft size={15} aria-hidden="true" /> Back to the collection</Link>
        {collections.map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`} className="button-light">
            {collection.category}
          </Link>
        ))}
        <Link href="/faq" className="button-light">Questions</Link>
      </div>
      <p className="mt-10 text-[10px] uppercase tracking-[0.14em] text-muted">Popular right now</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {featuredProducts.slice(0, 4).map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.slug}`} className="text-[12px] text-muted transition-colors hover:text-ink">
              {productDisplayTitle(product)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
