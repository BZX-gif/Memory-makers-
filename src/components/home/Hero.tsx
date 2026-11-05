"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
            <p className="eyebrow">MM / Originals — 001</p>
            <p className="hidden text-[10px] uppercase tracking-[0.15em] text-muted sm:block">An expression in every edition</p>
          </motion.div>

          <div className="py-10 sm:py-12 lg:py-8">
            <motion.h1 id="hero-heading" {...enter(0.08)} className="display-title max-w-[1000px]">
              Wear your<br />
              <span className="font-serif font-normal italic tracking-[-0.045em]">Memories.</span>
            </motion.h1>
            <motion.p {...enter(0.16)} className="mt-7 max-w-md text-[15px] leading-relaxed text-muted sm:mt-9 sm:text-base">
              Not just another T-shirt. An expression of who you are.
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
          className="relative min-h-[72svh] overflow-hidden bg-[#d6d0c4] sm:min-h-[85svh] lg:col-span-5 lg:min-h-0"
        >
          <Image
            src="/images/campaign-hero.jpg"
            alt="Model wearing the black Memory Makers After Hours graphic T-shirt in a daylight studio"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/55 to-transparent p-5 pt-20 text-chalk sm:p-7">
            <p className="eyebrow">Campaign 001<br /><span className="font-normal normal-case tracking-normal text-chalk/70">After Hours / Washed Black</span></p>
            <p className="font-serif text-xl italic">Campaign · 2026</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
