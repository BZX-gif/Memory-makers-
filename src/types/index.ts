export const PRODUCT_CATEGORIES = [
  "Graphic Tees",
  "Typography Tees",
  "Art Collection",
  "Minimal Collection",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  availableSizes: string[];
  availableColors: ProductColor[];
  featured: boolean;
  inStock: boolean;
  details: string[];
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
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
  total: number;
  message: string;
}
