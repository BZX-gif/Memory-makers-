/**
 * BUSINESS OWNER: this is the only file you need for store contact settings.
 *
 * Replace whatsappNumber with your WhatsApp Business number in international
 * format: country code + number, digits only, with no + or spaces.
 * Example format only: 91 followed by your 10-digit Indian mobile number.
 *
 * Leave the X placeholder unchanged until the real number is available.
 * Checkout will clearly show a setup notice and will not send to a fake number.
 */
export const storeConfig = {
  brandName: "MEMORY MAKERS",
  tagline: "WEAR YOUR MEMORIES.",
  // Supplied artwork, not a product or a change to the store's name.
  brandImage: "/images/products/real/Picsart_26-09-26_18-26-44-656.jpg",
  whatsappNumber: "918128464638", // Business WhatsApp number
  currency: "INR",
  contact: {
    email: "", // Optional: add a verified public business email.
    location: "India",
  },
  social: {
    // Business Instagram profile
    instagram: "https://www.instagram.com/mm_weareble/",
  },
  credit: {
    // Discreet "Designed & developed by WEBPI" signature at the very bottom of the footer.
    // OWNER: paste a verified WEBPI website or social profile URL (https://...) to make the
    // name clickable. Leave it empty until a real URL is confirmed — the name then renders
    // as plain text, so no invented destination is ever shipped.
    label: "WEBPI",
    url: "https://webpi-lovat.vercel.app/",
  },
  shipping: {
    // Store policy: shipping is free on every order.
    free: true,
    label: "FREE",
    information:
      "Shipping is free on every order. Add four or more tees and ₹600 is taken off the order once. Delivery timing is confirmed directly on WhatsApp before an order is accepted.",
  },
  offers: {
    unitPrice: 600,
    originalUnitPrice: 1200,
    bundleQuantity: 4,
    bundleDiscount: 600,
  },
} as const;

export function hasConfiguredWhatsApp(number: string = storeConfig.whatsappNumber) {
  return /^[1-9]\d{7,14}$/.test(number);
}

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
