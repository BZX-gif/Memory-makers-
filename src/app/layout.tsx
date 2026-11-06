import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddToCartNotice } from "@/components/cart/AddToCartNotice";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, pageMetadata, webSiteSchema } from "@/lib/seo";
import { siteUrl, storeConfig } from "@/config/store";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/",
    description: `${storeConfig.brandName} — ${storeConfig.tagline} Character graphic T-shirts, polos and stand-collar tees photographed in the real collection. ₹600 per tee, free shipping across India, orders confirmed personally on WhatsApp.`,
    keywords: [
      "Memory Makers",
      "anime graphic t-shirts India",
      "graphic tees online India",
      "anime streetwear India",
      "graphic polo shirts",
      "stand collar t-shirts",
      "MM Wearable",
    ],
  }),
  title: {
    default: `${storeConfig.brandName} | ${storeConfig.tagline} Anime Graphic Tees India`,
    template: `%s — ${storeConfig.brandName}`,
  },
  metadataBase: new URL(siteUrl),
  applicationName: storeConfig.brandName,
  authors: [{ name: storeConfig.brandName }],
  creator: storeConfig.brandName,
  publisher: storeConfig.brandName,
  formatDetection: { telephone: false, address: false, email: false },
  category: "shopping",
  other: {
    "og:locale:alternate": "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1eb" },
    { media: "(prefers-color-scheme: dark)", color: "#11110f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-3 z-[100] -translate-y-20 bg-ink px-4 py-3 text-xs font-semibold text-chalk transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <GrainOverlay />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <CartDrawer />
          <AddToCartNotice />
          <BackToTop />
          <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        </CartProvider>
      </body>
    </html>
  );
}
