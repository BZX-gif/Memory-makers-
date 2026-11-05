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
  /** Selling price in INR. Every tee is ₹600; use the pricing module for maths. */
  price: number | null;
  /** Original MRP shown struck through (₹1,200). Display only, never a total. */
  compareAtPrice: number | null;
  images: string[];
  category: ProductCategory;
  /** Empty until verified. The UI then offers labelled size requests instead. */
  availableSizes: string[];
  /** Pictured colours only; availability must be confirmed separately. */
  availableColors: ProductColor[];
  featured: boolean;
  /** null = unverified (requests allowed); false = unavailable; true = confirmed. */
  inStock: boolean | null;
  /**
   * Owner-configured units available for this product. This is a manual
   * catalogue limit, not live warehouse inventory. null = not tracked.
   */
  stock: number | null;
  /** Optional scarcity label override, e.g. "LIMITED DROP" or "SELLING FAST". */
  stockLabel?: string | null;
  details: string[];
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  /** Persisted for the order record; totals always use the pricing module. */
  price: number;
  compareAtPrice: number;
  /** Maximum quantity of this variant allowed by the configured stock. */
  maxQuantity: number;
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
  subtotal: number;
  /** Exactly ₹600 when the order qualified, otherwise ₹0. */
  bundleDiscount: number;
  shipping: number;
  total: number;
  message: string;
}
