/**
 * THE JOURNAL — evergreen, editorial guides.
 *
 * Editorial voice only: styling, garment care and silhouette knowledge that is
 * true of printed streetwear in general. Nothing here claims unverified facts
 * about a specific garment (fabric, fit, measurements) or about the business
 * (delivery promises, reviews). Product-adjacent copy links to the catalogue.
 */
export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface JournalPost {
  slug: string;
  title: string;
  /** One-sentence deck shown on the index and in meta descriptions. */
  deck: string;
  section: string;
  published: string;
  modified: string;
  /** Catalogue slug suggested at the end of the piece. */
  relatedSlug: string;
  readMinutes: number;
  blocks: JournalBlock[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: "style-an-anime-graphic-tee",
    title: "How to style an anime graphic tee without saying a word",
    deck: "One loud graphic, everything else quiet: the layering grammar that lets character artwork carry an outfit.",
    section: "Styling",
    published: "2026-11-06",
    modified: "2026-11-06",
    relatedSlug: "graphic-tees",
    readMinutes: 4,
    blocks: [
      {
        type: "p",
        text: "A graphic tee is a statement that has already been written for you. The character, the lettering, the colour story — the artwork arrives with its own volume dial turned up. Styling it well is mostly an exercise in restraint: decide what the tee is saying, then let every other layer stay silent.",
      },
      { type: "h2", text: "Start with the loudest colour in the print" },
      {
        type: "p",
        text: "Look at the artwork before you look at the garment. Most character prints carry one dominant accent — a pink panel, an orange flame, a lavender wash. Pull that accent into exactly one other item: a cap, a sock, a bag strap. One echo reads intentional; three echoes read costume.",
      },
      { type: "h2", text: "Keep the silhouette honest" },
      {
        type: "ul",
        items: [
          "Crew-neck graphic tees sit best under an open overshirt or an unzipped hoodie, so the print stays framed.",
          "Graphic polos with fold-down collars already have structure — tuck them into straight trousers and skip the jacket.",
          "Stand-collar tees read sharp on their own; a plain dark trouser keeps the upright collar as the focal line.",
        ],
      },
      { type: "h2", text: "Neutral ground, one texture" },
      {
        type: "p",
        text: "Black, bone, stone and washed denim are the quiet ground most character art needs. If the outfit feels flat, add texture rather than colour: raw denim, brushed cotton, a matte canvas bag. Texture gives the eye a place to rest without competing with the print.",
      },
      { type: "h2", text: "Let the graphic breathe" },
      {
        type: "p",
        text: "The most common mistake is crowding: chains, stacked logos and busy patterns fighting a print that is already busy. Stand back from the mirror. If you cannot read the artwork in one glance, remove one layer and look again.",
      },
      {
        type: "p",
        text: "When in doubt, remember what the piece is: a memory you recognise, printed on cotton. Style around the feeling, not around the trend cycle — that is the whole point of wearing it.",
      },
    ],
  },
  {
    slug: "wash-printed-tees-so-artwork-lasts",
    title: "Washing printed tees so the artwork outlives the trend",
    deck: "Cold water, inside out, no tumble heat: the care routine that keeps screen-printed character graphics crisp for years.",
    section: "Care",
    published: "2026-11-06",
    modified: "2026-11-06",
    relatedSlug: "graphic-tees",
    readMinutes: 3,
    blocks: [
      {
        type: "p",
        text: "Printed graphics fail long before the fabric does. Cracking, fading and peeling are almost always heat and friction damage, not age. The good news: the routine that prevents them is boring, cheap and takes no extra time.",
      },
      { type: "h2", text: "The four rules" },
      {
        type: "ul",
        items: [
          "Turn the garment inside out before it touches water, so the print never rubs against other fabrics.",
          "Wash cold and gentle. Hot water softens print binders and invites cracking.",
          "Skip the tumble dryer for printed pieces. Line-dry in shade; direct sun bleaches both fabric and ink.",
          "Never iron the artwork. If the garment needs pressing, iron it inside out on a low setting around the print.",
        ],
      },
      { type: "h2", text: "Detergent matters less than dose" },
      {
        type: "p",
        text: "A mild liquid detergent, used sparingly, is enough. Heavy powder doses leave residue that dulls prints over time, and bleach — even 'colour-safe' variants used too often — eats at bright inks first.",
      },
      { type: "h2", text: "Store it flat-ish, never on a thin wire hanger" },
      {
        type: "p",
        text: "Wire hangers stretch shoulder seams and leave peaks in the neckline. Fold printed tees, or use a wide hanger if the garment is polo- or collar-style and you want the collar to keep its shape.",
      },
      {
        type: "p",
        text: "None of this is exotic. It is simply what printed cotton likes: cool water, low friction, no heat. Do that and the character on your chest stays sharp long after the season that sold it has moved on.",
      },
    ],
  },
  {
    slug: "crew-polo-or-stand-collar",
    title: "Crew neck, polo or stand collar: choosing your silhouette",
    deck: "The three collar lines in the photographed collection, and the moods each one carries — from loudest graphic to sharpest frame.",
    section: "Guides",
    published: "2026-11-06",
    modified: "2026-11-06",
    relatedSlug: "stand-collar-tees",
    readMinutes: 3,
    blocks: [
      {
        type: "p",
        text: "Three silhouettes carry the photographed collection, and they are not interchangeable. The collar is the frame around the artwork — change the frame and the same print reads as a different object.",
      },
      { type: "h2", text: "Crew neck: the gallery wall" },
      {
        type: "p",
        text: "A rounded, collarless neckline puts nothing between the eye and the graphic. It is the most casual and the most generous to large front prints. If the artwork is the message, the crew neck is the plainest way to say it.",
      },
      { type: "h2", text: "Polo: the framed print" },
      {
        type: "p",
        text: "A fold-down collar and button placket add a horizontal line above the artwork, like a frame's top edge. Polos carry character prints into rooms where a crew neck would feel too informal — a campus presentation, a family function, a studio visit.",
      },
      { type: "h2", text: "Stand collar: the architectural frame" },
      {
        type: "p",
        text: "An upright collar band sits close to the neck and gives the shoulders a sharper line. It is the most formal of the three and pairs naturally with straight trousers and clean footwear. Character art on a stand collar reads deliberate, almost tailored.",
      },
      { type: "h2", text: "A quick way to choose" },
      {
        type: "ul",
        items: [
          "Loudest possible graphic, most casual day: crew neck.",
          "Graphic plus a little structure, mixed company: polo.",
          "Graphic with a sharp, upright line, dressier settings: stand collar.",
        ],
      },
      {
        type: "p",
        text: "Whichever frame you choose, the collection's photographs show the actual collar lines on the actual garments — compare them side by side before you decide, and send your requested size with the order request.",
      },
    ],
  },
];

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((post) => post.slug === slug);
}

/** Rough word count for Article wordCount — derived, never hand-typed. */
export function postWordCount(post: JournalPost): number {
  const words = post.blocks.flatMap((block) =>
    block.type === "ul" ? block.items : [block.text],
  );
  return words.join(" ").split(/\s+/).filter(Boolean).length;
}
