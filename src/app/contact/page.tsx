import type { Metadata } from "next";
import { ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteUrl, hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact — WhatsApp, Instagram & Order Questions",
  description:
    "Reach MEMORY MAKERS the way orders work: a WhatsApp message to the business number, or the brand Instagram. No contact forms, no data collected, no invented support hours.",
});

const includeInMessage = [
  "The piece you want (its name or product link)",
  "Your requested size — and your chest measurement if you want an exact match",
  "The pictured colour you prefer",
  "Your city and PIN code, so delivery can be confirmed for your area",
];

export default function ContactPage() {
  const whatsappUrl = hasConfiguredWhatsApp()
    ? buildWhatsAppUrl(`Hello ${storeConfig.brandName}, I have a question about the collection.`)
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          {
            "@type": "ContactPage",
            "@id": "/contact/#contact",
            name: `Contact ${storeConfig.brandName}`,
            description: metadata.description as string,
            mainEntity: { "@id": `${siteUrl}/#organization` },
          },
        ]}
      />
      <div className="frame grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <p className="eyebrow text-muted">Say hello / No forms, no queues</p>
          <h1 className="mt-6 text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-tightest">
            Talk to<br /><span className="font-serif font-normal normal-case italic tracking-normal">a person.</span>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-7 text-muted">
            Every order on this site ends in a WhatsApp conversation, so questions should too. Message the
            business number and a human replies — availability, sizing, delivery to your PIN code, anything.
          </p>

          <div className="mt-9 flex flex-col gap-4">
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-dark w-full sm:w-auto">
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> Message on WhatsApp
              </a>
            ) : (
              <p className="border border-ink/20 p-4 text-xs leading-relaxed text-muted">
                The business WhatsApp number is awaiting owner setup, so messaging is temporarily unavailable.
              </p>
            )}
            <a href={storeConfig.social.instagram} target="_blank" rel="noreferrer" className="button-light w-full sm:w-auto">
              <Instagram size={16} strokeWidth={1.5} aria-hidden="true" /> Instagram <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            {storeConfig.contact.email && (
              <a href={`mailto:${storeConfig.contact.email}`} className="text-link self-start">{storeConfig.contact.email}</a>
            )}
          </div>
        </header>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-ink/20 bg-chalk p-7 sm:p-9">
            <h2 className="text-xl font-semibold uppercase tracking-[-0.03em]">What to include</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              A complete first message gets a complete first answer. These four lines save a round trip:
            </p>
            <ol className="mt-6 space-y-4">
              {includeInMessage.map((item, index) => (
                <li key={item} className="grid grid-cols-[32px_1fr] gap-3 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] tabular-nums text-muted">0{index + 1}</span>
                  <span className="text-[13px] leading-relaxed text-ink">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-muted">
            We do not publish support hours or response-time promises we cannot guarantee. Messages sent on
            WhatsApp are ordinary chats between you and the business number — this website never stores them.
          </p>
        </div>
      </div>
    </>
  );
}
