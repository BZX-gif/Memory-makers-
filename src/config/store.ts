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
  whatsappNumber: "91XXXXXXXXXX", // TODO: BUSINESS OWNER — REPLACE THIS VALUE.
  currency: "INR",
  contact: {
    email: "", // Optional: add a verified public business email.
    location: "India",
  },
  social: {
    // TODO: replace this platform placeholder with the brand's profile URL.
    instagram: "https://www.instagram.com/",
  },
  shipping: {
    information:
      "Delivery availability and any shipping charge are confirmed directly on WhatsApp before an order is accepted.",
  },
} as const;

export function hasConfiguredWhatsApp(number: string = storeConfig.whatsappNumber) {
  return /^[1-9]\d{7,14}$/.test(number);
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
