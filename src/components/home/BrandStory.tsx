import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { storeConfig } from "@/config/store";

export function BrandStatement() {
  return (
    <section className="bg-ink py-20 text-chalk sm:py-28" aria-labelledby="statement-heading">
      <div className="frame">
        <Reveal>
          <p className="eyebrow text-chalk/50">Our point of view</p>
          <h2 id="statement-heading" className="mt-8 max-w-[1300px] text-[clamp(3.4rem,8.3vw,9rem)] font-semibold uppercase leading-[0.84] tracking-tightest">
            More than<br />what you <span className="font-serif font-normal normal-case italic tracking-normal">wear.</span>
          </h2>
        </Reveal>
        <Reveal className="mt-12 grid gap-8 border-t border-chalk/20 pt-8 md:grid-cols-2 lg:ml-[35%]" delay={0.1}>
          <p className="text-lg leading-relaxed sm:text-xl">A character you recognise. A story that stays with you. An expression of your own.</p>
          <p className="max-w-md text-sm leading-7 text-chalk/60">Explore character graphics across crew-neck tees, polos and stand-collar styles. Start with the artwork that feels like you.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section id="story" className="frame grid py-20 sm:py-28 lg:grid-cols-12 lg:gap-12" aria-labelledby="story-heading">
      <Reveal className="relative aspect-square overflow-hidden bg-white lg:col-span-7">
        <Image
          src={storeConfig.brandImage}
          alt="Supplied MM Wearable logo: black MM monogram above the word Wearable"
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
        />
      </Reveal>
      <Reveal className="flex flex-col justify-center pt-10 lg:col-span-5 lg:pt-0" delay={0.12}>
        <p className="eyebrow text-muted">03 / The stories you wear</p>
        <h2 id="story-heading" className="mt-6 text-[clamp(2.8rem,5vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
          Find your<br /><span className="font-serif font-normal normal-case italic tracking-normal">connection.</span>
        </h2>
        <p className="mt-7 text-sm leading-7 text-muted">Browse the supplied product photographs, choose a pictured colour and request your preferred size. The team confirms the details with you before accepting an order.</p>
        <div className="mt-8 space-y-5 border-t border-ink/15 pt-7">
          {[
            ["01", "See the actual collection", "The catalogue uses the supplied photographs, not demonstration designs."],
            ["02", "Choose your expression", "Character graphics, distinct colours and three pictured collar styles."],
            ["03", "Confirm before you commit", "Ask about price, fabric, fit and availability. No payment is taken here."],
          ].map(([number, title, copy]) => (
            <div key={number} className="grid grid-cols-[28px_1fr] gap-3">
              <span className="pt-0.5 text-[9px] text-muted">{number}</span>
              <div><h3 className="text-xs font-semibold uppercase tracking-[0.04em]">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p></div>
            </div>
          ))}
        </div>
        <Link href="/shop" className="text-link mt-9 self-start">Find your piece <ArrowUpRight size={14} /></Link>
      </Reveal>
    </section>
  );
}
