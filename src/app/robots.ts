import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personal surfaces: the bag, checkout drafts and order handoffs hold
        // customer-entered data and must never appear in search results.
        disallow: ["/checkout", "/order/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
