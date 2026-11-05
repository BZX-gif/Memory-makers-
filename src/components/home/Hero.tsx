"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { heroProduct } from "@/data/products";
import { getProductImageAlt } from "@/lib/products";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 35 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="overflow-hidden border-b border-ink/15" aria-labelledby="hero-heading">
      <div className="grid lg:min-h-[calc(100svh-113px)] lg:grid-cols-12">
        <div className="relative flex flex-col justify-between px-5 py-8 sm:px-8 sm:py-10 lg:col-span-7 lg:px-12 lg:py-12">
          <motion.div {...enter(0)} className="flex items-center justify-between border-b border-ink/20 pb-4">
            <p className="eyebrow">MM / The photographed collection</p>
            <p className="hidden text-[10px] uppercase tracking-[0.15em] text-muted sm:block">Wear your fandom</p>
          </motion.div>

          <div className="py-10 sm:py-12 lg:py-8">
            <motion.h1 id="hero-heading" {...enter(0.08)} className="display-title max-w-[1000px]">
              Wear your<br />
              <span className="font-serif font-normal italic tracking-[-0.045em]">Memories.</span>
            </motion.h1>
            <motion.p {...enter(0.16)} className="mt-7 max-w-md text-[15px] leading-relaxed text-muted sm:mt-9 sm:text-base">
              Character graphics. Familiar stories. Find your expression in the photographed collection.
            </motion.p>
          </div>

          <motion.div {...enter(0.24)} className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Link href="/shop" className="button-dark group sm:min-w-56">
              Explore collection <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#story" className="text-link self-start sm:self-auto">
              Our story <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>

          <motion.div {...enter(0.32)} className="mt-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-muted lg:flex">
            <ArrowDown size={14} strokeWidth={1.3} aria-hidden="true" /> Scroll to discover
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="overflow-hidden bg-ink text-chalk lg:col-span-5"
        >
          <Link href={`/product/${heroProduct.slug}`} className="group block" aria-label={`View ${heroProduct.name}`}>
            <div className="relative aspect-[3/4]">
              <Image
                src={heroProduct.images[0]}
                alt={getProductImageAlt(heroProduct, heroProduct.images[0])}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-chalk/20 p-5 sm:p-7">
              <p className="eyebrow">From the collection<br /><span className="font-normal normal-case tracking-normal text-chalk/70">{heroProduct.name}</span></p>
              <ArrowUpRight size={24} strokeWidth={1.3} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
