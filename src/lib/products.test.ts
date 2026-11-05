import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { filterProducts, getAvailabilityLabel, getProductImage, getProductImageAlt, getSizeOptions, SAMPLE_SIZE_OPTIONS } from "@/lib/products";
import { multiColorProduct, picturedProduct, pricedProduct, unavailableProduct } from "@/test/fixtures";
import { PRODUCT_CATEGORIES } from "@/types";

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

  it("does not treat unverified stock as confirmed availability or sold out", () => {
    expect(filterProducts([picturedProduct, multiColorProduct], { availableOnly: true })).toEqual([]);
    expect(filterProducts([picturedProduct, unavailableProduct, pricedProduct], { availableOnly: true })).toEqual([pricedProduct]);
    expect(getAvailabilityLabel(picturedProduct)).toBe("Availability to confirm");
    expect(getAvailabilityLabel(unavailableProduct)).toBe("Currently unavailable");
    expect(getAvailabilityLabel(pricedProduct)).toBe("Available to request");
  });

  it.each(["price-asc", "price-desc"] as const)("keeps unknown prices last when sorting %s", (sort) => {
    const low = { ...pricedProduct, id: "priced-low", price: 100 };
    const high = { ...pricedProduct, id: "priced-high", price: 900 };
    const catalogue = [picturedProduct, high, low];
    const expected = sort === "price-asc" ? [low, high, picturedProduct] : [high, low, picturedProduct];
    expect(filterProducts(catalogue, { sort })).toEqual(expected);
    expect(catalogue).toEqual([picturedProduct, high, low]);
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
    expect(getSizeOptions(pricedProduct)).toEqual(["M", "L", "XL"]);
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
