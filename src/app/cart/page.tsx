import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Shopping Bag",
  description: "Review your MEMORY MAKERS pieces, selected sizes and colours, update quantities and continue to WhatsApp checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
