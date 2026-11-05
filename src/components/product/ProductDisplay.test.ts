import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { CatalogueNotice } from "@/components/ui/CatalogueNotice";
import { multiColorProduct, picturedProduct } from "@/test/fixtures";

// next/image and next/link are rendered normally, not replaced with test stubs.
describe("real-photo product presentation", () => {
  it("renders a requestable product card without fake money or stock claims", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: picturedProduct }));
    expect(html).toContain(picturedProduct.name);
    expect(html).toContain("photo_1_2026-11-05_14-26-42.jpg");
    expect(html).toContain("Price to confirm");
    expect(html).toContain("Availability to confirm");
    expect(html).toContain("Pictured colours: Yellow");
    expect(html).not.toContain("Currently unavailable");
    expect(html).not.toContain("₹0");
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

  it("explains the editable labels and unverified business information", () => {
    const html = renderToStaticMarkup(createElement(CatalogueNotice, {}));
    expect(html).toContain("editable descriptive labels");
    expect(html).toContain("Prices, materials, fit, sizes and stock await owner confirmation");
  });
});
