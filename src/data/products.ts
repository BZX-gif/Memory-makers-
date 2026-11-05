import type { Product, ProductCategory } from "@/types";

/**
 * REAL-PHOTO CATALOGUE — owner-editable, no database required.
 *
 * All descriptions refer only to visible artwork, colours and garment features.
 * "Sample NN" names are descriptive editing labels, NOT official product names.
 * price: null and inStock: null explicitly mean awaiting owner confirmation.
 * availableSizes: [] means unknown; the UI offers sample requested-size labels,
 * never a claim that these sizes are stocked. Fill this array only when verified.
 * Colour names/hex values describe the photographs, not manufacturer colour codes.
 * Promotional material/fit/quality claims embedded in the images are not verified.
 *
 * IDs use a new namespace so saved demonstration items cannot become real items.
 * Photo 07 + 08 show the same print/collar in two colours, not two camera angles.
 * The Picsart file is a logo, NOT inventory; it is used in the brand-story section.
 * Full visual audit: docs/PRODUCT_MIGRATION.md.
 */
const real = "/images/products/real";

export const products: Product[] = [
  {
    id: "mm-real-01",
    slug: "kakashi-yellow-tee",
    name: "Sample 01 — Kakashi graphic tee",
    description: "Yellow crew-neck T-shirt with a multicoloured Kakashi character graphic on the front. The supplied image is labelled Hatake Kakashi.",
    price: null,
    images: [`${real}/photo_1_2026-11-05_14-26-42.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Yellow", hex: "#e9af13", image: `${real}/photo_1_2026-11-05_14-26-42.jpg` }],
    featured: true,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Multicoloured front character print", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-02",
    slug: "tanjiro-lavender-polo",
    name: "Sample 02 — Tanjiro graphic polo",
    description: "Lavender polo with a red, black and white Tanjiro Kamado front graphic. A fold-down collar and button placket are visible in the supplied photograph.",
    price: null,
    images: [`${real}/photo_2_2026-11-05_14-26-42.jpg`],
    category: "Graphic Polos",
    availableSizes: [],
    availableColors: [{ name: "Lavender", hex: "#c6addd", image: `${real}/photo_2_2026-11-05_14-26-42.jpg` }],
    featured: true,
    inStock: null,
    details: ["Short sleeves, fold-down collar and button placket", "Tanjiro Kamado lettering and character panels", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-03",
    slug: "sabo-black-tee",
    name: "Sample 03 — Sabo graphic tee",
    description: "Black crew-neck T-shirt with a hat-and-goggles character portrait and orange flame artwork, visually identified as Sabo from One Piece.",
    price: null,
    images: [`${real}/photo_3_2026-11-05_14-26-42.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Black", hex: "#171716", image: `${real}/photo_3_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Hat, goggles and flame front graphic", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-04",
    slug: "gojo-red-tee",
    name: "Sample 04 — Gojo graphic tee",
    description: "Red crew-neck T-shirt with a white-haired character over a purple graphic panel. Gojo and Jujutsu Kaisen lettering are visible on the front.",
    price: null,
    images: [`${real}/photo_4_2026-11-05_14-26-42.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Red", hex: "#cc1824", image: `${real}/photo_4_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Gojo character graphic with purple and white details", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-05",
    slug: "deku-dark-red-tee",
    name: "Sample 05 — Deku graphic tee",
    description: "Dark red crew-neck T-shirt with a blue, green and black Deku character graphic and Japanese lettering associated with My Hero Academia.",
    price: null,
    images: [`${real}/photo_5_2026-11-05_14-26-42.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Dark red", hex: "#92262d", image: `${real}/photo_5_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Blue and green character artwork on the front", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-06",
    slug: "akatsuki-tobi-black-tee",
    name: "Sample 06 — Akatsuki Tobi tee",
    description: "Black crew-neck T-shirt with a monochrome masked character print and the visible words Akatsuki Tobi, from Naruto.",
    price: null,
    images: [`${real}/photo_6_2026-11-05_14-26-42.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Black", hex: "#171716", image: `${real}/photo_6_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Black-and-white masked character front print", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-07",
    slug: "attack-on-titan-polo",
    name: "Sample 07 — Attack on Titan polo",
    description: "Polo with a red Titan illustration and Attack on Titan lettering. The supplied photographs show the same front print in light blue and grey; both pictured colours share this gallery.",
    price: null,
    images: [
      `${real}/photo_7_2026-11-05_14-26-42.jpg`,
      `${real}/photo_8_2026-11-05_14-26-42.jpg`,
    ],
    category: "Graphic Polos",
    availableSizes: [],
    availableColors: [
      { name: "Light blue", hex: "#91c9e6", image: `${real}/photo_7_2026-11-05_14-26-42.jpg` },
      { name: "Grey", hex: "#a3a4a5", image: `${real}/photo_8_2026-11-05_14-26-42.jpg` },
    ],
    featured: true,
    inStock: null,
    details: ["Short sleeves, fold-down collar and button placket", "Red Titan graphic and white outlined lettering", "Two front views showing different colours, not different angles", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-09",
    slug: "naruto-grey-polo",
    name: "Sample 09 — Naruto graphic polo",
    description: "Light grey polo with a rectangular Naruto character print in orange, red, black and white. The front shows a fold-down collar and button placket.",
    price: null,
    images: [`${real}/photo_9_2026-11-05_14-26-42.jpg`],
    category: "Graphic Polos",
    availableSizes: [],
    availableColors: [{ name: "Light grey", hex: "#c5c5c3", image: `${real}/photo_9_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves, fold-down collar and button placket", "Rectangular Naruto character front print", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-10",
    slug: "kanao-lavender-stand-collar-tee",
    name: "Sample 10 — Kanao stand-collar tee",
    description: "Lavender short-sleeved top with an upright collar, button placket and a Kanao Tsuyuri sword-and-butterfly graphic. Japanese character lettering is visible beside the print.",
    price: null,
    images: [`${real}/photo_10_2026-11-05_14-26-42.jpg`],
    category: "Stand-Collar Tees",
    availableSizes: [],
    availableColors: [{ name: "Lavender", hex: "#c6addd", image: `${real}/photo_10_2026-11-05_14-26-42.jpg` }],
    featured: true,
    inStock: null,
    details: ["Short sleeves with an upright collar and button placket", "Character, sword and butterfly front artwork", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-11",
    slug: "portrait-light-grey-polo",
    name: "Sample 11 — Portrait graphic polo",
    description: "Light grey polo with a black-and-green portrait of a tied-back-haired character and Attack on Titan lettering. The portrait appears to depict Eren Yeager; the character label awaits owner confirmation.",
    price: null,
    images: [`${real}/photo_11_2026-11-05_14-26-42.jpg`],
    category: "Graphic Polos",
    availableSizes: [],
    availableColors: [{ name: "Light grey", hex: "#c5c5c3", image: `${real}/photo_11_2026-11-05_14-26-42.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves, fold-down collar and button placket", "Black portrait over a muted green rectangular graphic", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-12",
    slug: "akatsuki-olive-stand-collar-tee",
    name: "Sample 12 — Akatsuki stand-collar tee",
    description: "Olive green short-sleeved top with an upright collar and button placket. Red Akatsuki lettering sits above black-and-white character panels on the front.",
    price: null,
    images: [`${real}/photo_12_2026-11-05_14-26-43.jpg`],
    category: "Stand-Collar Tees",
    availableSizes: [],
    availableColors: [{ name: "Olive green", hex: "#454a31", image: `${real}/photo_12_2026-11-05_14-26-43.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves with an upright collar and button placket", "Akatsuki lettering and character-panel front print", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-13",
    slug: "luffy-black-tee",
    name: "Sample 13 — Luffy graphic tee",
    description: "Black crew-neck T-shirt with a Monkey D. Luffy character graphic, barrels, straw hats and repeated lettering. One Piece text is visible beneath the artwork.",
    price: null,
    images: [`${real}/photo_13_2026-11-05_14-26-43.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Black", hex: "#171716", image: `${real}/photo_13_2026-11-05_14-26-43.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Monkey D. Luffy artwork with repeated white lettering", "Material, fit and measurements: awaiting owner confirmation"],
  },
  {
    id: "mm-real-14",
    slug: "sukuna-black-tee",
    name: "Sample 14 — Sukuna graphic tee",
    description: "Black crew-neck T-shirt with a pink, white and black Sukuna character panel. Sukuna lettering and Japanese text appear around the front graphic.",
    price: null,
    images: [`${real}/photo_14_2026-11-05_14-26-43.jpg`],
    category: "Graphic Tees",
    availableSizes: [],
    availableColors: [{ name: "Black", hex: "#171716", image: `${real}/photo_14_2026-11-05_14-26-43.jpg` }],
    featured: false,
    inStock: null,
    details: ["Short sleeves and a crew neckline", "Pink-and-white Sukuna character front print", "Material, fit and measurements: awaiting owner confirmation"],
  },
];

export const featuredProducts = products.filter((product) => product.featured);
export const heroProduct = products.find((product) => product.id === "mm-real-14") ?? products[0];

export const categoryDescriptions: Record<ProductCategory, string> = {
  "Graphic Tees": "Character graphics on the pictured crew-neck T-shirts.",
  "Graphic Polos": "Front artwork, fold-down collars and button plackets.",
  "Stand-Collar Tees": "Character prints on the pictured upright-collar styles.",
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
