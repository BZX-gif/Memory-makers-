import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group min-w-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#dedbd3]">
          <Image
            src={product.images[0]}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.025]"
          />
          <span className={`absolute left-3 top-3 bg-paper/95 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] sm:text-[9px] ${!product.inStock ? "bg-ink text-chalk" : ""}`}>
            {product.inStock ? "Available to request" : "Currently unavailable"}
          </span>
          <span className="absolute bottom-0 right-0 flex h-11 w-11 translate-y-full items-center justify-center bg-ink text-chalk transition-transform duration-300 ease-editorial group-hover:translate-y-0">
            <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div className="min-w-0">
            <h3 className="text-[12px] font-semibold uppercase leading-tight tracking-[-0.015em] sm:text-sm">{product.name}</h3>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.1em] text-muted sm:text-[10px]">{product.category}</p>
          </div>
          <p className="shrink-0 text-xs font-medium tabular-nums sm:text-sm">{formatINR(product.price)}</p>
        </div>
      </Link>
      <div className="mt-3 flex items-center gap-2" aria-label={`Available colours: ${product.availableColors.map((color) => color.name).join(", ")}`}>
        {product.availableColors.map((color) => (
          <span key={color.name} className="h-3 w-3 rounded-full border border-ink/20" style={{ backgroundColor: color.hex }} title={color.name} />
        ))}
        <span className="ml-1 text-[9px] text-muted">{product.availableColors.length} {product.availableColors.length === 1 ? "colour" : "colours"}</span>
      </div>
    </article>
  );
}
