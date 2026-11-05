# MEMORY MAKERS — Real-product migration report

**Date:** 5 November 2026

**Branch:** `arena/39cc0b81-memory-makers`

**Starting revision:** `cf3fac69019d0a5209080a1e7a5fc1b30f5ea965`

## Summary

- Inspected the existing Next.js App Router application, product data, cart, checkout, order handoff, navigation and tests **before changing them**. The existing architecture is retained, not rebuilt.
- Visually reviewed **all 15 supplied images**: **14 garment images and one logo**.
- Created **13 photo-backed product records** in `src/data/products.ts`, replacing the eight fictional demonstration products.
- Created **13 galleries**: twelve with one photograph and one with two photographed colour variants.
- Copied all 15 original files, without modification, to **`public/images/products/real/`**. No root original was deleted, moved, renamed or overwritten.
- No official product names, fabric compositions, prices, size availability or stock counts were invented.
- No new runtime dependencies, database, paid service, payment gateway or API key was added.

## 1. Photograph-by-photograph visual identification

Every file below was opened and inspected individually. Character names describe visible artwork, not official merchandise names or licensing status. Colour labels describe the images approximately, not manufacturer colour codes.

| Original filename | Visible content | Catalogue assignment |
| --- | --- | --- |
| `photo_1_2026-11-05_14-26-42.jpg` | Yellow crew-neck T-shirt; multicoloured Kakashi character print; supplied image explicitly says Hatake Kakashi. | `mm-real-01` — **Sample 01 — Kakashi graphic tee** |
| `photo_2_2026-11-05_14-26-42.jpg` | Lavender polo with fold-down collar, button placket and red/black/white Tanjiro Kamado artwork. | `mm-real-02` — **Sample 02 — Tanjiro graphic polo** |
| `photo_3_2026-11-05_14-26-42.jpg` | Black crew-neck T-shirt; hat, blue goggles and orange flame character artwork, visually identified as Sabo. | `mm-real-03` — **Sample 03 — Sabo graphic tee** |
| `photo_4_2026-11-05_14-26-42.jpg` | Red crew-neck T-shirt; purple/white character panel with Gojo and Jujutsu Kaisen lettering. | `mm-real-04` — **Sample 04 — Gojo graphic tee** |
| `photo_5_2026-11-05_14-26-42.jpg` | Dark red crew-neck T-shirt; blue/green/black Deku artwork and Japanese lettering. | `mm-real-05` — **Sample 05 — Deku graphic tee** |
| `photo_6_2026-11-05_14-26-42.jpg` | Black crew-neck T-shirt; monochrome masked character and Akatsuki Tobi lettering. | `mm-real-06` — **Sample 06 — Akatsuki Tobi tee** |
| `photo_7_2026-11-05_14-26-42.jpg` | Light blue polo; red Titan print, Japanese lettering and Attack on Titan text. | `mm-real-07` — **Sample 07 — Attack on Titan polo**, light blue gallery image/variant |
| `photo_8_2026-11-05_14-26-42.jpg` | Grey polo showing the same red Titan print and collar style as photo 7. | **Same `mm-real-07` record**, grey gallery image/variant; not a duplicate listing |
| `photo_9_2026-11-05_14-26-42.jpg` | Light grey polo; rectangular Naruto character artwork in orange/red/black/white. | `mm-real-09` — **Sample 09 — Naruto graphic polo** |
| `photo_10_2026-11-05_14-26-42.jpg` | Lavender short-sleeved top with upright collar and buttons; Kanao Tsuyuri sword-and-butterfly artwork and Japanese name lettering. | `mm-real-10` — **Sample 10 — Kanao stand-collar tee** |
| `photo_11_2026-11-05_14-26-42.jpg` | Light grey polo; black/green tied-back-hair portrait and Attack on Titan lettering. The portrait appears to be Eren Yeager, but that specific identification is provisional. | `mm-real-11` — **Sample 11 — Portrait graphic polo**; deliberately generic pending owner confirmation |
| `photo_12_2026-11-05_14-26-43.jpg` | Olive green short-sleeved top with upright collar/buttons; red Akatsuki lettering and monochrome character panels. | `mm-real-12` — **Sample 12 — Akatsuki stand-collar tee** |
| `photo_13_2026-11-05_14-26-43.jpg` | Black crew-neck T-shirt; Monkey D. Luffy artwork, barrels, straw hats and repeated name/One Piece lettering. | `mm-real-13` — **Sample 13 — Luffy graphic tee** |
| `photo_14_2026-11-05_14-26-43.jpg` | Black crew-neck T-shirt; pink/white/black Sukuna character panel and lettering. | `mm-real-14` — **Sample 14 — Sukuna graphic tee**; also used in the homepage hero |
| `Picsart_26-09-26_18-26-44-656.jpg` | Black MM monogram and the word WEARABLE on a white background. This is a logo, not a garment photograph. | Brand-story image via `storeConfig.brandImage`; intentionally **not purchasable inventory** |

