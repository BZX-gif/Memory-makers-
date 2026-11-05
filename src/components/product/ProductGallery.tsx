"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#dedbd3]">
        <Image
          src={product.images[selectedImage]}
          alt={`${product.name} in ${product.availableColors[0].name}, view ${selectedImage + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 left-4 bg-paper px-3 py-2 text-[9px] uppercase tracking-[0.16em]">MM / {product.id.replace("mm-", "")}</span>
      </div>
      {product.images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="Choose product image">
          {product.images.map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square border ${selectedImage === index ? "border-ink" : "border-transparent"}`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedImage === index}
            >
              <Image src={image} alt="" fill sizes="15vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-[9px] uppercase tracking-[0.13em] text-muted">Original demonstration visual / Front artwork view</p>
    </div>
  );
}
