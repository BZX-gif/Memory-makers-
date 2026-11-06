import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Collections } from "@/components/home/Collections";
import { BrandStatement, BrandStory } from "@/components/home/BrandStory";
import { SocialSection } from "@/components/home/SocialSection";
import { ProductCard } from "@/components/product/ProductCard";
import { EditorialBand } from "@/components/home/EditorialBand";
import { OrderSteps } from "@/components/ui/OrderSteps";
import { TrustStrip } from "@/components/ui/TrustStrip";
import { Reveal } from "@/components/ui/Reveal";
import { featuredProducts } from "@/data/products";
import { journalPosts } from "@/data/journal";

export default function HomePage() {
  const latestPost = journalPosts[0];

  return (
    <>
      <Hero />
      <Marquee />
      <TrustStrip />

      <section className="frame py-20 sm:py-28" aria-labelledby="featured-heading">
        <Reveal className="mb-10 flex items-end justify-between gap-6 border-b border-ink/20 pb-7">
          <div>
            <p className="eyebrow mb-4 text-muted">01 / Selected works</p>
            <h2 id="featured-heading" className="section-title">The current edit</h2>
          </div>
          <Link href="/shop" className="text-link hidden shrink-0 sm:inline-flex">View all <ArrowRight size={14} aria-hidden="true" /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.055}>
              <ProductCard product={product} priority={index < 2} />
            </Reveal>
          ))}
        </div>
        <Link href="/shop" className="button-light mt-10 w-full sm:hidden">Explore all pieces <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>

      <BrandStatement />
      <Collections />

      <section className="border-y border-ink/15 bg-chalk" aria-labelledby="journal-heading">
        <div className="frame grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow mb-4 text-muted">04 / The journal</p>
            <h2 id="journal-heading" className="section-title">
              Wear it well,<br /><span className="font-serif font-normal normal-case italic tracking-normal">keep it longer.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted">
              Field notes on styling, washing and choosing silhouettes — written to make printed streetwear
              last, not to sell you a trend.
            </p>
            <Link href="/journal" className="text-link mt-7">Read the journal <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <Link href={`/journal/${latestPost.slug}`} className="group block border-t border-ink/20 pt-6">
              <p className="eyebrow text-muted">{latestPost.section} · {latestPost.readMinutes} min read</p>
              <h3 className="mt-4 max-w-[26ch] text-2xl font-semibold uppercase leading-[1.02] tracking-[-0.04em] transition-opacity group-hover:opacity-60 sm:text-3xl">
                {latestPost.title}
              </h3>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">{latestPost.deck}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                Start reading <ArrowRight size={13} aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <BrandStory />
      <EditorialBand />
      <OrderSteps />
      <SocialSection />

    </>
  );
}
