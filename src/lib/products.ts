import type { Product, ProductCategory } from "@/types";
import { isConfirmedPrice } from "@/lib/utils";
import { MAX_LINE_QUANTITY } from "@/lib/pricing";

/** Editable request labels only. These are NOT verified stocked sizes. */
export const SAMPLE_SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export function getSizeOptions(product: Product) {
  return product.availableSizes.length > 0 ? product.availableSizes : SAMPLE_SIZE_OPTIONS;
}

/** A manually configured stock count of zero is sold out, like inStock: false. */
export function isProductSoldOut(product: Product) {
  return product.inStock === false || (typeof product.stock === "number" && product.stock <= 0);
}

/**
 * Quantity ceiling for a variant. Uses the owner-configured stock count so a
 * customer can never add more pieces than the catalogue says are available.
 */
export function getMaxQuantity(product: Product) {
  if (isProductSoldOut(product)) return 1;
  if (typeof product.stock === "number" && Number.isFinite(product.stock)) {
    return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(product.stock)));
  }
  return MAX_LINE_QUANTITY;
}

export type StockTone = "low" | "limited" | "out";

export interface StockScarcity {
  label: string;
  tone: StockTone;
}

/**
 * Tasteful scarcity copy derived from real, configured catalogue values.
 * Never randomly generated and never presented as live warehouse inventory.
 */
export function getStockScarcity(product: Product): StockScarcity | null {
  if (isProductSoldOut(product)) return { label: "SOLD OUT", tone: "out" };

  const override = product.stockLabel?.trim();
  if (override) return { label: override.toUpperCase(), tone: "limited" };

  if (typeof product.stock !== "number" || !Number.isFinite(product.stock)) return null;
  const stock = Math.floor(product.stock);
  if (stock <= 12) return { label: `ONLY ${stock} LEFT`, tone: stock <= 5 ? "low" : "limited" };
  return { label: "LIMITED DROP", tone: "limited" };
}

export function getStockLabel(product: Product) {
  return getStockScarcity(product)?.label ?? null;
}

export function getAvailabilityLabel(product: Product) {
  if (isProductSoldOut(product)) return "Sold out";
  if (product.inStock === true) return "In stock · Free shipping";
  return "Availability to confirm";
}

export function getProductImage(product: Product, colorName?: string) {
  const color = product.availableColors.find((option) => option.name === colorName);
  return color?.image && product.images.includes(color.image) ? color.image : product.images[0];
}

export function getProductImageAlt(product: Product, image: string) {
  const color = product.availableColors.find((option) => option.image === image);
  return `${product.name}${color ? ` in ${color.name.toLowerCase()}` : ""} — supplied front-view photograph`;
}

export type ProductSortOption = "featured" | "price-asc" | "price-desc" | "name";

interface ProductFilters {
  category?: ProductCategory | "All";
  query?: string;
  availableOnly?: boolean;
  sort?: ProductSortOption;
}

/** Shared, testable catalogue filtering. Unknown prices always sort last. */
export function filterProducts(catalogue: Product[], filters: ProductFilters = {}) {
  const { category = "All", query = "", availableOnly = false, sort = "featured" } = filters;
  const searchWords = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);

  return catalogue
    .filter((product) => category === "All" || product.category === category)
    .filter((product) => !availableOnly || (product.inStock === true && !isProductSoldOut(product)))
    .filter((product) => {
      const text = [product.id, product.name, product.description, product.category, ...product.details, ...product.availableColors.map((color) => color.name)].join(" ").toLocaleLowerCase();
      return searchWords.every((word) => text.includes(word));
    })
    .sort((a, b) => {
      if (sort === "price-asc" || sort === "price-desc") {
        const aPriced = isConfirmedPrice(a.price);
        const bPriced = isConfirmedPrice(b.price);
        if (aPriced !== bPriced) return aPriced ? -1 : 1;
        if (aPriced && bPriced) {
          const difference = (a.price as number) - (b.price as number);
          if (difference) return sort === "price-asc" ? difference : -difference;
        }
        return a.name.localeCompare(b.name);
      }
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id);
    });
}
