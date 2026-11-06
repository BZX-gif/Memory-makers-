# GROWTH PLAYBOOK — owner actions after this update

The codebase now ships a complete SEO + trust foundation. This document lists,
in priority order, what only the **business owner** can finish, and exactly
where each change goes. Nothing here requires a developer.

---

## 0. Before anything else (10 minutes, biggest single win)

1. **Set the canonical domain.** In Vercel → Project → Environment Variables add
   `NEXT_PUBLIC_SITE_URL=https://your-final-domain.com` (no trailing slash).
   Every canonical tag, sitemap entry, Open Graph URL and JSON-LD `@id` reads
   this value (`src/config/store.ts`). Until then, local builds advertise
   `localhost` and Vercel builds advertise the Vercel URL.
2. **Submit the sitemap.** In Google Search Console and Bing Webmaster Tools:
   add the property (domain or URL-prefix), verify by DNS or file, then submit
   `https://your-final-domain.com/sitemap.xml` (29 URLs). Also paste the
   `robots.txt` URL so crawlers pick up the rules immediately.
3. **Check the rich-result eligibility.** In Search Console → Enhancements /
   Rich Results Test, paste one product URL. The `Product` + `Offer` +
   `BreadcrumbList` markup should validate with price `600 INR` and the honest
   availability state.

## 1. Replace the placeholder product names (30 minutes, high win)

`src/data/products.ts` still carries `Sample NN — …` editing labels. Customers
never see the prefix (it is stripped everywhere by `getDisplayTitle`), but the
descriptive part *is* the customer-facing name, title tag and snippet.

- Edit each `name` to the official product name, e.g. `"Sukuna Cursed Energy Tee"`.
- Keep `id` and `slug` untouched so saved bags, links and the sitemap stay stable.
- The moment a name no longer starts with `Sample`, the small "official name to
  be confirmed" note on the product page disappears automatically.

## 2. Confirm the unverified specifications (1 hour, trust win)

Each product's `details` array ends with
`Material, fit and measurements: awaiting owner confirmation`. Replace that line
with the verified fabric (e.g. "180 GSM combed cotton"), fit ("regular, true to
size") and any measured chest/length table. When real sizes exist, fill
`availableSizes` (e.g. `["S","M","L","XL"]`) — the size buttons then become
confirmed options instead of labelled requests, and `/size-guide` can grow a
real chart.

## 3. Publish the policies you can honour (1 hour, trust + legal win)

- **Returns/exchanges:** once the business decides, add the real policy to
  `/shipping` (or a new `/returns` page) and mirror it in `faqs` in
  `src/data/faq.ts`. Until then the FAQ honestly says no policy is published —
  do not replace that with borrowed wording.
- **Privacy:** `src/app/privacy/page.tsx` already describes the real behaviour
  (browser-only storage, no analytics, WhatsApp handoff). Re-read it whenever a
  new third-party service (analytics, pixel, email tool) is added, and update
  the page in the same commit.
- **Contact:** add a verified business email to `storeConfig.contact.email`;
  the footer, contact page and Organization schema pick it up automatically.

## 4. Verify the social + messaging surfaces (30 minutes)

- Replace/confirm `storeConfig.social.instagram` with the real profile, and keep
  the handle identical to the one printed on packaging for consistency.
- Convert the number in `storeConfig.whatsappNumber` to a **WhatsApp Business**
  account: verified badge, catalogue, away message and labelled chats all raise
  conversion on the handoff step, and the Business profile shows inside the chat
  window your customers land in.
- The footer's "Drop alerts on WhatsApp" CTA prefills a notification request —
  save those contacts in a WhatsApp Broadcast list (not a group) for launch
  announcements without exposing customer numbers.

## 5. Real social proof, the honest way (ongoing)

The site deliberately ships **zero** fabricated reviews or ratings, and the
structured data must stay that way (synthesised `aggregateRating` violates
Google's spam policies and destroys trust when discovered).

- After each confirmed order, ask the customer for a photo + one line. With
  their permission, add it as a new `testimonials` array and render it on the
  product page with name/city; only then extend `productSchema()` with
  `review` entries carrying the same text.
- Repost customer photos to Instagram and link the post from the product page —
  an external, verifiable signal beats any badge.

## 6. Content cadence (2 hours/month, compounding win)

`/journal` exists with three evergreen guides and full `Article` markup.

- Add one guide per month in `src/data/journal.ts` (styling, care, silhouettes,
  gifting, festival looks). Keep the editorial voice and link each post to the
  collection it mentions.
- Update `modified` + `sitemap` picks it up automatically; announce each post in
  the WhatsApp broadcast list and the Instagram story.

## 7. Measure (15 minutes/week)

- Search Console: queries, clicks, and the "Product" enhancement health.
- WhatsApp Business: label funnel counts (`request sent` → `confirmed` →
  `paid`) — this is your real conversion rate; the site has no analytics by
  design, and adding a pixel later must update `/privacy` the same day.
- PageSpeed Insights on the production URL after each launch: the build is
  static, fonts are subsetted and images are AVIF/WebP; regressions will come
  from newly added assets, not from code.

---

### Quick reference — where each lever lives

| Lever | File |
| --- | --- |
| Domain / canonical / sitemap host | `NEXT_PUBLIC_SITE_URL` → `src/config/store.ts` |
| Prices, bundle, shipping | `src/lib/pricing.ts` |
| Names, stock, sizes, colours | `src/data/products.ts` |
| Collection copy | `src/data/collections.ts` |
| FAQ copy + `FAQPage` schema | `src/data/faq.ts` |
| Journal posts + `Article` schema | `src/data/journal.ts` |
| Structured data builders | `src/lib/seo.ts` |
| Icons / OG cards | `scripts/generate-brand-assets.sh` |
| WhatsApp number / socials / credit | `src/config/store.ts` |
