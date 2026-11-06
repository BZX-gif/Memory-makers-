"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { getProductImageAlt } from "@/lib/products";
import type { Product } from "@/types";

interface ProductGalleryProps {
  product: Product;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

/**
 * Gallery with a tap/click zoom lens and keyboard navigation. The photograph
 * itself is never altered — zoom only magnifies the supplied image in place.
 */
export function ProductGallery({ product, selectedImage, onSelectImage }: ProductGalleryProps) {
  const image = product.images[selectedImage] ?? product.images[0];
  const picturedColor = product.availableColors.find((color) => color.image === image);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 42 });

  const step = useCallback(
    (delta: number) => {
      if (product.images.length < 2) return;
      setZoomed(false);
      const next = (selectedImage + delta + product.images.length) % product.images.length;
      onSelectImage(next);
    },
    [onSelectImage, product.images.length, selectedImage],
  );

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div>
      <div
        className="group/gallery relative aspect-[3/4] overflow-hidden bg-[#dedbd3]"
        onPointerMove={onPointerMove}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          if (event.key === "Escape") setZoomed(false);
        }}
        tabIndex={0}
        role="group"
        aria-roledescription="image viewer"
        aria-label={`${product.availableColors.length > 1 ? "Colour photographs" : "Photograph"} of ${getProductImageAlt(product, image)}. Use arrow keys to change image, Enter to zoom.`}
      >
        <button
          type="button"
          onClick={() => setZoomed((value) => !value)}
          className="absolute inset-0 z-10 h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-cobalt"
          aria-pressed={zoomed}
          aria-label={zoomed ? "Zoom out of the photograph" : "Zoom into the photograph"}
        >
          <span className="sr-only">{zoomed ? "Zoom out" : "Zoom in"}</span>
        </button>
        <Image
          src={image}
          alt={getProductImageAlt(product, image)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain transition-transform duration-500 ease-editorial"
          style={zoomed ? { transform: "scale(1.9)", transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
        />

        {product.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/20 bg-paper/90 backdrop-blur transition-colors hover:bg-ink hover:text-chalk"
            >
              <ChevronLeft size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/20 bg-paper/90 backdrop-blur transition-colors hover:bg-ink hover:text-chalk"
            >
              <ChevronRight size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-2 right-2 z-20 flex items-center gap-1.5 border border-ink/15 bg-paper/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-ink/80 backdrop-blur transition-opacity group-hover/gallery:opacity-100 sm:opacity-0">
          {zoomed ? <ZoomOut size={11} aria-hidden="true" /> : <ZoomIn size={11} aria-hidden="true" />}
          {zoomed ? "Tap to reset" : "Tap to zoom"}
        </span>
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
                className={`relative aspect-[3/4] border-2 transition-opacity ${selectedImage === index ? "border-ink" : "border-transparent hover:opacity-70"}`}
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
