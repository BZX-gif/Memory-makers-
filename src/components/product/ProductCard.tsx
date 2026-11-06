import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuickView } from "@/components/product/QuickView";
import type { Product } from "@/types";
import { getAvailabilityLabel, getProductImageAlt, getStockScarcity } from "@/lib/products";
import { ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { productDisplayTitle } from "@/lib/seo";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const scarcity = getStockScarcity(product);
  const title = productDisplayTitle(product);
  const hoverImage = product.images[1];

  return (
    <article className="group min-w-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#dedbd3]">
          <Image
            src={product.images[0]}
            alt={getProductImageAlt(product, product.images[0])}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100"
            />
          )}
          {scarcity && (
            <span
              className={`absolute left-2 top-2 border px-1.5 py-1 text-[7.5px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm sm:left-3 sm:top-3 sm:text-[8px] ${
                scarcity.tone === "out"
                  ? "border-ink bg-ink text-chalk"
                  : "border-ink/25 bg-paper/95 text-ink"
              }`}
            >
              {scarcity.label}
            </span>
          )}
          <span className="absolute bottom-0 right-0 flex h-11 w-11 translate-y-full items-center justify-center bg-ink text-chalk transition-transform duration-300 ease-editorial group-hover:translate-y-0 group-focus-within:translate-y-0">
            <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-[8px] font-medium uppercase leading-relaxed tracking-[0.12em] text-muted sm:text-[9px]">{getAvailabilityLabel(product)}</p>
        <div className="pt-2">
          <h3 className="text-[12px] font-semibold uppercase leading-snug tracking-[-0.015em] sm:text-sm">{title}</h3>
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.1em] text-muted sm:text-[10px]">{product.category}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs tabular-nums sm:text-sm">
            <span className="font-bold text-ink">{formatINR(UNIT_PRICE)}</span>
            <span className="text-[11px] text-muted line-through sm:text-xs">{formatINR(ORIGINAL_UNIT_PRICE)}</span>
            <span className="ml-0.5 border border-ink/25 px-1 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-muted">50% off</span>
          </p>
        </div>
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-2">
        <div className="flex items-center gap-2" aria-label={`Pictured colours: ${product.availableColors.map((color) => color.name).join(", ")}`}>
          {product.availableColors.map((color) => (
            <span key={color.name} className="h-3 w-3 rounded-full border border-ink/20" style={{ backgroundColor: color.hex }} title={color.name} />
          ))}
          <span className="text-[9px] text-muted">{product.availableColors.length} {product.availableColors.length === 1 ? "colour" : "colours"}</span>
        </div>
        <QuickView product={product} />
      </div>
    </article>
  );
}
