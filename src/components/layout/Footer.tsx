import { ArrowUpRight, BadgeIndianRupee, Bell, Camera, Instagram, MessageCircle, Truck } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import { DeveloperCredit } from "./DeveloperCredit";
import { Wordmark } from "./Wordmark";
import { collections } from "@/data/collections";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/types";

const shopLinks = [
  ["All pieces", "/shop"],
  ...PRODUCT_CATEGORIES.map((category) => [category, `/shop?category=${encodeURIComponent(category)}`]),
];

const helpLinks = [
  ["FAQ", "/faq"],
  ["Size guide", "/size-guide"],
  ["Shipping & orders", "/shipping"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["The journal", "/journal"],
];

export function Footer() {
  const whatsappUrl = hasConfiguredWhatsApp()
    ? buildWhatsAppUrl(`Hello ${storeConfig.brandName}, I would like to ask about your T-shirts.`)
    : null;
  const dropAlertUrl = hasConfiguredWhatsApp()
    ? buildWhatsAppUrl(`Hello ${storeConfig.brandName}, please send me a message when a new drop lands.`)
    : null;

  return (
    <footer className="bg-ink text-chalk">
      <div className="frame grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Wordmark inverted className="scale-125 origin-top-left" />
          <p className="mt-8 max-w-sm text-[clamp(2rem,3.5vw,3.6rem)] font-medium uppercase leading-[0.94] tracking-[-0.055em]">
            Keep the moment.<br /><span className="font-serif font-normal normal-case italic tracking-normal">Wear the feeling.</span>
          </p>
          <ul className="mt-9 space-y-3 border-t border-chalk/15 pt-7">
            {[
              [Truck, "Free shipping on every order"],
              [BadgeIndianRupee, `${formatINR(UNIT_PRICE)} per tee · ${formatINR(BUNDLE_DISCOUNT)} off at ${BUNDLE_QUANTITY}+ tees`],
              [Camera, "Catalogue shown in real, unchanged photographs"],
            ].map(([Icon, label]) => {
              const Glyph = Icon as typeof Truck;
              return (
                <li key={label as string} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.13em] text-chalk/60">
                  <Glyph size={14} strokeWidth={1.6} aria-hidden="true" /> {label as string}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-5 text-chalk/50">Explore</h2>
          <ul className="space-y-3">
            {shopLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-chalk/80 transition-opacity hover:opacity-55">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-5 text-chalk/50">Collections</h2>
          <ul className="space-y-3">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link href={`/collections/${collection.slug}`} className="text-sm text-chalk/80 transition-opacity hover:opacity-55">
                  {collection.category}
                </Link>
              </li>
            ))}
            <li><Link href="/about" className="text-sm text-chalk/80 transition-opacity hover:opacity-55">About the studio</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-5 text-chalk/50">Help</h2>
          <ul className="space-y-3">
            {helpLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-chalk/80 transition-opacity hover:opacity-55">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-5 text-chalk/50">Say hello</h2>
          <div className="space-y-4 text-sm text-chalk/80">
            <a href={storeConfig.social.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-opacity hover:opacity-55">
              <Instagram size={16} strokeWidth={1.5} aria-hidden="true" /> Instagram <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-opacity hover:opacity-55">
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> WhatsApp <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ) : (
              <p className="flex items-start gap-2 text-chalk/55"><MessageCircle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" /> WhatsApp number awaiting owner setup</p>
            )}
            <p>{storeConfig.contact.location}</p>
            {storeConfig.contact.email && <a href={`mailto:${storeConfig.contact.email}`}>{storeConfig.contact.email}</a>}
          </div>
        </div>
      </div>

      {dropAlertUrl && (
        <div className="border-t border-chalk/15">
          <div className="frame flex flex-col items-start justify-between gap-6 py-9 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-chalk/30">
                <Bell size={16} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.1em]">Drop alerts on WhatsApp</p>
                <p className="mt-2 max-w-md text-[11px] leading-relaxed text-chalk/60">
                  One message to the business number asking to be notified. No mailing list, no form, no data
                  stored — the conversation stays in your own WhatsApp.
                </p>
              </div>
            </div>
            <a href={dropAlertUrl} target="_blank" rel="noreferrer" className="button-light shrink-0 border-chalk text-chalk hover:bg-chalk hover:text-ink">
              Ask for drop alerts <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}

      <div className="frame border-t border-chalk/15 pb-7 pt-6 sm:pb-8">
        <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.13em] text-chalk/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Memory Makers. All rights reserved.</p>
          <p>Photo catalogue · No online payment · Order requests via WhatsApp</p>
        </div>
        <div className="mt-6 border-t border-chalk/10 pt-5 sm:mt-7 sm:pt-6">
          <DeveloperCredit />
        </div>
      </div>
    </footer>
  );
}
