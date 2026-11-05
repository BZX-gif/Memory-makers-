import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteUrl, storeConfig } from "@/config/store";
import { heroProduct } from "@/data/products";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MEMORY MAKERS — Wear Your Memories",
    template: "%s — MEMORY MAKERS",
  },
  description:
    "Explore the MEMORY MAKERS photo catalogue of character graphic T-shirts, polos and stand-collar styles. Request prices, sizes and availability on WhatsApp.",
  keywords: ["Memory Makers", "graphic T-shirts", "streetwear India", "anime graphics", "graphic polos"],
  openGraph: {
    type: "website",
    siteName: storeConfig.brandName,
    title: "MEMORY MAKERS — Wear Your Memories",
    description: "Not just another T-shirt. An expression of who you are.",
    images: [{ url: heroProduct.images[0], width: 960, height: 1280, alt: heroProduct.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEMORY MAKERS — Wear Your Memories",
    description: "Character graphics. Familiar stories. Explore the photographed collection.",
    images: [heroProduct.images[0]],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f1eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-3 z-[100] -translate-y-20 bg-ink px-4 py-3 text-xs font-semibold text-chalk transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
