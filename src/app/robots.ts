import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/order/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
