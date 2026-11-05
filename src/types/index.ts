export const PRODUCT_CATEGORIES = [
  "Graphic Tees",
  "Graphic Polos",
  "Stand-Collar Tees",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface ProductColor {
  /** Descriptive label and approximate swatch for a pictured colour, not stock. */
  name: string;
  hex: string;
  /** A gallery image of this colour. Never substitute another colour in the bag. */
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Use an explicitly marked sample label until the owner supplies a name. */
  name: string;
  description: string;
  /** null means awaiting a quote, not free or zero-priced. */
  price: number | null;
  images: string[];
  category: ProductCategory;
  /** Empty until verified. The UI then offers labelled size requests instead. */
  availableSizes: string[];
  /** Pictured colours only; availability must be confirmed separately. */
  availableColors: ProductColor[];
  featured: boolean;
  /** null = unverified (requests allowed); false = unavailable; true = confirmed. */
  inStock: boolean | null;
  details: string[];
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number | null;
  image: string;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface CheckoutCustomer {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  instructions: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutCustomer, string>>;

export interface OrderDraft {
  reference: string;
  createdAt: string;
  source: "cart" | "buy-now";
  customer: CheckoutCustomer;
  items: CartItem[];
  /** Unknown if any item still needs a quote. Never a partial monetary total. */
  subtotal: number | null;
  /** Final payable amount after Buy 4, Get 1 Free discount */
  total: number | null;
  message: string;
}
