import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

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
          <p className="text-lg leading-relaxed sm:text-xl">Memory Makers turns art, words and ideas into wearable expressions.</p>
          <p className="max-w-md text-sm leading-7 text-chalk/60">A line you needed to hear. An image you cannot forget. A moment that changed shape. We make space for all of it—without telling you what it should mean.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section id="story" className="frame grid py-20 sm:py-28 lg:grid-cols-12 lg:gap-12" aria-labelledby="story-heading">
      <Reveal className="relative aspect-[4/3] overflow-hidden bg-stone lg:col-span-7">
        <Image
          src="/images/studio-story.jpg"
          alt="T-shirt artwork, paper sketches and fabric arranged on a creative studio table"
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
        <p className="absolute bottom-4 left-4 bg-paper px-3 py-2 text-[9px] uppercase tracking-[0.17em]">Behind the marks / Studio notes</p>
      </Reveal>
      <Reveal className="flex flex-col justify-center pt-10 lg:col-span-5 lg:pt-0" delay={0.12}>
        <p className="eyebrow text-muted">03 / The story behind the shirt</p>
        <h2 id="story-heading" className="mt-6 text-[clamp(2.8rem,5vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
          Every mark<br />starts <span className="font-serif font-normal normal-case italic tracking-normal">somewhere.</span>
        </h2>
        <p className="mt-7 text-sm leading-7 text-muted">We start with things worth remembering: overheard sentences, unfamiliar places, familiar feelings. Then we strip them down, draw them out and give them a new life on cloth.</p>
        <div className="mt-8 space-y-5 border-t border-ink/15 pt-7">
          {[
            ["01", "Art before noise", "A clear idea leads. Everything unnecessary leaves."],
            ["02", "Meaning stays personal", "The artwork speaks. You decide what it says."],
            ["03", "Expression over uniform", "Made to join your story, not make everyone’s look the same."],
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
