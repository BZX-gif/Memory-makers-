import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddToCartNotice } from "@/components/cart/AddToCartNotice";
import { Footer } from "@/components/layout/Footer";
import { siteUrl, storeConfig } from "@/config/store";

const SHARE_SITE_URL = "https://memory-makers-nine.vercel.app/";
const SHARE_IMAGE_URL = `${SHARE_SITE_URL}memory-makers-og.png`;
const SHARE_TITLE = "Memory Makers | Wear the Vision";
const SHARE_DESCRIPTION =
  "Discover statement graphic T-shirts. Express your identity. Wear the vision. Explore Memory Makers.";
const SHARE_TWITTER_DESCRIPTION =
  "Discover statement graphic T-shirts. Express your identity. Wear the vision.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SHARE_TITLE,
    template: "%s — MEMORY MAKERS",
  },
  description: SHARE_DESCRIPTION,
  keywords: ["Memory Makers", "graphic T-shirts", "streetwear India", "anime graphics", "graphic polos"],
  openGraph: {
    type: "website",
    url: SHARE_SITE_URL,
    siteName: storeConfig.brandName,
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [
      {
        url: SHARE_IMAGE_URL,
        width: 1536,
        height: 1024,
        type: "image/png",
        alt: "Memory Makers official brand logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_TWITTER_DESCRIPTION,
    images: [SHARE_IMAGE_URL],
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
          <CartDrawer />
          <AddToCartNotice />
        </CartProvider>
      </body>
    </html>
  );
}
