import type { Product, ProductCategory } from "@/types";
import { isConfirmedPrice } from "@/lib/utils";

/** Editable request labels only. These are NOT verified stocked sizes. */
export const SAMPLE_SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export function getSizeOptions(product: Product) {
  return product.availableSizes.length > 0 ? product.availableSizes : SAMPLE_SIZE_OPTIONS;
}

export function getAvailabilityLabel(product: Product) {
  if (product.inStock === true) return "Available to request";
  if (product.inStock === false) return "Currently unavailable";
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
    .filter((product) => !availableOnly || product.inStock === true)
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
