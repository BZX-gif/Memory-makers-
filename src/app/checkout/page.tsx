import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery information and prepare your MEMORY MAKERS order request for WhatsApp. No online payment is collected.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="frame min-h-[70vh] py-16" role="status">Preparing checkout…</div>}>
      <CheckoutView />
    </Suspense>
  );
}
