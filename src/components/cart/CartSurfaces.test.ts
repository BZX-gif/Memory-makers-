import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddToCartNotice } from "@/components/cart/AddToCartNotice";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartView } from "@/components/cart/CartView";
import { OrderBreakdown } from "@/components/cart/OrderBreakdown";
import { createCartItem } from "@/lib/cart";
import { calculateOrderTotals, type OrderTotals } from "@/lib/pricing";
import { products } from "@/data/products";
import type { AddNotice } from "@/context/CartContext";
import type { CartItem } from "@/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/cart",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const cartState = vi.hoisted(() => ({
  items: [] as CartItem[],
  totals: null as OrderTotals | null,
  addNotice: null as AddNotice | null,
  drawerOpen: true,
}));

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    items: cartState.items,
    totals: cartState.totals,
    itemCount: cartState.totals?.itemCount ?? 0,
    hydrated: true,
    buyNowItem: null,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    startBuyNow: vi.fn(),
    clearBuyNow: vi.fn(),
    drawerOpen: cartState.drawerOpen,
    openDrawer: vi.fn(),
    closeDrawer: vi.fn(),
    addNotice: cartState.addNotice,
    dismissAddNotice: vi.fn(),
  }),
}));

const teeA = products[0];
const teeB = products[2];
const item = (product: typeof teeA, size: string, quantity = 1) =>
  createCartItem(product, size, product.availableColors[0], quantity)!;

function seed(items: CartItem[]) {
  cartState.items = items;
  cartState.totals = calculateOrderTotals(items);
}

beforeEach(() => {
  cartState.drawerOpen = true;
  cartState.addNotice = null;
  seed([]);
});

describe("cart drawer", () => {
  it("shows the four-part breakdown with FREE shipping and a single discount", () => {
    seed([item(teeA, "M", 2), item(teeB, "L", 2)]);
    const html = renderToStaticMarkup(createElement(CartDrawer));

    expect(html).toContain("Subtotal");
    expect(html).toContain("₹2,400");
    expect(html).toContain("Bundle discount");
    expect(html).toContain("−₹600");
    expect(html).toContain("Shipping");
    expect(html).toContain("FREE");
    expect(html).toContain("Final amount payable");
    expect(html).toContain("₹1,800");
    expect(html).toContain("₹1,200");
    expect(html).toContain("Free shipping · FREE on every order");
    expect(html).toContain("Checkout on WhatsApp");
    expect(html).toContain("View full bag");
    expect(html).toContain("Your ₹600 discount has been applied.");
  });

  it("renders a mobile-first full-width panel with a single column of controls", () => {
    seed([item(teeA, "M")]);
    const html = renderToStaticMarkup(createElement(CartDrawer));
    expect(html).toContain("w-full max-w-[26rem]");
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("Subtotal");
    expect(html).toContain("₹600");
    expect(html).toContain("3 more for −₹600");
    expect(html).toContain("−₹0");
  });

  it("shows an empty state instead of invented items", () => {
    const html = renderToStaticMarkup(createElement(CartDrawer));
    expect(html).toContain("Nothing here yet.");
    expect(html).toContain("Explore the collection");
    expect(html).not.toContain("Final amount payable");
  });
});

describe("add-to-cart notice", () => {
  it("invites the customer to add three more tees after one add", () => {
    seed([item(teeA, "M")]);
    cartState.addNotice = { id: 1, productName: teeA.name, quantity: 1 };
    const html = renderToStaticMarkup(createElement(AddToCartNotice));

    expect(html).toContain("Good choice.");
    expect(html).toContain("Add 3 more tees and unlock ₹600 off.");
    expect(html).toContain("1 tee · 01/04");
    expect(html).toContain("Subtotal");
    expect(html).toContain("₹600");
    expect(html).toContain("Continue shopping");
    expect(html).toContain("View bag");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="1"');
    expect(html).not.toContain('aria-modal="true"');
  });

  it("switches to the reward message and shows the payable amount at four tees", () => {
    seed([item(teeA, "M", 2), item(teeB, "L", 2)]);
    cartState.addNotice = { id: 2, productName: teeB.name, quantity: 1 };
    const html = renderToStaticMarkup(createElement(AddToCartNotice));

    expect(html).toContain("Reward unlocked.");
    expect(html).toContain("Your ₹600 discount has been applied.");
    expect(html).toContain("−₹600");
    expect(html).toContain("₹1,800");
    expect(html).toContain('aria-valuenow="4"');
    expect(html).not.toContain("Add 3 more tees");
  });

  it("stays silent when nothing has been added", () => {
    seed([item(teeA, "M")]);
    const html = renderToStaticMarkup(createElement(AddToCartNotice));
    expect(html).not.toContain("Good choice.");
  });
});

describe("cart page and shared breakdown", () => {
  it("renders the cart page totals with the free-shipping message", () => {
    seed([item(teeA, "M", 3), item(teeB, "XL", 1)]);
    const html = renderToStaticMarkup(createElement(CartView));
    expect(html).toContain("₹2,400");
    expect(html).toContain("−₹600");
    expect(html).toContain("FREE");
    expect(html).toContain("₹1,800");
    expect(html).toContain("Shipping FREE on every order");
    expect(html).toContain("Proceed to checkout");
    expect(html).toContain("4 tees");
  });

  it("uses the same numbers for the compact drawer breakdown and the large checkout one", () => {
    const totals = calculateOrderTotals([{ quantity: 8 }]);
    const compact = renderToStaticMarkup(createElement(OrderBreakdown, { totals, size: "compact" }));
    const large = renderToStaticMarkup(createElement(OrderBreakdown, { totals, size: "large" }));
    for (const html of [compact, large]) {
      expect(html).toContain("₹4,800");
      expect(html).toContain("−₹600");
      expect(html).toContain("₹4,200");
      expect(html).toContain("FREE");
    }
    expect(large).toContain("text-4xl");
  });
});
