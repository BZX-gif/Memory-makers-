"use client";

import Image from "next/image";
import { getProductImageAlt } from "@/lib/products";
import type { Product } from "@/types";

interface ProductGalleryProps {
  product: Product;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export function ProductGallery({ product, selectedImage, onSelectImage }: ProductGalleryProps) {
  const image = product.images[selectedImage] ?? product.images[0];
  const picturedColor = product.availableColors.find((color) => color.image === image);

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#dedbd3]">
        <Image
          src={image}
          alt={getProductImageAlt(product, image)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
        />
      </div>
      {product.images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="Choose product image">
          {product.images.map((source, index) => {
            const color = product.availableColors.find((option) => option.image === source);
            return (
              <button
                type="button"
                key={source}
                onClick={() => onSelectImage(index)}
                className={`relative aspect-[3/4] border-2 ${selectedImage === index ? "border-ink" : "border-transparent"}`}
                aria-label={`View image ${index + 1}${color ? `: ${color.name}` : ""}`}
                aria-pressed={selectedImage === index}
              >
                <Image src={source} alt="" fill sizes="(max-width: 1024px) 25vw, 15vw" className="object-contain" />
              </button>
            );
          })}
        </div>
      )}
      <p className="mt-3 text-[9px] uppercase leading-relaxed tracking-[0.13em] text-muted">
        Supplied photograph / Front view{picturedColor ? ` / ${picturedColor.name}` : ""} / {selectedImage + 1} of {product.images.length}
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-muted">Photographs are shown unchanged. Promotional text inside them is not a verified material, fit or stock specification.</p>
    </div>
  );
}
