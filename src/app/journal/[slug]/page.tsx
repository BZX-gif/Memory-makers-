import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCollectionBySlug } from "@/data/collections";
import { getJournalPost, journalPosts, postWordCount } from "@/data/journal";
import { products } from "@/data/products";
import { articleSchema, breadcrumbSchema, pageMetadata, priceLine } from "@/lib/seo";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return { title: "Article not found" };

  return pageMetadata({
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.deck,
    openGraphType: "article",
  });
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const collection = getCollectionBySlug(post.relatedSlug);
  const related = collection
    ? products.filter((product) => product.category === collection.category).slice(0, 4)
    : products.slice(0, 4);
  const index = journalPosts.findIndex((item) => item.slug === post.slug);
  const next = journalPosts[(index + 1) % journalPosts.length];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
            { name: post.title, path: `/journal/${post.slug}` },
          ]),
          articleSchema({
            slug: post.slug,
            headline: post.title,
            description: post.deck,
            published: post.published,
            modified: post.modified,
            words: postWordCount(post),
            section: post.section,
          }),
        ]}
      />

      <article>
        <header className="frame pb-10 pt-10 sm:pb-14 sm:pt-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-muted">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link><span>/</span>
            <Link href="/journal" className="transition-colors hover:text-ink">Journal</Link><span>/</span>
            <span className="text-ink">{post.section}</span>
          </nav>
          <h1 className="mt-7 max-w-[22ch] text-[clamp(2.6rem,6vw,6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-ink sm:text-2xl">{post.deck}</p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.15em] text-muted">
            {post.section} · {post.readMinutes} min read · Updated{" "}
            {new Date(post.modified).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>

        <div className="frame grid gap-12 pb-16 sm:pb-24 lg:grid-cols-12">
          <div className="prose-editorial lg:col-span-7 lg:col-start-3">
            {post.blocks.map((block) => {
              if (block.type === "h2") return <h2 key={block.text}>{block.text}</h2>;
              if (block.type === "h3") return <h3 key={block.text}>{block.text}</h3>;
              if (block.type === "ul") {
                return (
                  <ul key={block.items[0]}>
                    {block.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                );
              }
              return <p key={block.text.slice(0, 32)}>{block.text}</p>;
            })}
            <p className="border-t border-ink/15 pt-6 text-[13px]">
              Ready to look? {priceLine()}{" "}
              <Link href="/shop">Browse the photographed collection</Link>.
            </p>
          </div>

          <aside className="lg:col-span-3 lg:col-start-9">
            <div className="sticky top-36 space-y-8">
              <div>
                <p className="eyebrow mb-4 text-muted">Keep reading</p>
                <Link href={`/journal/${next.slug}`} className="group block border-t border-ink/20 pt-4">
                  <p className="text-[13px] font-semibold leading-snug transition-opacity group-hover:opacity-60">{next.title}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                    Next <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </Link>
              </div>
              {collection && related[0] && (
                <div>
                  <p className="eyebrow mb-4 text-muted">From the collection</p>
                  <Link href={`/collections/${collection.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-stone">
                    <Image
                      src={related[0].images[0]}
                      alt={`${collection.category} from the photographed collection`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 24vw"
                      className="object-contain transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                    />
                  </Link>
                  <Link href={`/collections/${collection.slug}`} className="text-link mt-4">
                    {collection.category} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="border-t border-ink/15 bg-chalk py-14 sm:py-20" aria-labelledby="journal-related-heading">
          <div className="frame">
            <div className="mb-8 flex items-end justify-between border-b border-ink/20 pb-6">
              <h2 id="journal-related-heading" className="text-2xl font-semibold uppercase tracking-[-0.045em] sm:text-4xl">
                Pieces this guide mentions
              </h2>
              <Link href="/shop" className="text-link hidden sm:inline-flex">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {related.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <Link href="/journal" className="button-light mt-10 w-full sm:w-auto">
              <ArrowLeft size={14} aria-hidden="true" /> All journal entries
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
