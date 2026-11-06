import type { MetadataRoute } from "next";
import { storeConfig } from "@/config/store";

/** Installable PWA manifest — derived icons only, from the supplied logo. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${storeConfig.brandName} — ${storeConfig.tagline}`,
    short_name: "Memory Makers",
    description:
      "Character graphic T-shirts, polos and stand-collar tees from the photographed collection. ₹600 per tee, free shipping, orders confirmed on WhatsApp.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f1eb",
    theme_color: "#11110f",
    categories: ["shopping", "lifestyle"],
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
