import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { OrderSteps } from "@/components/ui/OrderSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { collections, getCollectionBySlug } from "@/data/collections";
import { products } from "@/data/products";
import { breadcrumbSchema, itemListSchema, pageMetadata, productDisplayTitle } from "@/lib/seo";

interface CollectionPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ category: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { category } = await params;
  const collection = getCollectionBySlug(category);
  if (!collection) return { title: "Collection not found" };

  return pageMetadata({
    path: `/collections/${collection.slug}`,
    title: `${collection.category} — Photographed Collection`,
    description: collection.metaDescription,
    image: `/og/collection-${collection.slug}.png`,
    imageAlt: `${collection.category} collection — MEMORY MAKERS`,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { category } = await params;
  const collection = getCollectionBySlug(category);
  if (!collection) notFound();

  const items = products.filter((product) => product.category === collection.category);
  const others = collections.filter((item) => item.slug !== collection.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: collection.category, path: `/collections/${collection.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            "@type": "CollectionPage",
            "@id": `/collections/${collection.slug}/#collection`,
            name: `${collection.category} — MEMORY MAKERS`,
            description: collection.metaDescription,
            mainEntity: itemListSchema(items, collection.category, `/collections/${collection.slug}`),
            breadcrumb: { "@id": `/collections/${collection.slug}/#breadcrumb` },
          },
        ]}
      />

      <header className="frame pb-10 pt-10 sm:pb-14 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-muted">
          <Link href="/" className="transition-colors hover:text-ink">Home</Link><span>/</span>
          <Link href="/collections" className="transition-colors hover:text-ink">Collections</Link><span>/</span>
          <span className="text-ink">{collection.category}</span>
        </nav>

        <div className="mt-8 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-muted">{items.length} photographed {items.length === 1 ? "piece" : "pieces"}</p>
            <h1 className="mt-5 text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-tightest">
              {collection.category.split(" ")[0]}{" "}
              <span className="font-serif font-normal normal-case italic tracking-normal">
                {collection.category.split(" ").slice(1).join(" ").toLowerCase()}.
              </span>
            </h1>
          </div>
          <div className="max-w-md space-y-5">
            {collection.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[13px] leading-relaxed text-muted sm:text-sm sm:leading-7">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <dl className="mt-12 grid gap-8 border-t border-ink/20 pt-8 sm:grid-cols-3">
          {collection.highlights.map((highlight) => (
            <div key={highlight.title}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em]">{highlight.title}</dt>
              <dd className="mt-2 text-[11px] leading-relaxed text-muted">{highlight.copy}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="frame pb-16 sm:pb-24" aria-label={`${collection.category} pieces`}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-ink/15 pt-8">
          <span className="eyebrow text-muted">Other silhouettes</span>
          {others.map((other) => (
            <Link key={other.slug} href={`/collections/${other.slug}`} className="button-light min-h-10 px-4 py-2 text-[10px]">
              {other.category}
            </Link>
          ))}
          <Link href="/shop" className="text-link ml-auto">
            Browse everything <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <OrderSteps />

      <section className="frame py-14 sm:py-16">
        <h2 className="eyebrow text-muted">In this collection</h2>
        <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <li key={product.id}>
              <Link href={`/product/${product.slug}`} className="text-[12px] leading-relaxed text-muted transition-colors hover:text-ink">
                {productDisplayTitle(product)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
