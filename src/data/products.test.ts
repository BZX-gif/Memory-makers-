import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import { storeConfig } from "@/config/store";
import { featuredProducts, getProductBySlug, getRelatedProducts, heroProduct, products } from "@/data/products";
import { PRODUCT_CATEGORIES } from "@/types";
import { isConfirmedPrice } from "@/lib/utils";

const root = process.cwd();
const sourcePhotos = Array.from({ length: 14 }, (_, index) => `photo_${index + 1}_2026-11-05_14-26-${index < 11 ? "42" : "43"}.jpg`);

describe("real-photo catalogue migration", () => {
  it("accounts for all fourteen garment photos once across thirteen designs", () => {
    const images = products.flatMap((product) => product.images);
    expect(products).toHaveLength(13);
    expect(images).toHaveLength(14);
    expect(new Set(images).size).toBe(14);
    expect(images.map((image) => basename(image)).sort()).toEqual([...sourcePhotos].sort());
    expect(images.every((image) => image.startsWith("/images/products/real/"))).toBe(true);
  });

  it("keeps every original and public copy byte-identical to the pre-migration checksums", () => {
    const checksums = readFileSync(join(root, "docs/original-image-checksums.sha256"), "utf8").trim().split("\n");
    expect(checksums).toHaveLength(15);
    for (const entry of checksums) {
      const [expectedHash, name] = entry.split("  ");
      const original = readFileSync(join(root, name));
      const publicCopy = readFileSync(join(root, "public/images/products/real", name));
      expect(createHash("sha256").update(original).digest("hex")).toBe(expectedHash);
      expect(publicCopy.equals(original)).toBe(true);
    }
  });

  it("uses the Picsart logo as a brand asset rather than a purchasable garment", () => {
    expect(storeConfig.brandImage).toContain("Picsart_26-09-26_18-26-44-656.jpg");
    expect(products.some((product) => product.images.includes(storeConfig.brandImage))).toBe(false);
    expect(readFileSync(join(root, "public", storeConfig.brandImage))).toBeTruthy();
  });

  it("groups only the matching blue/grey Titan polo and maps its colour images", () => {
    const multiImageProducts = products.filter((product) => product.images.length > 1);
    expect(multiImageProducts).toHaveLength(1);
    const polo = multiImageProducts[0];
    expect(polo.id).toBe("mm-real-07");
    expect(polo.availableColors.map((color) => color.name)).toEqual(["Light blue", "Grey"]);
    expect(polo.availableColors.map((color) => color.image)).toEqual(polo.images);
    expect(polo.images.map((image) => basename(image))).toEqual([sourcePhotos[6], sourcePhotos[7]]);
  });

  it("has unique real-product identities, labels and valid image-backed colours", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.slug)).size).toBe(products.length);
    for (const product of products) {
      expect(product.id).toMatch(/^mm-real-\d{2}$/);
      // Owner edits to official names, prices, availability and size lists are valid.
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.price === null || isConfirmedPrice(product.price)).toBe(true);
      expect(product.inStock === null || typeof product.inStock === "boolean").toBe(true);
      expect(product.availableSizes.every((size) => typeof size === "string" && size.trim().length > 0)).toBe(true);
      expect(getProductBySlug(product.slug)).toBe(product);
      for (const color of product.availableColors) {
        expect(color.hex).toMatch(/^#[\da-f]{6}$/i);
        expect(product.images).toContain(color.image);
      }
    }
    expect(getProductBySlug("after-hours")).toBeUndefined();
    expect(getProductBySlug("not-a-product")).toBeUndefined();
  });

  it("supplies populated categories, four featured products and a real hero", () => {
    expect(PRODUCT_CATEGORIES).toHaveLength(3);
    expect(featuredProducts).toHaveLength(4);
    expect(products).toContain(heroProduct);
    for (const category of PRODUCT_CATEGORIES) expect(products.some((product) => product.category === category)).toBe(true);
    for (const product of featuredProducts) expect(product.images[0]).toContain("/real/");
  });

  it("excludes the current product from related results and prioritises its category", () => {
    const originalOrder = products.map((product) => product.id);
    for (const product of products) {
      const related = getRelatedProducts(product);
      expect(related).toHaveLength(4);
      expect(related).not.toContain(product);
      expect(new Set(related.map((item) => item.id)).size).toBe(4);
      expect(related[0].category).toBe(product.category);
    }
    expect(products.map((product) => product.id)).toEqual(originalOrder);
  });
});
