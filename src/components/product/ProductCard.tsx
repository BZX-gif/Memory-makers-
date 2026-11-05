import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { getAvailabilityLabel } from "@/lib/products";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group min-w-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#dedbd3]">
          <Image
            src={product.images[0]}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
          <span className="absolute bottom-0 right-0 flex h-11 w-11 translate-y-full items-center justify-center bg-ink text-chalk transition-transform duration-300 ease-editorial group-hover:translate-y-0 group-focus-within:translate-y-0">
            <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-[8px] font-medium uppercase leading-relaxed tracking-[0.12em] text-muted sm:text-[9px]">{getAvailabilityLabel(product)}</p>
        <div className="pt-2">
          <h3 className="text-[12px] font-semibold uppercase leading-snug tracking-[-0.015em] sm:text-sm">{product.name}</h3>
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.1em] text-muted sm:text-[10px]">{product.category}</p>
          <p className="mt-2 text-xs font-medium tabular-nums sm:text-sm">
            <span className="line-through text-muted">{formatINR(1200)}</span>{" "}
            <span className="text-ink font-bold">{formatINR(600)}</span>{" "}
            <span className="ml-1 px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[7px] font-bold uppercase tracking-wider rounded">50% OFF</span>
          </p>
        </div>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={`Pictured colours: ${product.availableColors.map((color) => color.name).join(", ")}`}>
        {product.availableColors.map((color) => (
          <span key={color.name} className="h-3 w-3 rounded-full border border-ink/20" style={{ backgroundColor: color.hex }} title={color.name} />
        ))}
        <span className="ml-1 text-[9px] text-muted">{product.availableColors.length} {product.availableColors.length === 1 ? "pictured colour" : "pictured colours"}</span>
      </div>
    </article>
  );
}
