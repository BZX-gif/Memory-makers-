import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import {
  absoluteUrl,
  breadcrumbSchema,
  canonicalPath,
  faqPageSchema,
  getDisplayTitle,
  itemListSchema,
  organizationSchema,
  pageMetadata,
  productDisplayTitle,
  productSchema,
  webSiteSchema,
} from "@/lib/seo";
import { faqs } from "@/data/faq";

describe("customer-facing titles", () => {
  it("strips internal Sample NN editing labels but keeps honest names", () => {
    expect(getDisplayTitle("Sample 07 — Attack on Titan polo")).toBe("Attack on Titan polo");
    expect(getDisplayTitle("Sample 12 - Akatsuki stand-collar tee")).toBe("Akatsuki stand-collar tee");
    expect(getDisplayTitle("Kakashi graphic tee")).toBe("Kakashi graphic tee");
    expect(getDisplayTitle("  ")).toBe("");
  });

  it("never leaves a catalogue product showing a Sample label", () => {
    for (const product of products) {
      expect(productDisplayTitle(product)).not.toMatch(/^Sample/i);
    }
  });
});

describe("canonical URLs", () => {
  it("always ends with a slash to match trailingSlash routing", () => {
    expect(canonicalPath("/")).toBe("/");
    expect(canonicalPath("/faq")).toBe("/faq/");
    expect(canonicalPath("shop/")).toBe("/shop/");
    expect(absoluteUrl("/product/sukuna-black-tee")).toMatch(/\/product\/sukuna-black-tee\/$/);
  });
});

describe("page metadata", () => {
  it("emits canonical, robots and an absolute Open Graph card", () => {
    const meta = pageMetadata({ path: "/faq", title: "FAQ", description: "Answers." });
    expect(meta.alternates).toEqual({ canonical: "/faq/" });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
    expect(meta.openGraph?.url).toMatch(/\/faq\/$/);
    expect((meta.openGraph?.images as Array<{ url: string }>)[0].url).toMatch(/^https?:\/\//);
  });

  it("can mark personal surfaces noindex", () => {
    const meta = pageMetadata({ path: "/shop", title: "Shop", noindex: true });
    expect(meta.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("structured data", () => {
  it("publishes an Organization and a WebSite with a working search target", () => {
    const org = organizationSchema();
    const site = webSiteSchema();
    expect(org["@type"]).toBe("Organization");
    expect(site.potentialAction.target.urlTemplate).toContain("/shop/?q={search_term_string}");
  });

  it("describes products with the shared pricing module, never invented numbers", () => {
    const schema = productSchema(products[0]) as Record<string, any>;
    expect(schema.name).toBe("Kakashi graphic tee");
    expect(schema.offers.price).toBe(600);
    expect(schema.offers.priceCurrency).toBe("INR");
    expect(schema.offers.shippingDetails.shippingRate.value).toBe(0);
    // No reviews or ratings may ever be synthesised.
    expect(schema.aggregateRating).toBeUndefined();
    expect(schema.review).toBeUndefined();
  });

  it("maps unverified availability to LimitedAvailability, never InStock", () => {
    const unverified = { ...products[0], inStock: null as boolean | null };
    const schema = productSchema(unverified) as Record<string, any>;
    expect(schema.offers.availability).toBe("https://schema.org/LimitedAvailability");

    const soldOut = { ...products[0], inStock: false as boolean | null };
    expect((productSchema(soldOut) as Record<string, any>).offers.availability).toBe("https://schema.org/OutOfStock");
  });

  it("keeps breadcrumbs positional and absolute", () => {
    const schema = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
    ]) as Record<string, any>;
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toMatch(/\/shop\/$/);
  });

  it("mirrors the FAQ answers one-to-one", () => {
    const schema = faqPageSchema(faqs) as Record<string, any>;
    expect(schema.mainEntity).toHaveLength(faqs.length);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
  });

  it("lists catalogue items positionally", () => {
    const schema = itemListSchema(products, "All", "/shop") as Record<string, any>;
    expect(schema.numberOfItems).toBe(products.length);
    expect(schema.itemListElement[0].name).not.toMatch(/^Sample/i);
  });
});
