import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy — What This Site Stores (and Never Stores)",
  description:
    "No accounts, no customer database, no analytics and no payment data. Your bag and checkout draft live in your own browser; order messages travel through WhatsApp like any chat you send.",
});

const sections: Array<{ title: string; body: string[] }> = [
  {
    title: "The short version",
    body: [
      "This storefront has no accounts, no sign-in, no customer database and no analytics. Nothing you type on this website is uploaded to a server owned by the store. Your shopping bag and your unfinished checkout draft are stored only in your own browser, on your own device.",
      "The only moment information leaves your device is when you choose to press Send inside WhatsApp. At that point your message — pieces, sizes, colours, your name, mobile number, address and PIN code — is delivered to the business WhatsApp number exactly like any other chat message you send.",
    ],
  },
  {
    title: "What your browser stores",
    body: [
      "The site uses your browser's local storage (not tracking cookies) for three things: the shopping bag (key: memory-makers:cart:v1), a single Buy Now selection (memory-makers:buy-now:v1), and order handoff drafts so you can reopen a prepared WhatsApp message (memory-makers:order:…).",
      "These entries never leave your device and are not readable by the store. Clearing your browser storage, or using a private window, removes them completely.",
    ],
  },
  {
    title: "What we never collect",
    body: [
      "No passwords or accounts. No payment card details — the website takes no payment at all. No analytics, pixels, heatmaps or advertising identifiers. No newsletter list: following the brand happens on Instagram or WhatsApp, at your choice.",
      "Server logs kept by whatever hosting provider serves the site (IP address, user agent, requested page) are the ordinary logs of any website and are not used for marketing.",
    ],
  },
  {
    title: "WhatsApp and third parties",
    body: [
      "Order requests use WhatsApp's official click-to-chat links (wa.me). When you open one, WhatsApp/Meta handle that conversation under their own privacy policy — the same as any chat you start yourself. The business number receives your message and uses it only to confirm or decline your order request.",
      "Fonts and images on this site are self-hosted: no third-party font or image CDN sees your requests. Instagram links open Instagram under its own privacy policy.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "Browse without an account, forever. Delete your bag and drafts at any time by clearing site storage, or by using the remove/clear controls in the bag itself. Nothing is retained server-side because nothing is stored server-side.",
      "Questions about anything on this page belong on WhatsApp with the store team — the same channel every order uses.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]),
          {
            "@type": "WebPage",
            "@id": "/privacy/#page",
            name: "Privacy — MEMORY MAKERS",
            description: metadata.description as string,
            specialty: "https://schema.org/PrivacyPolicy",
          },
        ]}
      />
      <div className="frame grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow text-muted">Plain language / Last updated November 2026</p>
            <h1 className="mt-6 text-[clamp(3rem,6.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-tightest">
              Your data,<br /><span className="font-serif font-normal normal-case italic tracking-normal">your device.</span>
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-muted">
              A privacy page should be readable in two minutes. This one describes exactly what the code
              does — nothing more, nothing invented.
            </p>
            <Link href="/contact" className="text-link mt-7 self-start">Ask a privacy question</Link>
          </div>
        </header>

        <div className="prose-editorial lg:col-span-7 lg:col-start-6">
          {sections.map((section) => (
            <section key={section.title} aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
