import type { Product, ProductCategory } from "@/types";

/**
 * DEMONSTRATION CATALOGUE — NOT LIVE BUSINESS INVENTORY.
 *
 * Replace every sample item, image, price, specification and availability flag
 * with verified business data before launch. This file is intentionally the
 * single source of truth for the storefront. No database is required.
 * Availability here only controls the demo storefront; final availability is
 * always confirmed by the owner on WhatsApp.
 */
export const products: Product[] = [
  {
    id: "mm-001",
    slug: "after-hours",
    name: "After Hours",
    description:
      "An oversized black canvas traced with an ivory moon and orbiting lines. A graphic for late conversations, long way homes and everything after dark.",
    price: 1299,
    images: ["/images/products/after-hours.jpg"],
    category: "Graphic Tees",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: [
      { name: "Washed Black", hex: "#292a28" },
      { name: "Bone", hex: "#ded8ca" },
    ],
    featured: true,
    inStock: true,
    details: ["Original front artwork", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-002",
    slug: "off-script",
    name: "Off Script",
    description:
      "Two words, no explanation needed. Off Script pairs an unbleached-looking ivory base with direct black typography for days that refuse to follow the plan.",
    price: 999,
    images: ["/images/products/off-script.jpg"],
    category: "Typography Tees",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: [{ name: "Ivory", hex: "#e8e2d3" }],
    featured: true,
    inStock: true,
    details: ["Stacked front typography", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-003",
    slug: "still-becoming",
    name: "Still Becoming",
    description:
      "A quiet reminder placed close to the chest. Still Becoming keeps the composition minimal and the meaning open—made for a work in progress.",
    price: 1099,
    images: ["/images/products/still-becoming.jpg"],
    category: "Typography Tees",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    availableColors: [
      { name: "Warm White", hex: "#eeeae0" },
      { name: "Ink", hex: "#171716" },
    ],
    featured: true,
    inStock: true,
    details: ["Small chest typography", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-004",
    slug: "memory-no-01",
    name: "Memory No. 01",
    description:
      "Loose gestures, cut-paper geometry and an interrupting red circle. The first study in our sample Art Collection turns an ecru tee into a moving canvas.",
    price: 1499,
    images: ["/images/products/memory-no-01.jpg"],
    category: "Art Collection",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: [{ name: "Ecru", hex: "#ddd5c3" }],
    featured: false,
    inStock: false,
    details: ["Original abstract artwork", "Crew neckline", "Boxy silhouette"],
  },
  {
    id: "mm-005",
    slug: "less-but-louder",
    name: "Less, But Louder",
    description:
      "A deep black tee reduced to one small, sharp gesture. Proof that a quiet piece can still say exactly enough.",
    price: 899,
    images: ["/images/products/less-but-louder.jpg"],
    category: "Minimal Collection",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: [{ name: "Black", hex: "#151515" }],
    featured: true,
    inStock: true,
    details: ["Small chest emblem", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-006",
    slug: "daydream-club",
    name: "Daydream Club",
    description:
      "A surreal flower, a sleepy sun and nowhere urgent to be. Soft blue marks sit against faded slate in this open invitation to drift.",
    price: 1299,
    images: ["/images/products/daydream-club.jpg"],
    category: "Art Collection",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: [{ name: "Faded Slate", hex: "#686d6d" }],
    featured: false,
    inStock: true,
    details: ["Original front illustration", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-007",
    slug: "made-of-moments",
    name: "Made of Moments",
    description:
      "Two profiles, one continuous line and a small sun between them. A monochrome study of the people and instants that stay with us.",
    price: 1199,
    images: ["/images/products/made-of-moments.jpg"],
    category: "Graphic Tees",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: [
      { name: "Natural White", hex: "#e8e4d9" },
      { name: "Washed Black", hex: "#292a28" },
    ],
    featured: false,
    inStock: true,
    details: ["Continuous-line artwork", "Crew neckline", "Relaxed silhouette"],
  },
  {
    id: "mm-008",
    slug: "mono-001",
    name: "Mono / 001",
    description:
      "Our sample monogram study in its simplest form. A muted sand base and two intersecting marks make a considered everyday uniform.",
    price: 999,
    images: ["/images/products/mono-001.jpg"],
    category: "Minimal Collection",
    availableSizes: ["XS", "S", "M", "L"],
    availableColors: [{ name: "Sand", hex: "#c2b49d" }],
    featured: false,
    inStock: true,
    details: ["Interlocking chest monogram", "Crew neckline", "Boxy silhouette"],
  },
];

export const featuredProducts = products.filter((product) => product.featured);

export const categoryDescriptions: Record<ProductCategory, string> = {
  "Graphic Tees": "Illustrations and visual stories, made to be worn.",
  "Typography Tees": "Words with weight. Statements without the noise.",
  "Art Collection": "Original compositions, expressive marks and open meaning.",
  "Minimal Collection": "Considered graphics. Nothing extra, nothing missing.",
};

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .sort((a, b) => {
      const categoryScore = Number(b.category === product.category) - Number(a.category === product.category);
      return categoryScore || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
