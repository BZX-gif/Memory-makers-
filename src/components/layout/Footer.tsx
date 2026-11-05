import { ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import { Wordmark } from "./Wordmark";

const shopLinks = [
  ["All pieces", "/shop"],
  ["Graphic Tees", "/shop?category=Graphic+Tees"],
  ["Typography Tees", "/shop?category=Typography+Tees"],
  ["Art Collection", "/shop?category=Art+Collection"],
  ["Minimal Collection", "/shop?category=Minimal+Collection"],
];

export function Footer() {
  const whatsappUrl = hasConfiguredWhatsApp()
    ? buildWhatsAppUrl(`Hello ${storeConfig.brandName}, I would like to ask about your T-shirts.`)
    : null;

  return (
    <footer className="bg-ink text-chalk">
      <div className="frame grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-5">
          <Wordmark inverted className="scale-125 origin-top-left" />
          <p className="mt-8 max-w-sm text-[clamp(2rem,3.5vw,3.8rem)] font-medium uppercase leading-[0.94] tracking-[-0.055em]">
            Keep the moment.<br /><span className="font-serif font-normal normal-case italic tracking-normal">Wear the feeling.</span>
          </p>
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
          <h2 className="eyebrow mb-5 text-chalk/50">Information</h2>
          <ul className="space-y-3 text-sm text-chalk/80">
            <li><Link href="/#story" className="transition-opacity hover:opacity-55">Our story</Link></li>
            <li><Link href="/cart" className="transition-opacity hover:opacity-55">Shopping bag</Link></li>
            <li><Link href="/checkout" className="transition-opacity hover:opacity-55">Checkout</Link></li>
            <li><Link href="/shipping" className="transition-opacity hover:opacity-55">Shipping & orders</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
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

      <div className="frame border-t border-chalk/15 py-6">
        <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.13em] text-chalk/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Memory Makers. All rights reserved.</p>
          <p>Demo storefront · No online payment · Order requests via WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
