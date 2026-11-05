"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { getProductImage } from "@/lib/products";
import type { Product, ProductColor } from "@/types";

/** Keep the pictured colour, selected variant and checkout thumbnail in agreement. */
export function ProductDetails({ product }: { product: Product }) {
  const [color, setColor] = useState(product.availableColors[0]);
  const [selectedImage, setSelectedImage] = useState(0);

  const selectColor = (nextColor: ProductColor) => {
    setColor(nextColor);
    setSelectedImage(Math.max(0, product.images.indexOf(getProductImage(product, nextColor.name))));
  };

  const selectImage = (index: number) => {
    const image = product.images[index];
    if (!image) return;
    setSelectedImage(index);
    const picturedColor = product.availableColors.find((option) => option.image === image);
    if (picturedColor) setColor(picturedColor);
  };

  return (
    <section className="frame grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-28" aria-label={product.name}>
      <div className="lg:col-span-7"><ProductGallery product={product} selectedImage={selectedImage} onSelectImage={selectImage} /></div>
      <div className="lg:col-span-5"><ProductPurchase product={product} color={color} onColorChange={selectColor} /></div>
    </section>
  );
}
