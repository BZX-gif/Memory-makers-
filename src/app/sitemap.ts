import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/store";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/shipping`, changeFrequency: "monthly", priority: 0.4 },
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
