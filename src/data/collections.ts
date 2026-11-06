import type { Product, ProductCategory } from "@/types";
import { PRODUCT_CATEGORIES } from "@/types";

/**
 * Indexable collection landing pages.
 *
 * Each collection maps a URL-safe slug to a real catalogue category and to
 * editorial copy that only describes what the supplied photographs show plus
 * the store's fixed, owner-configured pricing and ordering policy.
 */
export interface Collection {
  slug: string;
  category: ProductCategory;
  /** One-line meta/OG description. */
  metaDescription: string;
  /** Two short editorial paragraphs for the landing page body. */
  intro: [string, string];
  /** The three style signals a shopper should read from the photographs. */
  highlights: Array<{ title: string; copy: string }>;
}

export const collections: Collection[] = [
  {
    slug: "graphic-tees",
    category: "Graphic Tees",
    metaDescription:
      "Crew-neck graphic T-shirts from the photographed MEMORY MAKERS collection — character artwork on yellow, black, red and dark-red bodies. ₹600 per tee with free shipping.",
    intro: [
      "The crew neck is where the collection speaks loudest: a clean, rounded neckline that lets a single character graphic carry the whole garment. Every tee in this collection is shown in the supplied studio photographs, unchanged, so the artwork you see is the artwork printed on the piece.",
      "Each graphic tee sells for ₹600 (MRP ₹1,200) with free shipping on every order, and four or more tees unlock a single ₹600 discount. Choose a pictured colour and a requested size, then send the order request on WhatsApp — the team confirms availability with you personally before anything is accepted.",
    ],
    highlights: [
      { title: "Crew neckline", copy: "A rounded, rib-free collar line visible across every tee photograph." },
      { title: "Single front graphic", copy: "One character artwork placed at chest height, exactly as photographed." },
      { title: "Fixed, honest price", copy: "₹600 per tee with the ₹1,200 MRP shown struck through beside it." },
    ],
  },
  {
    slug: "graphic-polos",
    category: "Graphic Polos",
    metaDescription:
      "Graphic polo shirts with fold-down collars and button plackets from the photographed MEMORY MAKERS collection — lavender, light blue, grey and light-grey bodies. ₹600, free shipping.",
    intro: [
      "Polos bring structure to the graphic: a fold-down collar and a button placket frame the artwork like a printed poster in a quiet room. The supplied photographs show the same front print across different body colours, so you can compare exactly how one graphic reads on each fabric tone.",
      "Like every piece in the store, each polo is ₹600 (MRP ₹1,200) with free shipping, and four or more tees in one order unlock a single ₹600 discount. Sizes are sent as requests and confirmed with the team on WhatsApp before an order is accepted.",
    ],
    highlights: [
      { title: "Fold-down collar", copy: "A soft, laid collar visible in every polo photograph." },
      { title: "Button placket", copy: "A short buttoned opening below the collar, as photographed." },
      { title: "Colour comparisons", copy: "Some prints are photographed on two body colours, side by side in one gallery." },
    ],
  },
  {
    slug: "stand-collar-tees",
    category: "Stand-Collar Tees",
    metaDescription:
      "Stand-collar graphic tees with upright collars and button plackets from the photographed MEMORY MAKERS collection — lavender and olive bodies. ₹600 per tee, free shipping.",
    intro: [
      "The stand collar sits upright around the neck instead of folding over, giving character artwork a sharper, more architectural frame. In the supplied photographs the upright collar and button placket read clearly against lavender and olive bodies.",
      "Pricing stays fixed and transparent: ₹600 per tee (MRP ₹1,200), free shipping on every order, and a single ₹600 discount once an order holds four or more tees. Send your request on WhatsApp and the team confirms size and availability with you directly.",
    ],
    highlights: [
      { title: "Upright collar", copy: "A stand-up collar band instead of a fold-down polo collar." },
      { title: "Button placket", copy: "A visible buttoned opening below the upright collar." },
      { title: "Quiet body colours", copy: "Lavender and olive bodies keep the graphic the loudest element." },
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getCollectionByCategory(category: ProductCategory): Collection | undefined {
  return collections.find((collection) => collection.category === category);
}

export function collectionProducts(category: ProductCategory, catalogue: Product[]): Product[] {
  return catalogue.filter((product) => product.category === category);
}

export const COLLECTION_CATEGORIES = PRODUCT_CATEGORIES;
