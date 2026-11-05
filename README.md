# MEMORY MAKERS

**WEAR YOUR MEMORIES.** A premium, responsive streetwear storefront built with Next.js, TypeScript and Tailwind CSS. It runs without a database, authentication, paid APIs or a payment gateway. Customers prepare an itemised order request and choose to send it themselves in WhatsApp.

> **Launch status:** the real-photo migration is implemented and production-buildable. The catalogue has 13 garment designs from 14 supplied photos; the fifteenth image is the supplied logo. Official names, prices, specifications, sizes and stock still need owner confirmation. The WhatsApp number remains intentionally unconfigured. Complete the owner checklist below before accepting real requests.

See **[the complete photo-by-photo migration report](docs/PRODUCT_MIGRATION.md)** and **[original-image checksums](docs/original-image-checksums.sha256)**.

## What is built

- Existing editorial homepage and Next.js architecture retained, now using the supplied product photographs and logo.
- Responsive sticky navigation, animated mobile menu and live bag count.
- Thirteen photo-backed designs across Graphic Tees, Graphic Polos and Stand-Collar Tees; all supplied originals preserved unchanged.
- Artwork/style/colour search, real category filters, a confirmed-availability filter and price/name sorting. Unconfirmed prices always sort last.
- Statically generated product pages with SEO metadata, galleries, mandatory size requests, synchronized gallery/colour selectors, quantity controls, availability protection, visible-feature details and related pieces.
- Persistent LocalStorage bag with variant-aware line items (`product + size + colour`), colour-specific thumbnails, quantity controls, removal, pending-aware totals and empty/loading states.
- Independent Buy Now checkout storage that never replaces or silently clears the main bag.
- Checkout validation for required fields, Indian mobile numbers and six-digit Indian PIN codes.
- Unique client-side `MM-XXXXXX` order references and readable, URL-encoded WhatsApp messages.
- Official `https://wa.me/` handoff supporting the mobile app and WhatsApp Web.
- Honest handoff page: reopen WhatsApp, review/copy the message, and explicit reminders that the customer must press **Send** and the team must confirm the order.
- No payment collection, fake confirmation, reviews, trust badges, stock claims or newsletter backend.
- Responsive images, local fonts, reduced-motion support, semantic controls, metadata, Open Graph, sitemap, robots rules, loading/error/not-found pages.
- 86 unit/rendering tests for original-asset preservation, catalogue integrity, filtering, variants, prices, cart recovery, validation, order drafts, references and WhatsApp formatting.

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

Open **`src/config/store.ts`** and replace only this placeholder:

```ts
whatsappNumber: "91XXXXXXXXXX",
```

Use the real number in international format with **digits only**: country code followed by the number, without `+`, spaces or dashes. For an Indian number, use `91` followed by the real 10-digit WhatsApp Business mobile number. Do not use the illustrative number from tests.

Until this is replaced, checkout explains that setup is required and refuses to open/send a message. This is deliberate: the project never invents the owner's contact information.

### 2. Complete the real-photo catalogue

Edit **`src/data/products.ts`**. The real-photo records and galleries are already integrated; do not replace them with fictional inventory.

- **Names:** `Sample NN — …` is an editable visual description, not an official business name. Replace it with a verified product name when available. The portrait in photo 11 has intentionally generic wording until its character identity is confirmed.
- **Prices:** `price: null` means **Price to confirm**, not free. Enter a numeric INR price only when verified. The cart, checkout, saved order and WhatsApp message support pending prices; a mixed priced/unpriced bag never presents a partial sum as its full total.
- **Availability:** `inStock: null` means unverified and allows a request, `true` means owner-confirmed availability, and `false` disables Add to bag/Buy Now. This remains a manual catalogue, not a live inventory system.
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
    cart/                     # persistent bag UI
    checkout/                 # form, handoff and field components
    ui/                       # motion reveal, quantity and real-catalogue notice
  context/CartContext.tsx      # bag + separate Buy Now state
  data/products.ts             # PHOTO-BACKED INVENTORY / EDITABLE BUSINESS DETAILS
  config/store.ts              # OWNER CONTACT / WHATSAPP CONFIG
  lib/
    cart.ts                   # trusted catalogue recovery + reducer
    order.ts                  # browser-local handoff drafts, including pending totals
    products.ts               # request-size labels, colour images and catalogue filters
    utils.ts                  # pending-aware INR, totals and quantity helpers
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
- Pending prices stay `null` through the whole request flow. A numerical total appears only when all selected items have verified catalogue prices. Requested sizes and pictured colours are not a stock reservation.
- Submitting checkout creates a browser-local handoff draft and asks the browser to open WhatsApp with a prepared message. If a popup is blocked, the handoff page provides reopen and copy controls.
- Opening WhatsApp is **not** presented as a successful order. The customer must press Send, and the owner must confirm availability, final charges and acceptance.
- The main bag is intentionally retained after handoff. The customer can explicitly clear it from the handoff page. Buy Now never clears pre-existing bag contents.
- Order drafts are not secure server-side order records. Clearing browser storage removes them. Do not treat order references as authenticated or unique across every device.

## Verification

The real-photo migration passes **86 tests across 8 files**, strict TypeScript checking and an optimized production build with all 13 product routes prerendered. Tests cover original/copy checksums, catalogue mapping, colour-specific galleries/thumbnails, search/sorting, pending and numeric totals, variants, persisted recovery, invalid checkout input, WhatsApp content/encoding, order references and placeholder protection.

An automated Chromium check against the production build also passed **12 scenario groups**, including desktop and 375/320 px mobile layouts, cart refresh/variants, Buy Now isolation, validation, handoff recovery/copying and mobile navigation. All 15 direct public asset URLs and all 15 Next.js optimized image URLs returned HTTP 200; there were no uncaught JavaScript or asset-load errors. This is local production verification, not a claim of deployment to Vercel or a real WhatsApp send. See the migration report for details.

For release, repeat these browser journeys with the owner's real configuration:

1. Homepage → product → required size → Add to bag → cart.
2. Homepage → product → Buy Now → direct checkout; verify the old bag remains intact.
3. Increase/decrease quantities and remove a variant.
4. Refresh the cart and verify every variant and quantity persists.
5. Submit empty/invalid checkout data and verify focused field errors.
6. Submit valid data with the configured owner number; verify the WhatsApp message. Pending prices must remain unconfirmed, never ₹0 or a partial order total. Fully priced items must still calculate correctly.
7. Test popup-blocked reopen and copy-message fallbacks.
8. Open/close mobile navigation and every mobile menu link.
9. Visit an empty bag and an unknown product URL.
10. Verify owner-marked unavailable product controls cannot be submitted, and unknown availability is never shown as confirmed stock.
11. On the two-colour polo, switch the gallery and colour selector in both directions; check the matching bag/checkout photo.
12. Verify all root originals with `sha256sum -c docs/original-image-checksums.sha256`.

Run `npm test && npm run typecheck && npm run build` before every deployment.
