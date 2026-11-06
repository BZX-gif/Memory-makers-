"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { useCart } from "@/context/CartContext";
import { getProductImage, getSizeOptions, getMaxQuantity, isProductSoldOut } from "@/lib/products";
import type { Product, ProductColor } from "@/types";

/** Keep the pictured colour, selected variant and checkout thumbnail in agreement. */
export function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, startBuyNow } = useCart();
  const [color, setColor] = useState<ProductColor>(product.availableColors[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState("");
  const [error, setError] = useState("");

  const soldOut = isProductSoldOut(product);
  const sizeOptions = getSizeOptions(product);

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

  const inBag = items
    .filter((item) => item.productId === product.id)
    .reduce((total, item) => total + item.quantity, 0);

  const validateSelection = () => {
    if (soldOut) {
      setError("This piece is currently sold out.");
      return false;
    }
    if (!size || !sizeOptions.includes(size)) {
      setError("Choose a size before continuing.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAdd = (quantity = 1) => {
    if (!validateSelection()) return;
    if (!addItem(product, size, color, quantity)) {
      setError(inBag >= getMaxQuantity(product) ? "Your bag already holds every available piece of this design." : "This selection could not be added. Please review the available options.");
    }
  };

  const handleBuyNow = (quantity: number) => {
    if (!validateSelection()) return;
    if (startBuyNow(product, size, color, quantity)) {
      router.push("/checkout?mode=buy-now");
    } else {
      setError("This selection is not available for Buy Now.");
    }
  };

  const focusSizeSelector = () => {
    document.getElementById("size-selector")?.scrollIntoView({ block: "center", behavior: "smooth" });
    window.setTimeout(() => {
      const first = document.querySelector<HTMLButtonElement>("#size-selector button");
      first?.focus({ preventScroll: true });
    }, 380);
  };

  return (
    <>
      <section className="frame grid gap-10 pb-24 lg:grid-cols-12 lg:gap-12 lg:pb-28" aria-label={product.name}>
        <div className="lg:col-span-7">
          <ProductGallery product={product} selectedImage={selectedImage} onSelectImage={selectImage} />
        </div>
        <div className="lg:col-span-5">
          <ProductPurchase
            product={product}
            color={color}
            onColorChange={selectColor}
            size={size}
            onSizeChange={(next) => { setSize(next); setError(""); }}
            error={error}
            onAdd={handleAdd}
            onBuyNow={handleBuyNow}
          />
        </div>
      </section>
      <StickyBuyBar
        product={product}
        size={size}
        soldOut={soldOut}
        onAdd={handleAdd}
        onChooseSize={focusSizeSelector}
      />
    </>
  );
}
