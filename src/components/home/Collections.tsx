import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categoryDescriptions, products } from "@/data/products";
import { PRODUCT_CATEGORIES } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

export function Collections() {
  return (
    <section id="collections" className="frame py-20 sm:py-28" aria-labelledby="collections-heading">
      <Reveal className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-4 text-muted">02 / Find your language</p>
          <h2 id="collections-heading" className="section-title">Find a style<br /><span className="font-serif font-normal normal-case italic tracking-normal">that speaks to you.</span></h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted">Crew necks, polo collars and upright collars. Explore the styles visible in the supplied collection.</p>
      </Reveal>

      <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_CATEGORIES.map((category, index) => {
          const product = products.find((item) => item.category === category);
          if (!product) return null;
          return (
            <Reveal key={category} delay={index * 0.06}>
              <Link href={`/shop?category=${encodeURIComponent(category)}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                  <Image
                    src={product.images[0]}
                    alt={`${category} featuring ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                  />
                  <span className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-paper transition-colors group-hover:bg-ink group-hover:text-chalk">
                    <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-4 left-4 bg-paper px-2 py-1 text-[9px] font-medium tracking-[0.15em]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold uppercase tracking-[-0.04em]">{category}</h3>
                <p className="mt-2 max-w-[28ch] text-xs leading-relaxed text-muted">{categoryDescriptions[category]}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
