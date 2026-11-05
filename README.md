# MEMORY MAKERS

**WEAR YOUR MEMORIES.** A premium, responsive streetwear storefront built with Next.js, TypeScript and Tailwind CSS. It runs without a database, authentication, paid APIs or a payment gateway. Customers prepare an itemised order request and choose to send it themselves in WhatsApp.

> **Launch status:** pricing, cart and checkout are implemented and production-buildable. Every tee sells for **₹600** (MRP ₹1,200) with **free shipping**, and **4+ tees unlock one ₹600 discount per order**. The catalogue has 13 garment designs from 14 supplied photos; the fifteenth image is the supplied logo. Official names, fabric specifications and stocked sizes still need owner confirmation. Stock counts are manual catalogue values, not live warehouse inventory. The business WhatsApp number is configured in `src/config/store.ts` (`+91 81284 64638`).

See **[the complete photo-by-photo migration report](docs/PRODUCT_MIGRATION.md)** and **[original-image checksums](docs/original-image-checksums.sha256)**.

## What is built

- Existing editorial homepage and Next.js architecture retained, now using the supplied product photographs and logo.
- Responsive sticky navigation, animated mobile menu and live bag count.
- Thirteen photo-backed designs across Graphic Tees, Graphic Polos and Stand-Collar Tees; all supplied originals preserved unchanged.
- Artwork/style/colour search, real category filters, a confirmed-availability filter and price/name sorting. Unconfirmed prices always sort last.
- Statically generated product pages with SEO metadata, galleries, mandatory size requests, synchronized gallery/colour selectors, quantity controls, availability protection, visible-feature details and related pieces.
- One shared pricing module (`src/lib/pricing.ts`) drives every money figure: ₹600 per tee, ₹1,200 original, free shipping and exactly one ₹600 bundle discount at 4+ tees (8 tees still get ₹600 off once).
- Persistent LocalStorage bag with variant-aware line items (`product + size + colour`), colour-specific thumbnails, stock-capped quantity controls, removal and automatic recalculation.
- Premium slide-over cart drawer plus a quiet, auto-dismissing "GOOD CHOICE." add-to-bag notice with a four-tick reward progress indicator, live cart quantity, subtotal and a "REWARD UNLOCKED." state.
- Quick-view popup on every product card with the same price, stock, size, colour, quantity and cart rules as the product page.
- Independent Buy Now checkout storage that never replaces or silently clears the main bag.
- Checkout validation for required fields, Indian mobile numbers and six-digit Indian PIN codes.
- Unique client-side `MM-XXXXXX` order references and readable, URL-encoded WhatsApp messages.
- Official `https://wa.me/` handoff supporting the mobile app and WhatsApp Web.
- Honest handoff page: reopen WhatsApp, review/copy the message, and explicit reminders that the customer must press **Send** and the team must confirm the order.
- Configured scarcity labels per product (`ONLY 12 LEFT`, `ONLY 5 LEFT`, `LIMITED DROP`, `SELLING FAST`) derived from manual stock counts; quantities cannot exceed configured stock.
- No payment collection, fake confirmation, reviews, trust badges, live-inventory claims or newsletter backend.
- Responsive images, local fonts, reduced-motion support, semantic controls, metadata, Open Graph, sitemap, robots rules, loading/error/not-found pages.
- 141 unit/rendering tests for original-asset preservation, catalogue integrity, filtering, variants, the pricing table (1–10 tees), cart/checkout/WhatsApp parity, stock caps, cart recovery, validation, order drafts, references and WhatsApp formatting.

## Technology

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 3
- Framer Motion (purposeful UI transitions)
- Lucide React icons
- Vitest
- LocalStorage for bag, Buy Now selection and browser-local order handoff drafts

All runtime services used by the storefront are free. There are no API keys or secrets.

## Installation

Requirements: **Node.js 22.12 or newer** and npm.

```bash
npm install
cp .env.example .env.local   # optional for local development
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev        # development server on 0.0.0.0:3000
npm run typecheck  # strict TypeScript check
npm run lint       # same strict type check; no deprecated next lint wrapper
npm test           # run unit tests once
npm run test:watch # watch unit tests
npm run build      # optimized production build
npm start          # serve the production build on 0.0.0.0:3000
npm audit          # check dependency advisories
```

## Required owner configuration

### 1. WhatsApp Business number — exact location

The business number is configured in **`src/config/store.ts`**:

```ts
whatsappNumber: "918128464638", // +91 81284 64638
```

Use international format with **digits only**: country code followed by the number, without `+`, spaces or dashes. If the number changes, edit only this value; every checkout button and footer link reads it. Checkout refuses to open a message if the value is missing or malformed.