**Images that could not be identified:** none were unreadable or left unclassified. Photo 11's garment and print layout are identified; its exact character identity still needs owner confirmation. The logo is intentionally excluded from product galleries rather than being misclassified as a T-shirt.

## 2. Products and galleries created

| Product route | Category | Supplied photographs |
| --- | --- | --- |
| `/product/kakashi-yellow-tee` | Graphic Tees | 1 |
| `/product/tanjiro-lavender-polo` | Graphic Polos | 2 |
| `/product/sabo-black-tee` | Graphic Tees | 3 |
| `/product/gojo-red-tee` | Graphic Tees | 4 |
| `/product/deku-dark-red-tee` | Graphic Tees | 5 |
| `/product/akatsuki-tobi-black-tee` | Graphic Tees | 6 |
| `/product/attack-on-titan-polo` | Graphic Polos | **7 and 8** |
| `/product/naruto-grey-polo` | Graphic Polos | 9 |
| `/product/kanao-lavender-stand-collar-tee` | Stand-Collar Tees | 10 |
| `/product/portrait-light-grey-polo` | Graphic Polos | 11 |
| `/product/akatsuki-olive-stand-collar-tee` | Stand-Collar Tees | 12 |
| `/product/luffy-black-tee` | Graphic Tees | 13 |
| `/product/sukuna-black-tee` | Graphic Tees | 14 |

- **7** crew-neck graphic designs, **4** graphic polo designs and **2** upright-collar designs.
- Photos 7 and 8 are two **colours of the same pictured design**, not different camera angles. Selecting either thumbnail selects its matching colour; choosing a colour switches the photograph. That image follows the variant into the bag, Buy Now checkout and saved order summary.
- The other twelve records each have their one supplied front view. No back, side or extra-angle images were invented or generated.
- Product photos retain their complete 3:4 composition using `object-contain`. The 4096 × 4096 logo retains its square composition. The fourteen garment originals are 960 × 1280.
- Original demo images remain on disk, but are no longer referenced by active storefront code or inventory. Retired fictional product slugs return 404 rather than resolving to unrelated real garments.

## 3. Business information is explicitly unconfirmed

The owner can edit each record directly in **`src/data/products.ts`**:

| Field | Migrated value / meaning | Owner action |
| --- | --- | --- |
| `name` | `Sample NN — …`, an explicitly marked descriptive editing label | Replace with a verified official product name when supplied |
| `description` / `details` | Visible artwork, approximate colour and observable collar/sleeve features only | Confirm exact names, material, fit and measurements |
| `price` | **`null`** = price to confirm, never ₹0 or a fabricated sample amount | Set a verified numeric INR price when available |
| `inStock` | **`null`** = unknown; a request is allowed but stock is not claimed | Set `true` only when confirmed; `false` disables Add to bag and Buy Now |
| `availableSizes` | **`[]`** = no verified size range | Add only owner-confirmed size labels |
| `availableColors` | Only photographed colours, with approximate display swatches and matching image paths | Confirm colour names/availability; do not add unphotographed variants speculatively |

Until actual sizes are supplied, `SAMPLE_SIZE_OPTIONS` in `src/lib/products.ts` provides **S, M, L, XL and XXL as explicitly labelled requested-size options**, not stocked sizes or a size chart. A selection remains mandatory. Requested sizes are marked as requests in the cart, checkout and WhatsApp message.

Promotional claims such as cotton, fit, print durability or limited edition are already embedded in the supplied images. The originals are preserved, but those claims are **not promoted into verified catalogue specifications**. The gallery and product-detail copy explain this distinction.

### Pending-price behavior

- Cards and details show **“Price to confirm.”**
- Line totals and product totals remain **“To confirm.”**
- A mixed bag containing priced and unpriced products does **not** show the priced portion as its full total.
- WhatsApp messages explicitly say product prices are pending and request confirmation of prices, sizes and availability. Shipping remains separate and unconfirmed.
- Saved order drafts accept pending (`null`) totals; fully priced drafts and numeric calculations continue to work.
- Unknown prices sort last in both price-sort directions. The availability filter includes **only `inStock === true`**, never unknown stock.

## 4. Storefront integration and preserved functionality

