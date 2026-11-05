import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Collections } from "@/components/home/Collections";
import { BrandStatement, BrandStory } from "@/components/home/BrandStory";
import { SocialSection } from "@/components/home/SocialSection";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { featuredProducts } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />

      <section className="frame py-20 sm:py-28" aria-labelledby="featured-heading">
        <Reveal className="mb-10 flex items-end justify-between gap-6 border-b border-ink/20 pb-7">
          <div>
            <p className="eyebrow mb-4 text-muted">01 / Selected works</p>
            <h2 id="featured-heading" className="section-title">The current edit</h2>
          </div>
          <Link href="/shop" className="text-link hidden shrink-0 sm:inline-flex">View all <ArrowRight size={14} /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.055}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <Link href="/shop" className="button-light mt-10 w-full sm:hidden">Explore all pieces <ArrowRight size={15} /></Link>
        <p className="mt-10 text-[9px] uppercase leading-relaxed tracking-[0.13em] text-muted">₹600 per tee · MRP ₹1,200 · Free shipping · 4 tees unlock ₹600 off</p>
      </section>

      <BrandStatement />
      <Collections />
      <BrandStory />
      <SocialSection />
    </>
  );
}