### 1b. Pricing and stock

- Prices are fixed by store policy in `src/lib/pricing.ts`: ₹600 selling price, ₹1,200 original, free shipping, and one ₹600 discount at four or more tees. Change a value there once and every surface updates.
- Per-product `stock` and optional `stockLabel` live in `src/data/products.ts`. They are manual catalogue numbers: update them yourself as pieces sell. No stock is ever decremented automatically and no live-inventory claim is made.

### 2. Complete the real-photo catalogue

Edit **`src/data/products.ts`**. The real-photo records and galleries are already integrated; do not replace them with fictional inventory.

- **Names:** `Sample NN — …` is an editable visual description, not an official business name. Replace it with a verified product name when available. The portrait in photo 11 has intentionally generic wording until its character identity is confirmed.
- **Prices:** every product is `price: 600` with `compareAtPrice: 1200`. The selling price is fixed by the store policy in `src/lib/pricing.ts`; do not hardcode amounts in components. Every surface (cards, product page, quick view, drawer, cart, checkout, saved order, WhatsApp message) reads the same function.
- **Stock:** `stock` is a manually configured count shown as a scarcity label and used to cap order quantity. `stockLabel` overrides the derived label (for example `SELLING FAST`). Set `stock: 0` or `inStock: false` to sell a piece out. These are catalogue values, not live inventory — there is no warehouse integration, and the site never decrements stock automatically.
- **Availability:** `inStock: true` allows Add to bag/Buy Now, `false` disables both, and `null` keeps a request possible while showing "Availability to confirm". This remains a manual catalogue, not a live inventory system.
- **Sizes:** `availableSizes: []` means unknown. The UI uses explicitly marked requested-size labels from `SAMPLE_SIZE_OPTIONS` in `src/lib/products.ts`; those labels are not an inventory or measurement claim. Replace the empty array with only verified size options.
- **Colours/images:** `availableColors` retains its existing field name but currently represents **pictured** colours, not confirmed stock. Each colour's `image` belongs to the product's `images` array. Photos 7 and 8 are the light-blue and grey variants of one Attack on Titan polo; selecting a colour also selects the matching photo and checkout thumbnail.
- **Specifications:** only visible features are described. Add verified material, fit and measurements when supplied; marketing claims embedded in an image have not been verified.

All 15 uploaded originals remain in the repository root. Their byte-identical public copies are in **`public/images/products/real/`**, using case-exact root-relative paths. The Picsart image is a logo used by `storeConfig.brandImage`, not a product. Keep existing product IDs/slugs stable when editing business details so saved real selections and links keep working.

### 3. Contact and social details

In **`src/config/store.ts`**:

- Replace the generic Instagram platform URL with the brand's real profile URL.
- Optionally add a verified public business email.
- Review the shipping information. Add verified shipping charges/timelines only when the owner supplies them; do not invent promises.

### 4. Verified product and business policies

Before launch, complete the unconfirmed garment specifications with verified fit/material details and add any real return, exchange, privacy or terms policies required by the business. Neither garment claims nor policies have been fabricated. The original promotional text inside supplied photographs is preserved, but does not become a verified specification.

### 5. Production URL

Set `NEXT_PUBLIC_SITE_URL` to the final canonical URL in Vercel (or in `.env.local`) so sitemap and metadata URLs are correct:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

No other environment variables are needed. If a canonical URL is not supplied, Vercel deployment hostname variables are used when available; local development falls back to `http://localhost:3000`.

## Free deployment on Vercel

1. Push this branch to GitHub.
2. Sign in to Vercel's free Hobby tier and choose **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically.
4. Keep build command `npm run build` and output settings at their defaults.
5. Add `NEXT_PUBLIC_SITE_URL` under Environment Variables. Redeploy after changing it or store settings.
6. Deploy, then test the real WhatsApp number on both a phone and WhatsApp Web.

A custom domain is optional; the included Vercel domain is enough to operate at zero cost. Vercel's current free-tier limits and commercial-use terms should be reviewed by the owner before launch.

## Project structure

