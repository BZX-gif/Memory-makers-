import { ArrowUpRight, Instagram } from "lucide-react";
import { storeConfig } from "@/config/store";
import { Reveal } from "@/components/ui/Reveal";

export function SocialSection() {
  return (
    <section className="border-t border-ink/15 bg-chalk" aria-labelledby="social-heading">
      <Reveal className="frame flex flex-col items-start justify-between gap-9 py-16 sm:py-20 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-2 text-muted"><Instagram size={14} strokeWidth={1.5} /> Studio, in progress</p>
          <h2 id="social-heading" className="text-[clamp(3rem,7.5vw,8rem)] font-semibold uppercase leading-[0.85] tracking-tightest">Follow<br /><span className="font-serif font-normal normal-case italic tracking-normal">the process.</span></h2>
        </div>
        <div className="max-w-sm lg:pb-2">
          <p className="text-sm leading-7 text-muted">New artwork, studio notes and campaign releases. No pretend newsletter—just find us where the work is happening.</p>
          <a href={storeConfig.social.instagram} target="_blank" rel="noreferrer" className="button-dark mt-6">
            Follow on Instagram <ArrowUpRight size={15} />
          </a>
          <p className="mt-3 text-[9px] uppercase tracking-[0.12em] text-muted">Profile URL is a configurable placeholder.</p>
        </div>
      </Reveal>
    </section>
  );
}