- **Homepage:** real Sukuna hero, four photo-backed featured designs, three populated collection links and the supplied logo in the brand-story section. Fictional campaign/studio product imagery and descriptions are no longer displayed.
- **Shop:** all 13 designs, updated category filters, combined artwork/style/colour search, honest availability states and pending-aware sorting.
- **Product pages:** real photos, synchronized gallery/colour selection, required size requests, quantity controls, Add to bag, Buy Now, visible-feature descriptions and real related products.
- **Cart:** existing `memory-makers:cart:v1` storage key, variant-aware keys, persistence, quantity limits, removal, clearing and selected-colour thumbnails preserved.
- **Buy Now:** separate `memory-makers:buy-now:v1` storage retained; it does not replace or clear the main bag.
- **Recovery:** stored prices, names, images and swatches are rebuilt from trusted catalogue data. Real IDs use `mm-real-*`, so retired demo IDs are discarded safely instead of becoming unrelated real items.
- **Checkout:** existing Indian mobile/PIN validation, required fields, focused errors, no-payment approach and WhatsApp setup protection preserved.
- **WhatsApp/order handoff:** existing reference format, official encoded `wa.me` URL, browser-local drafts, reopen/copy behavior and explicit customer-send/owner-confirm steps preserved. No real message was sent during testing.
- **Navigation/SEO:** mobile navigation and anchor links preserved; footer categories, metadata, Open Graph images and sitemap now follow the real catalogue. Vercel hostname metadata fallback is supported without hardcoding a domain.
- **Images:** case-correct, root-relative `/images/products/real/...` paths served through the existing `next/image` pipeline. No remote image host or paid media service is required.

## 5. Verification results

The baseline, before migration, passed all three requested commands with **17 tests**. After migration:

| Check | Result |
| --- | --- |
| `npm test` | **PASS — 86 tests across 8 test files** |
| `npm run typecheck` | **PASS — no TypeScript errors** |
| `npm run build` | **PASS — production build; all 13 product routes prerendered** |
| `git diff --check` | **PASS — no whitespace errors** |
| Original checksum verification | **PASS — all 15 root originals match the recorded hashes** |
| Public copies | **PASS — all 15 are byte-identical to their originals** |
| Production product URLs | **13/13 returned HTTP 200** |
| Direct public asset URLs | **15/15 returned HTTP 200** |
| Next.js optimized image URLs | **15/15 returned HTTP 200** |
| Retired/unknown product URLs | **HTTP 404 as expected** |

The tests cover asset mapping/preservation, categories, related products, gallery markup, colour-specific thumbnails, pending/confirmed prices, mixed totals, variant separation, quantities, stale/tampered cart recovery, Buy Now isolation, validation, WhatsApp message formatting/encoding, order references and nullable order-draft recovery.

### Production-browser checks

**12 automated Chromium scenario groups passed**, with no uncaught browser JavaScript errors or image-load failures:

1. Homepage hero, four featured products, three collections and supplied logo.
2. Full catalogue, combined search, each category, confirmed-availability filter and price/name sorting.
3. Gallery/colour synchronization and mandatory size selection.
4. Correct bag thumbnail, pending totals, quantity changes and refresh persistence.
5. Separate size/colour variants and merging identical variants.
6. Independent Buy Now selection, checkout navigation and refresh without changing the bag.
7. Empty/invalid checkout fields, Indian mobile/PIN errors, focused field and safe unconfigured WhatsApp behavior.
8. Pending-price order-draft recovery, copy-message control and finishing Buy Now without clearing the bag.
9. Mobile menu, Escape dismissal, collection anchor and restored body scrolling.
10. Mobile gallery, cart and checkout at **375 px and 320 px**, with no horizontal overflow.
11. Item removal, empty states and recovery of a bag containing a retired demo entry.
12. Every product route, original public asset and optimized image endpoint, plus expected missing-product responses.

Desktop checks used a 1440 px viewport. Browser checks were run against the local **production build**, not merely the development server. The handoff-recovery check used a browser-local test draft; it did not submit a real order. Live WhatsApp delivery cannot be tested without the owner's real number. Image URL checks establish local production/Next.js compatibility; this migration did **not** deploy to Vercel.

## 6. Remaining owner inputs — not fabricated

1. Official names, prices, fabric/fit/measurement details, stocked sizes and availability for each design.
2. Confirmation of the portrait identity in photo 11, and any preferred character/product wording.
3. A real WhatsApp Business number in `src/config/store.ts`. The existing `91XXXXXXXXXX` placeholder is deliberately unchanged; outgoing checkout remains blocked until configured.
4. The real social profile, production canonical URL and any verified business policies.

## Integrity record

`docs/original-image-checksums.sha256` records the root originals before copying. From the repository root:

```bash
sha256sum -c docs/original-image-checksums.sha256
npm test
npm run typecheck
npm run build
```

The catalogue integrity test also compares every public copy with its original. No generated screenshots, browser binaries, dependency caches or build outputs were added to Git.
