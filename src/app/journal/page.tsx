import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { journalPosts } from "@/data/journal";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/journal",
  title: "The Journal — Styling, Care & Silhouette Guides",
  description:
    "Field notes on wearing printed streetwear: how to style an anime graphic tee, how to wash prints so artwork lasts, and how to choose between crew neck, polo and stand collar.",
});

export default function JournalIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
          ]),
          {
            "@type": "Blog",
            "@id": "/journal/#blog",
            name: "The MEMORY MAKERS Journal",
            description: "Styling, care and silhouette guides for printed streetwear.",
            blogPost: journalPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.deck,
              datePublished: post.published,
              dateModified: post.modified,
              url: `/journal/${post.slug}/`,
            })),
          },
        ]}
      />
      <header className="frame pb-12 pt-12 sm:pb-16 sm:pt-20">
        <p className="eyebrow text-muted">Field notes / {journalPosts.length} guides</p>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(3.4rem,8.5vw,8.5rem)] font-black uppercase leading-[0.82] tracking-tightest">
          The <span className="font-serif font-normal normal-case italic tracking-normal">journal.</span>
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
          Practical writing about printed streetwear — styling, care and silhouettes. No hype, no invented
          specs: just what actually makes a graphic tee last and read well.
        </p>
      </header>

      <div className="frame pb-20 sm:pb-28">
        <ol className="border-t border-ink/20">
          {journalPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05}>
              <li>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group grid gap-4 border-b border-ink/20 py-9 sm:grid-cols-[80px_1fr_auto] sm:gap-8 sm:py-11"
                >
                  <span className="eyebrow text-muted">0{index + 1} / {post.section}</span>
                  <div>
                    <h2 className="max-w-[24ch] text-[clamp(1.7rem,3.4vw,3rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em] transition-opacity group-hover:opacity-60">
                      {post.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted">{post.deck}</p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-muted">
                      {post.readMinutes} min read
                    </p>
                  </div>
                  <ArrowUpRight
                    size={26}
                    strokeWidth={1.2}
                    className="hidden self-center transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </>
  );
}
