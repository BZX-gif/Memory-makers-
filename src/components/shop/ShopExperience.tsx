"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { products } from "@/data/products";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/types";

const sortOptions = [
  { value: "featured", label: "Curated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

export function ShopExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [availableOnly, setAvailableOnly] = useState(false);

  const categoryParam = searchParams.get("category");
  const category = PRODUCT_CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : "All";

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => !availableOnly || product.inStock)
      .filter((product) => {
        if (!normalizedQuery) return true;
        return [product.name, product.description, product.category]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "name") return a.name.localeCompare(b.name);
        return Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id);
      });
  }, [availableOnly, category, query, sort]);

  const selectCategory = (nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory === "All") params.delete("category");
    else params.set("category", nextCategory);
    const suffix = params.toString();
    router.replace(`/shop${suffix ? `?${suffix}` : ""}`, { scroll: false });
  };

  const clearFilters = () => {
    setQuery("");
    setAvailableOnly(false);
    setSort("featured");
    router.replace("/shop", { scroll: false });
  };

  return (
    <>
      <section className="border-b border-ink/15" aria-label="Product filters">
        <div className="frame py-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by collection">
            {["All", ...PRODUCT_CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 shrink-0 border px-4 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors ${category === item ? "border-ink bg-ink text-chalk" : "border-ink/20 hover:border-ink"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="relative block max-w-xl">
              <span className="sr-only">Search products</span>
              <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, idea or collection"
                className="h-11 w-full border-b border-ink/25 bg-transparent pl-7 pr-9 text-xs outline-none transition-colors placeholder:text-muted focus:border-ink"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center" aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em]">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              Available only
            </label>
            <label className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.1em]">
              <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-11 cursor-pointer border-b border-ink/25 bg-transparent pr-5 text-[10px] font-medium uppercase tracking-[0.08em] outline-none focus:border-ink">
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="frame py-10 sm:py-14" aria-live="polite" aria-busy="false">
        <div className="mb-8 flex items-center justify-between gap-5">
          <p className="eyebrow text-muted">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"} {category !== "All" && `/ ${category}`}</p>
          {(query || category !== "All" || availableOnly || sort !== "featured") && (
            <button type="button" onClick={clearFilters} className="text-link">Reset filters <X size={13} /></button>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <motion.div layout={!reduceMotion} className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => (
                <motion.div
                  layout={!reduceMotion}
                  key={product.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center border-y border-ink/15 py-16 text-center">
            <p className="font-serif text-5xl italic">Nothing here—yet.</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">Try another word or clear the filters to see the full demonstration collection.</p>
            <button type="button" onClick={clearFilters} className="button-dark mt-7">View all pieces</button>
          </div>
        )}

        <div className="mt-12"><DemoNotice compact /></div>
      </section>
    </>
  );
}
