import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetails } from "@/components/product/ProductDetails";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.description} ${formatINR(UNIT_PRICE)} (MRP ${formatINR(ORIGINAL_UNIT_PRICE)}). Free shipping on every order. Choose your size and colour, then send your order on WhatsApp.`,
    openGraph: {
      title: `${product.name} — MEMORY MAKERS`,
      description: product.description,
      images: [{ url: product.images[0], alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product);

  return (
    <>
      <div className="frame py-5">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-muted">
          <Link href="/shop" className="transition-colors hover:text-ink">Shop</Link><span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="transition-colors hover:text-ink">{product.category}</Link><span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>
      <ProductDetails key={product.id} product={product} />

      <section className="border-t border-ink/15 bg-chalk py-16 sm:py-24" aria-labelledby="related-heading">
        <div className="frame">
          <div className="mb-9 flex items-end justify-between border-b border-ink/20 pb-6">
            <div><p className="eyebrow mb-3 text-muted">Keep looking</p><h2 id="related-heading" className="text-3xl font-semibold uppercase tracking-[-0.05em] sm:text-5xl">You might also like</h2></div>
            <Link href="/shop" className="text-link hidden sm:inline-flex">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
    </>
  );
}
