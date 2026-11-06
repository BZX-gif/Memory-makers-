import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Editorial campaign band. These two photographs are styling/atmosphere
 * imagery supplied with the brand — they are NOT catalogue items, and the
 * copy says so explicitly so nobody mistakes them for purchasable pieces.
 */
export function EditorialBand() {
  return (
    <section className="border-y border-ink/15 bg-ink text-chalk" aria-labelledby="editorial-heading">
      <div className="grid lg:grid-cols-12">
        <Reveal className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[620px]">
          <Image
            src="/images/campaign-hero.jpg"
            alt="Editorial campaign photograph: a model wears a relaxed dark T-shirt with black trousers in a daylight studio — styling reference, not a catalogue item"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </Reveal>
        <div className="flex flex-col justify-between gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:col-span-7 lg:px-14 lg:py-20">
          <div>
            <p className="eyebrow text-chalk/50">Editorial / How it sits on a person</p>
            <h2 id="editorial-heading" className="mt-7 max-w-[16ch] text-[clamp(2.6rem,5.6vw,5.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
              Cut to be<br />
              <span className="font-serif font-normal normal-case italic tracking-normal">lived in.</span>
            </h2>
            <div className="mt-8 grid gap-8 border-t border-chalk/20 pt-8 md:grid-cols-2">
              <p className="text-base leading-relaxed sm:text-lg">
                Relaxed through the body, clean at the shoulder, long enough to sit right over straight
                trousers — the proportion this campaign photograph plays with, and a useful reference for
                how you might style your own piece.
              </p>
              <p className="text-[13px] leading-relaxed text-chalk/60">
                These campaign photographs show styling and proportion only. The piece you order is the piece
                in the catalogue photographs — same print, same colour, shown unchanged on every product page.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/size-guide" className="button-light border-chalk text-chalk hover:bg-chalk hover:text-ink">
              Measure for your fit
            </Link>
            <Link href="/collections" className="text-link text-chalk">
              See the three silhouettes <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-chalk/15">
        <div className="grid gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-12 lg:px-14">
          <Reveal className="relative aspect-[3/2] overflow-hidden lg:col-span-7">
            <Image
              src="/images/studio-story.jpg"
              alt="Studio table with hand-pulled prints, ink jars and brushes laid over black T-shirts — the artwork stage behind the collection"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal className="flex flex-col justify-center lg:col-span-4 lg:col-start-9" delay={0.08}>
            <p className="eyebrow text-chalk/50">The artwork stage</p>
            <p className="mt-5 text-[13px] leading-relaxed text-chalk/70">
              The collection's graphics carry a hand-made lineage you can see in the prints: bold linework,
              limited palettes and lettering that means something to someone.
            </p>
            <Link href="/about" className="text-link mt-6 self-start text-chalk">
              Read the studio story <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
