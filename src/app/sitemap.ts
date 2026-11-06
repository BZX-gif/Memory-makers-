import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { journalPosts } from "@/data/journal";
import { products } from "@/data/products";
import { siteUrl } from "@/config/store";

/** Single source for "when did this content last change". */
const CONTENT_UPDATED = new Date("2026-11-06T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/collections`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.85 },
    ...collections.map((collection) => ({
      url: `${siteUrl}/collections/${collection.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/journal`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    ...journalPosts.map((post) => ({
      url: `${siteUrl}/journal/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    { url: `${siteUrl}/about`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/size-guide`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/shipping`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];
}
