import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import {
  filterProducts,
  getAvailabilityLabel,
  getMaxQuantity,
  getProductImage,
  getProductImageAlt,
  getSizeOptions,
  getStockLabel,
  getStockScarcity,
  isProductSoldOut,
  SAMPLE_SIZE_OPTIONS,
} from "@/lib/products";
import { lowStockProduct, multiColorProduct, picturedProduct, soldOutProduct, untrackedStockProduct } from "@/test/fixtures";
import { PRODUCT_CATEGORIES, type Product } from "@/types";
import { MAX_LINE_QUANTITY } from "@/lib/pricing";

describe("catalogue search and selection", () => {
  it("searches artwork, garment style and pictured colour together", () => {
    expect(filterProducts(products, { query: " titan   GREY " }).map((product) => product.id)).toContain(multiColorProduct.id);
    expect(filterProducts(products, { query: "kakashi yellow" })).toEqual([picturedProduct]);
    expect(filterProducts(products, { query: "butterfly lavender" }).map((product) => product.id)).toEqual(["mm-real-10"]);
    expect(filterProducts(products, { query: "unknown-artwork" })).toEqual([]);
  });

  it("filters real categories and combines category and search", () => {
    for (const category of PRODUCT_CATEGORIES) {
      const filtered = filterProducts(products, { category });
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((product) => product.category === category)).toBe(true);
    }
    expect(filterProducts(products, { category: "Graphic Tees", query: "polo" })).toEqual([]);
  });

  it("excludes sold-out pieces from the availability filter", () => {
    const catalogue = [picturedProduct, soldOutProduct, lowStockProduct];
    expect(filterProducts(catalogue, { availableOnly: true })).toEqual([picturedProduct, lowStockProduct]);
    expect(getAvailabilityLabel(picturedProduct)).toBe("In stock · Free shipping");
    expect(getAvailabilityLabel(soldOutProduct)).toBe("Sold out");
    const unverified = { ...picturedProduct, inStock: null, stock: null } as Product;
    expect(getAvailabilityLabel(unverified)).toBe("Availability to confirm");
  });

  it.each(["price-asc", "price-desc"] as const)("keeps unknown prices last when sorting %s", (sort) => {
    const low = { ...picturedProduct, id: "priced-low", price: 100 };
    const high = { ...picturedProduct, id: "priced-high", price: 900 };
    const unpriced = { ...picturedProduct, id: "unpriced", price: null };
    const catalogue = [unpriced, high, low];
    const expected = sort === "price-asc" ? [low, high, unpriced] : [high, low, unpriced];
    expect(filterProducts(catalogue, { sort })).toEqual(expected);
    expect(catalogue).toEqual([unpriced, high, low]);
  });

  it("sorts by label and featured status without changing inventory order", () => {
    const before = [...products];
    const sorted = filterProducts(products, { sort: "name" });
    expect(sorted.map((product) => product.name)).toEqual(products.map((product) => product.name).sort((a, b) => a.localeCompare(b)));
    expect(filterProducts(products).slice(0, 4).every((product) => product.featured)).toBe(true);
    expect(products).toEqual(before);
  });

  it("offers only marked sample request labels until actual sizes are provided", () => {
    expect(picturedProduct.availableSizes).toEqual([]);
    expect(getSizeOptions(picturedProduct)).toEqual(SAMPLE_SIZE_OPTIONS);
    const verified = { ...picturedProduct, availableSizes: ["M", "L", "XL"] };
    expect(getSizeOptions(verified)).toEqual(["M", "L", "XL"]);
  });

  it("resolves and describes the actual selected colour image", () => {
    const greyImage = getProductImage(multiColorProduct, "Grey");
    expect(greyImage).toBe(multiColorProduct.images[1]);
    expect(getProductImageAlt(multiColorProduct, greyImage)).toContain("in grey");
    expect(getProductImageAlt(multiColorProduct, greyImage)).not.toContain("in light blue");
    expect(getProductImage(multiColorProduct, "missing")).toBe(multiColorProduct.images[0]);
    const invalidImage = { ...picturedProduct, availableColors: [{ ...picturedProduct.availableColors[0], image: "/bad.jpg" }] };
    expect(getProductImage(invalidImage, invalidImage.availableColors[0].name)).toBe(picturedProduct.images[0]);
  });
});

describe("configured stock and scarcity labels", () => {
  it("derives labels from the owner-configured stock count", () => {
    expect(getStockScarcity(lowStockProduct)).toEqual({ label: "ONLY 5 LEFT", tone: "low" });
    const twelveLeft = { ...picturedProduct, stock: 12, stockLabel: null };
    expect(getStockLabel(twelveLeft)).toBe("ONLY 12 LEFT");
    const plentiful = { ...picturedProduct, stock: 40, stockLabel: null };
    expect(getStockLabel(plentiful)).toBe("LIMITED DROP");
  });

  it("honours a configured label override and sold-out state", () => {
    const sellingFast = { ...picturedProduct, stock: 20, stockLabel: "Selling Fast" };
    expect(getStockScarcity(sellingFast)).toEqual({ label: "SELLING FAST", tone: "limited" });
    expect(getStockScarcity(soldOutProduct)).toEqual({ label: "SOLD OUT", tone: "out" });
    expect(getStockScarcity(untrackedStockProduct)).toBeNull();
    expect(isProductSoldOut(soldOutProduct)).toBe(true);
    expect(isProductSoldOut({ ...picturedProduct, stock: 0, inStock: true })).toBe(true);
  });

  it("caps quantity at real stock, up to the per-variant maximum", () => {
    expect(getMaxQuantity(lowStockProduct)).toBe(5);
    expect(getMaxQuantity(picturedProduct)).toBe(Math.min(picturedProduct.stock ?? 10, MAX_LINE_QUANTITY));
    expect(getMaxQuantity(untrackedStockProduct)).toBe(MAX_LINE_QUANTITY);
    expect(getMaxQuantity(soldOutProduct)).toBe(1);
  });
});
