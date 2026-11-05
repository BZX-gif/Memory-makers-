import type { Metadata } from "next";
import { OrderHandoff } from "@/components/checkout/OrderHandoff";

export const metadata: Metadata = {
  title: "Complete Your WhatsApp Request",
  description: "Review and send your MEMORY MAKERS order request in WhatsApp. No order is confirmed until the store team replies.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function OrderPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <OrderHandoff reference={reference} />;
}
