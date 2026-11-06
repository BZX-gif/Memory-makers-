import type { Metadata } from "next";
import { siteUrl, storeConfig } from "@/config/store";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, ORIGINAL_UNIT_PRICE, SHIPPING_FEE, SHIPPING_LABEL, UNIT_PRICE } from "@/lib/pricing";
import { getStockScarcity, isProductSoldOut } from "@/lib/products";
import { formatINR, getDisplayTitle } from "@/lib/utils";

export { getDisplayTitle };
import type { Product } from "@/types";

/**
 * CENTRAL SEO MODULE.
 *
 * Every canonical URL, Open Graph card, Twitter card and JSON-LD block on the
 * site is produced here so the whole storefront speaks with one consistent,
 * verifiable voice. Nothing in this file invents business facts: prices, stock
 * tone, shipping and contact details are all read from the shared pricing
 * module and the owner-editable store config.
 */

export const BRAND_NAME = storeConfig.brandName;
export const BRAND_TAGLINE = storeConfig.tagline;

/** Dimensions of public/og/site-og.jpg — keep in sync with scripts/generate-brand-assets.sh. */
export const OG_IMAGE = {
  url: "/og/site-og.jpg",
  width: 1200,
  height: 630,
  alt: `${storeConfig.brandName} — ${storeConfig.tagline}`,
} as const;

export function productDisplayTitle(product: Product): string {
  return getDisplayTitle(product.name);
}

/** next.config sets trailingSlash, so every canonical path must end with "/". */
export function canonicalPath(path = "/"): string {
  if (path === "" || path === "/") return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${canonicalPath(path)}`;
}

interface PageMetaOptions {
  /** Site-relative path, e.g. "/faq" or `/product/${slug}`. */
  path: string;
  /** Omit for the homepage default title; pass null for the same. */
  title?: string | null;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  openGraphType?: "website" | "article" | "profile";
  /** Thin or personal surfaces (cart, order handoff) must stay out of search. */
  noindex?: boolean;
  keywords?: string[];
}

/** One consistent metadata shape for every indexable page. */
export function pageMetadata({
  path,
  title,
  description,
  image = OG_IMAGE.url,
  imageAlt = OG_IMAGE.alt,
  imageWidth = OG_IMAGE.width,
  imageHeight = OG_IMAGE.height,
  openGraphType = "website",
  noindex = false,
  keywords,
}: PageMetaOptions): Metadata {
  const canonical = canonicalPath(path);
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } as Metadata["robots"],
    openGraph: {
      type: openGraphType,
      url: absoluteUrl(path),
      siteName: BRAND_NAME,
      locale: "en_IN",
      ...(title ? { title: `${title} — ${BRAND_NAME}` } : {}),
      ...(description ? { description } : {}),
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
          type: imageUrl.endsWith(".png") ? "image/png" : "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title: `${title} — ${BRAND_NAME}` } : {}),
      ...(description ? { description } : {}),
      images: [imageUrl],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: BRAND_NAME,
    alternateName: "MM Wearable",
    slogan: BRAND_TAGLINE,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon.svg`,
      width: 64,
      height: 64,
    },
    image: `${siteUrl}${OG_IMAGE.url}`,
    areaServed: { "@type": "Country", name: "India" },
    ...(storeConfig.social.instagram
      ? { sameAs: [storeConfig.social.instagram] }
      : {}),
    ...(storeConfig.contact.email
      ? { email: storeConfig.contact.email }
      : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["en", "hi"],
      ...(storeConfig.contact.email ? { email: storeConfig.contact.email } : {}),
    },
  };
}

export function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: absoluteUrl("/"),
    name: BRAND_NAME,
    description: storeConfig.tagline,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** schema.org availability that matches the honest catalogue state. */
function offerAvailability(product: Product): string {
  if (isProductSoldOut(product)) return "https://schema.org/OutOfStock";
  if (product.inStock === true) return "https://schema.org/InStock";
  // "Availability to confirm": never claim InStock for unverified stock.
  return "https://schema.org/LimitedAvailability";
}

export function productSchema(product: Product) {
  const scarcity = getStockScarcity(product);
  const title = productDisplayTitle(product);

  return {
    "@type": "Product",
    "@id": `${absoluteUrl(`/product/${product.slug}`)}#product`,
    name: title,
    description: product.description,
    sku: product.id,
    category: product.category,
    url: absoluteUrl(`/product/${product.slug}`),
    image: product.images.map((image) => `${siteUrl}${image}`),
    brand: { "@id": `${siteUrl}/#organization` },
    color: product.availableColors.map((color) => color.name).join(", "),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: storeConfig.currency,
      price: UNIT_PRICE,
      ...(scarcity ? { name: scarcity.label } : {}),
      availability: offerAvailability(product),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: UNIT_PRICE,
        priceCurrency: storeConfig.currency,
        // The struck-through MRP the storefront shows next to the selling price.
        ...(ORIGINAL_UNIT_PRICE > UNIT_PRICE ? { maxPrice: ORIGINAL_UNIT_PRICE } : {}),
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: SHIPPING_FEE,
          currency: storeConfig.currency,
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          // No delivery window is promised by the site: timing is confirmed
          // personally on WhatsApp before an order is accepted.
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "d",
          },
        },
      },
      ...(storeConfig.contact.email ? { seller: { "@id": `${siteUrl}/#organization` } } : {}),
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Collection", value: product.category },
      { "@type": "PropertyValue", name: "Ordering", value: "Order request sent on WhatsApp, confirmed personally by the store team" },
      { "@type": "PropertyValue", name: "Shipping", value: `Free on every order (${SHIPPING_LABEL})` },
    ],
    isRelatedTo: product.availableColors.map((color) => ({
      "@type": "Product",
      name: `${title} — ${color.name}`,
    })),
  };
}

export function itemListSchema(products: Product[], name: string, path: string) {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#items`,
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: productDisplayTitle(product),
      url: absoluteUrl(`/product/${product.slug}`),
    })),
  };
}

export function faqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/faq")}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleSchema(options: {
  slug: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  image?: string;
  words: number;
  section: string;
}) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(`/journal/${options.slug}`)}#article`,
    headline: options.headline,
    description: options.description,
    inLanguage: "en-IN",
    datePublished: options.published,
    dateModified: options.modified,
    wordCount: options.words,
    articleSection: options.section,
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: absoluteUrl(`/journal/${options.slug}`),
    ...(options.image ? { image: `${siteUrl}${options.image}` } : {}),
  };
}

/** The single price sentence reused across titles, descriptions and snippets. */
export function priceLine(): string {
  return `${formatINR(UNIT_PRICE)} per tee (MRP ${formatINR(ORIGINAL_UNIT_PRICE)}), free shipping on every order, and ${formatINR(BUNDLE_DISCOUNT)} off once at ${BUNDLE_QUANTITY}+ tees.`;
}
