import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteUrl, storeConfig } from "@/config/store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MEMORY MAKERS — Wear Your Memories",
    template: "%s — MEMORY MAKERS",
  },
  description:
    "Graphic, typography, art and minimal T-shirts. Original ideas turned into wearable expressions. Explore MEMORY MAKERS and request your order on WhatsApp.",
  keywords: ["Memory Makers", "graphic T-shirts", "streetwear India", "typography tees", "art T-shirts"],
  openGraph: {
    type: "website",
    siteName: storeConfig.brandName,
    title: "MEMORY MAKERS — Wear Your Memories",
    description: "Not just another T-shirt. An expression of who you are.",
    images: [{ url: "/images/campaign-hero.jpg", width: 928, height: 1152, alt: "Memory Makers streetwear campaign" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEMORY MAKERS — Wear Your Memories",
    description: "Art, words and ideas. Made wearable.",
    images: ["/images/campaign-hero.jpg"],
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
