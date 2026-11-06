import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

/**
 * Frequently asked questions — every answer repeats a fact the store can
 * stand behind. No delivery windows, no invented policies, no fake reviews.
 * Where the business has not confirmed something yet (returns, exact
 * measurements), the answer says exactly that and points to WhatsApp.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqs: FaqEntry[] = [
  {
    question: "How much does a tee cost?",
    answer: `Every piece in the collection sells for ${formatINR(UNIT_PRICE)}, shown next to its ${formatINR(ORIGINAL_UNIT_PRICE)} MRP struck through. Shipping is free on every order, and an order holding ${BUNDLE_QUANTITY} or more tees gets a single ${formatINR(BUNDLE_DISCOUNT)} discount — the discount is applied once per order, not per tee.`,
  },
  {
    question: "Can I pay on the website?",
    answer:
      "No. This website never collects a payment. Checkout prepares a WhatsApp message containing your pieces, sizes, colours and the exact total. You review that message and press Send yourself inside WhatsApp, and the store team confirms the order with you personally before anything is accepted.",
  },
  {
    question: "Is my order confirmed when WhatsApp opens?",
    answer:
      "No. Opening WhatsApp — or even sending the message — is only a request. The order becomes real when the store team replies and confirms availability, your delivery details and the final amount. Until then nothing is reserved.",
  },
  {
    question: "When will my order arrive?",
    answer:
      "This website deliberately does not promise a delivery window. Delivery timing is confirmed with you directly on WhatsApp before you agree to pay, because it depends on your location and the team's confirmation of the pieces you requested.",
  },
  {
    question: "Are the product photos real?",
    answer:
      "Yes. The catalogue uses the supplied studio photographs of the actual garments, shown unchanged. Promotional text printed inside some photographs is part of the image and is not a verified specification of material, fit or stock.",
  },
  {
    question: "How do sizes work?",
    answer:
      "Sizes are sent as requests (S to XXL by default). The team confirms fit and measurements with you on WhatsApp before accepting the order, because verified garment measurements are still being finalised by the owner. Measure yourself first — the size guide explains how — and mention your chest measurement in the order notes if you want an exact match.",
  },
  {
    question: "What do the colour names mean?",
    answer:
      "Colour names and swatches describe the body colour visible in each photograph, so you always know exactly which pictured garment you are requesting. Where a print was photographed on two body colours, both appear in one gallery and selecting a colour switches to its matching photograph.",
  },
  {
    question: "What does 'ONLY 5 LEFT' mean?",
    answer:
      "It is the owner's manual catalogue count for that design, and the bag will not let you order more pieces than that count. It is not a live warehouse feed and it is not a countdown — the number changes only when the owner updates the catalogue.",
  },
  {
    question: "What is your return or exchange policy?",
    answer:
      "The business has not published a return or exchange policy yet, so this website does not invent one. Before you send an order request, ask the team on WhatsApp how returns, exchanges and defects are handled for your order, and keep their reply with your order reference.",
  },
  {
    question: "Is my data stored anywhere?",
    answer:
      "Your bag and checkout draft live only in your own browser's local storage; there is no account system and no customer database on this site. When you press Send, your message travels through WhatsApp like any other chat message you send.",
  },
];
