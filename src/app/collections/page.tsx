import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/collections",
  title: "Collections",
  description:
    "Three photographed silhouettes: crew-neck graphic tees, graphic polos with fold-down collars, and stand-collar tees. Every piece ₹600 with free shipping across India.",
});

export default function CollectionsIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
          ]),
          itemListSchema(
            collections.map((collection) => products.find((product) => product.category === collection.category)!),
            "MEMORY MAKERS collections",
            "/collections",
          ),
        ]}
      />
      <header className="frame pb-12 pt-12 sm:pb-16 sm:pt-16">
        <p className="eyebrow text-muted">The catalogue / {collections.length} silhouettes</p>
        <h1 className="mt-5 text-[clamp(3.6rem,9vw,9rem)] font-black uppercase leading-[0.82] tracking-tightest">
          Collec<span className="font-serif font-normal normal-case italic tracking-normal">tions.</span>
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
          Crew necks, fold-down polo collars and upright stand collars — the three silhouettes visible in the
          supplied photographs, each photographed on the real garments.
        </p>
      </header>

      <div className="frame pb-20 sm:pb-28">
        <div className="grid gap-x-4 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => {
            const hero = products.find((product) => product.category === collection.category);
            const count = products.filter((product) => product.category === collection.category).length;
            if (!hero) return null;
            return (
              <Reveal key={collection.slug} delay={index * 0.07}>
                <Link href={`/collections/${collection.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                    <Image
                      src={hero.images[0]}
                      alt={`${collection.category} from the photographed MEMORY MAKERS collection`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                    />
                    <span className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-paper transition-colors group-hover:bg-ink group-hover:text-chalk">
                      <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                    <span className="absolute bottom-4 left-4 bg-paper px-2 py-1 text-[9px] font-medium tracking-[0.15em]">
                      0{index + 1} / {count} pieces
                    </span>
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold uppercase tracking-[-0.04em]">{collection.category}</h2>
                  <p className="mt-2 max-w-[34ch] text-xs leading-relaxed text-muted">{collection.metaDescription}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </>
  );
}
