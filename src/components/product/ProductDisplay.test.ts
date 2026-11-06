import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { CatalogueNotice } from "@/components/ui/CatalogueNotice";
import { getDisplayTitle } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";
import { lowStockProduct, multiColorProduct, picturedProduct, soldOutProduct } from "@/test/fixtures";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/shop",
}));

// next/image and next/link are rendered normally, not replaced with test stubs.
const renderInCart = (node: ReactElement) =>
  renderToStaticMarkup(createElement(CartProvider, null, node));

describe("real-photo product presentation", () => {
  it("shows the ₹600 selling price against the ₹1,200 original on every card", () => {
    const html = renderInCart(createElement(ProductCard, { product: picturedProduct }));
    expect(html).toContain(getDisplayTitle(picturedProduct.name));
    // Customer surfaces never leak the internal "Sample NN —" editing label.
    expect(html).not.toContain("Sample 01 —");
    expect(html).toContain("photo_1_2026-11-05_14-26-42.jpg");
    expect(html).toContain("₹600");
    expect(html).toContain("₹1,200");
    expect(html).toContain("50% off");
    expect(html).toContain("Free shipping");
    expect(html).toContain("Quick view");
    expect(html).not.toContain("Price to confirm");
    expect(html).not.toContain("₹0<");
  });

  it("renders the configured scarcity label and a sold-out state", () => {
    expect(renderInCart(createElement(ProductCard, { product: lowStockProduct }))).toContain("ONLY 5 LEFT");
    expect(renderInCart(createElement(ProductCard, { product: soldOutProduct }))).toContain("SOLD OUT");
    expect(renderInCart(createElement(ProductCard, { product: soldOutProduct }))).toContain("Sold out");
  });

  it("labels the grey gallery photograph correctly and exposes both thumbnails", () => {
    const html = renderToStaticMarkup(createElement(ProductGallery, { product: multiColorProduct, selectedImage: 1, onSelectImage: () => {} }));
    expect(html).toContain("in grey — supplied front-view photograph");
    expect(html).toContain('aria-label="View image 1: Light blue"');
    expect(html).toContain('aria-label="View image 2: Grey"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("object-contain");
    expect(html).not.toContain("demonstration visual");
  });

  it("does not manufacture extra angles for a one-photo product", () => {
    const html = renderToStaticMarkup(createElement(ProductGallery, { product: picturedProduct, selectedImage: 0, onSelectImage: () => {} }));
    expect(html).not.toContain('aria-label="Choose product image"');
    expect(html).toContain("Supplied photograph / Front view");
  });

  it("explains the fixed price, free shipping and configured stock", () => {
    const html = renderToStaticMarkup(createElement(CatalogueNotice, {}));
    expect(html).toContain("editable descriptive labels");
    expect(html).toContain("₹600");
    expect(html).toContain("free shipping");
    expect(html).toContain("manually configured catalogue stock");
  });
});