```text
public/
  images/
    products/
      real/                   # 14 unchanged garment photographs + supplied logo
    ...                       # earlier demo assets retained, no longer displayed
src/
  app/
    page.tsx                  # homepage
    layout.tsx                # metadata, local fonts and shared shell
    globals.css               # editorial design system
    shop/page.tsx
    product/[slug]/page.tsx
    cart/page.tsx
    checkout/page.tsx
    order/[reference]/page.tsx
    shipping/page.tsx
    sitemap.ts
    robots.ts
    loading.tsx
    error.tsx
    not-found.tsx
  components/
    layout/                   # wordmark, header, footer
    home/                     # hero, collections, story, social
    shop/                     # search/filter/sort experience
    product/                  # cards, gallery and purchase controls
    cart/                     # bag page, drawer, add notice, shared breakdown
    checkout/                 # form, handoff and field components
    ui/                       # motion reveal, quantity and real-catalogue notice
  context/CartContext.tsx      # bag, Buy Now, drawer and add-notice state
  data/products.ts             # PHOTO-BACKED INVENTORY / EDITABLE BUSINESS DETAILS
  config/store.ts              # OWNER CONTACT / WHATSAPP CONFIG
  lib/
    cart.ts                   # trusted catalogue recovery, stock caps and reducer
    pricing.ts                # THE pricing source of truth (₹600, free shipping, bundle)
    order.ts                  # browser-local handoff drafts, including pending totals
    products.ts               # request sizes, stock labels/caps, colour images, filters
    utils.ts                  # INR formatting and stock-aware quantity clamping
    validation.ts             # customer and Indian format validation
    whatsapp.ts               # reference, message and wa.me URL
    *.test.ts                 # unit tests
  types/index.ts
  test/fixtures.ts             # test-only prices/stock, not storefront inventory
docs/
  PRODUCT_MIGRATION.md         # visual audit, catalogue mapping and verification
  original-image-checksums.sha256
```

## Order and privacy behavior

- No order is sent to a backend and no payment is requested.
- The bag and Buy Now selection are stored only in the customer's browser, using the existing v1 storage keys. Catalogue data is revalidated when storage is read; stale prices and malformed/unavailable items are not trusted. The new `mm-real-*` ID namespace prevents retired demonstration entries from silently turning into unrelated real products.
- Order totals are recomputed from the shared pricing function on every quantity change or removal; a saved draft with edited totals is rejected when reopened. Requested sizes and pictured colours are not a stock reservation.
- Submitting checkout creates a browser-local handoff draft and asks the browser to open WhatsApp with a prepared message. If a popup is blocked, the handoff page provides reopen and copy controls.
- Opening WhatsApp is **not** presented as a successful order. The customer must press Send, and the owner must confirm availability, final charges and acceptance.
- The main bag is intentionally retained after handoff. The customer can explicitly clear it from the handoff page. Buy Now never clears pre-existing bag contents.
- Order drafts are not secure server-side order records. Clearing browser storage removes them. Do not treat order references as authenticated or unique across every device.

## Verification

The implementation passes **141 tests across 11 files**, strict TypeScript checking and an optimized production build with all 13 product routes prerendered. Tests cover original/copy checksums, catalogue mapping, colour-specific galleries/thumbnails, search/sorting, the 1–10 tee pricing table (`₹600 → ₹4,800 subtotal, −₹600 once, ₹4,200 final`), stock caps, persisted recovery, invalid checkout input, the exact WhatsApp order format, final-amount parity between the cart, checkout and message, order references, the add-to-bag notice and the drawer/cart breakdowns.

This round's verification also started the production server and checked every route (`/`, `/shop`, `/cart`, `/checkout`, `/shipping`, all product pages) for HTTP 200 and for the ₹600 / ₹1,200 / stock-label / free-shipping markup. The cart drawer, add-to-bag notice, cart page and shared breakdown were rendered and asserted with seeded cart states (1, 4 and 8 tees, empty bag, mobile-width panel classes). No headless browser was available in this environment, so the pixel-level mobile layout and real WhatsApp send should still be spot-checked once in a phone browser; earlier 375/320 px checks were made against the previous build.

For release, repeat these browser journeys with the owner's real configuration:

1. Homepage → product → required size → Add to bag → cart.
2. Homepage → product → Buy Now → direct checkout; verify the old bag remains intact.
3. Increase/decrease quantities and remove a variant.
4. Refresh the cart and verify every variant and quantity persists.
5. Submit empty/invalid checkout data and verify focused field errors.
6. Submit valid data with the configured owner number; verify the WhatsApp message's `FINAL AMOUNT PAYABLE` matches the checkout summary exactly for 1, 3, 4, 5 and 8 tees.
7. Test popup-blocked reopen and copy-message fallbacks.
8. Open/close mobile navigation and every mobile menu link.
9. Visit an empty bag and an unknown product URL.
10. Verify sold-out products cannot be added and quantities stop at the configured stock.
11. On the two-colour polo, switch the gallery and colour selector in both directions; check the matching bag/checkout photo.
12. Verify all root originals with `sha256sum -c docs/original-image-checksums.sha256`.

Run `npm test && npm run typecheck && npm run build` before every deployment.
