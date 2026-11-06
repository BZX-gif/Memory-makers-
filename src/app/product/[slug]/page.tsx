import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetails } from "@/components/product/ProductDetails";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCollectionByCategory } from "@/data/collections";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { breadcrumbSchema, pageMetadata, priceLine, productDisplayTitle, productSchema } from "@/lib/seo";
import { UNIT_PRICE } from "@/lib/pricing";
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

  const title = productDisplayTitle(product);
  return pageMetadata({
    path: `/product/${product.slug}`,
    title: `${title} — ${product.category}`,
    description: `${product.description} ${formatINR(UNIT_PRICE)} with free shipping. Choose a pictured colour and your requested size, then send the order request on WhatsApp for personal confirmation.`,
    image: product.images[0],
    imageAlt: `${title} — supplied front-view photograph`,
    imageWidth: 960,
    imageHeight: 1280,
    keywords: [title, product.category, "anime graphic tee India", "graphic tee ₹600"],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product);
  const collection = getCollectionByCategory(product.category);
  const title = productDisplayTitle(product);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    ...(collection ? [{ name: collection.category, path: `/collections/${collection.slug}` }] : []),
    { name: title, path: `/product/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), productSchema(product)]} />
      <div className="frame py-5">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-muted">
          <Link href="/shop" className="transition-colors hover:text-ink">Shop</Link><span>/</span>
          {collection && (
            <>
              <Link href={`/collections/${collection.slug}`} className="transition-colors hover:text-ink">{product.category}</Link><span>/</span>
            </>
          )}
          <span className="text-ink">{title}</span>
        </nav>
      </div>
      <ProductDetails key={product.id} product={product} />

      <section className="border-t border-ink/15 bg-chalk py-16 sm:py-24" aria-labelledby="related-heading">
        <div className="frame">
          <div className="mb-9 flex items-end justify-between border-b border-ink/20 pb-6">
            <div>
              <p className="eyebrow mb-3 text-muted">Keep looking</p>
              <h2 id="related-heading" className="text-3xl font-semibold uppercase tracking-[-0.05em] sm:text-5xl">You might also like</h2>
            </div>
            <Link href="/shop" className="text-link hidden sm:inline-flex">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
          {collection && (
            <Link href={`/collections/${collection.slug}`} className="text-link mt-10">
              More {collection.category.toLowerCase()} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
          <p className="mt-8 text-[10px] uppercase leading-relaxed tracking-[0.13em] text-muted">{priceLine()}</p>
        </div>
      </section>
    </>
  );
}
