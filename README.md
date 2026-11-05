# MEMORY MAKERS

**WEAR YOUR MEMORIES.** A premium, responsive streetwear storefront built with Next.js, TypeScript and Tailwind CSS. It runs without a database, authentication, paid APIs or a payment gateway. Customers prepare an itemised order request and choose to send it themselves in WhatsApp.

> **Launch status:** the application is production-buildable, but the products are demonstration inventory and the WhatsApp number is intentionally unconfigured. Complete the owner checklist below before accepting real requests.

## What is built

- Editorial, art-directed homepage with original local campaign and studio imagery.
- Responsive sticky navigation, animated mobile menu and live bag count.
- Eight demo products across Graphic, Typography, Art and Minimal collections.
- Product search, category filters, availability filter and price/name sorting.
- statically generated product pages with SEO metadata, galleries, mandatory size selection, colour and quantity selectors, availability protection, product details and related pieces.
- Persistent LocalStorage bag with variant-aware line items (`product + size + colour`), quantity controls, removal, subtotal and empty/loading states.
- Independent Buy Now checkout storage that never replaces or silently clears the main bag.
- Checkout validation for required fields, Indian mobile numbers and six-digit Indian PIN codes.
- Unique client-side `MM-XXXXXX` order references and readable, URL-encoded WhatsApp messages.
- Official `https://wa.me/` handoff supporting the mobile app and WhatsApp Web.
- Honest handoff page: reopen WhatsApp, review/copy the message, and explicit reminders that the customer must press **Send** and the team must confirm the order.
- No payment collection, fake confirmation, reviews, trust badges, stock claims or newsletter backend.
- Responsive images, local fonts, reduced-motion support, semantic controls, metadata, Open Graph, sitemap, robots rules, loading/error/not-found pages.
- Unit tests for cart recovery and variants, validation, order references and WhatsApp formatting.

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

### 2. Replace demonstration inventory

Edit **`src/data/products.ts`**. Replace all sample product names, descriptions, prices, specifications, colours, sizes and `inStock` flags with verified business information. Put replacement images in `public/images/products/` and update each `images` array.

`inStock` only controls whether a sample item can be requested in this catalogue. It is not a live inventory system; final availability is confirmed on WhatsApp.

### 3. Contact and social details

In **`src/config/store.ts`**:

- Replace the generic Instagram platform URL with the brand's real profile URL.
- Optionally add a verified public business email.
- Review the shipping information. Add verified shipping charges/timelines only when the owner supplies them; do not invent promises.

### 4. Verified product and business policies

Before launch, replace the demonstration garment specifications with verified fit/material details and add any real return, exchange, privacy or terms policies required by the business. No such claims have been fabricated in this version.

### 5. Production URL

Set `NEXT_PUBLIC_SITE_URL` to the final canonical URL in Vercel (or in `.env.local`) so sitemap and metadata URLs are correct:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

No other environment variables are needed.

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
    campaign-hero.jpg
    studio-story.jpg
    products/                 # original generated demo product visuals
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
    ui/                       # motion reveal, quantity and demo notice
  context/CartContext.tsx      # bag + separate Buy Now state
  data/products.ts             # EDITABLE DEMO INVENTORY
  config/store.ts              # OWNER CONTACT / WHATSAPP CONFIG
  lib/
    cart.ts                   # trusted catalogue recovery + reducer
    order.ts                  # browser-local handoff drafts
    utils.ts                  # INR, totals and quantity helpers
    validation.ts             # customer and Indian format validation
    whatsapp.ts               # reference, message and wa.me URL
    *.test.ts                 # unit tests
  types/index.ts
```

## Order and privacy behavior

- No order is sent to a backend and no payment is requested.
- The bag and Buy Now selection are stored only in the customer's browser. Catalogue data is revalidated when storage is read; stale prices and malformed/unavailable items are not trusted.
- Submitting checkout creates a browser-local handoff draft and asks the browser to open WhatsApp with a prepared message. If a popup is blocked, the handoff page provides reopen and copy controls.
- Opening WhatsApp is **not** presented as a successful order. The customer must press Send, and the owner must confirm availability, final charges and acceptance.
- The main bag is intentionally retained after handoff. The customer can explicitly clear it from the handoff page. Buy Now never clears pre-existing bag contents.
- Order drafts are not secure server-side order records. Clearing browser storage removes them. Do not treat order references as authenticated or unique across every device.

## Verification

The key logic tests cover variant separation, quantity changes, persisted-cart recovery, unavailable items, stale/tampered data, valid and invalid checkout details, WhatsApp content/encoding, reference format and placeholder protection.

An additional axe accessibility audit reports **zero WCAG 2/2.1 A and AA violation types** on the homepage, shop, available and unavailable product pages, populated cart, populated checkout, shipping page and open mobile navigation. Secondary-text contrast and accessible link names were explicitly verified.

For release, repeat these browser journeys with the owner's real configuration:

1. Homepage → product → required size → Add to bag → cart.
2. Homepage → product → Buy Now → direct checkout; verify the old bag remains intact.
3. Increase/decrease quantities and remove a variant.
4. Refresh the cart and verify every variant and quantity persists.
5. Submit empty/invalid checkout data and verify focused field errors.
6. Submit valid data and verify the WhatsApp message, item totals and grand total.
7. Test popup-blocked reopen and copy-message fallbacks.
8. Open/close mobile navigation and every mobile menu link.
9. Visit an empty bag and an unknown product URL.
10. Verify unavailable demo product controls cannot be submitted.

Run `npm test && npm run typecheck && npm run build` before every deployment.
