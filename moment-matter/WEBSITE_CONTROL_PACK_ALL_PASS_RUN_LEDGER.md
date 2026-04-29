# WEBSITE_CONTROL_PACK_ALL_PASS_RUN_LEDGER

## Execution receipt

- RUN_ID: MM-WCP-20260429-ALLPASS-01
- Source files checked: 20
- HTML files checked: 18
- CSS files checked: 1
- JS files checked: 1
- Output archive: `moment_matter_all_pass_revised.zip`
- Proof boundary: local file parsing and static link checks only. Browser rendering, image existence, product-data behavior, and Shopify behavior require deployment/local browser receipts.

## PASS 1 — Website Existence Map

All 20 uploaded files were included in the run.

| File | Title | H1 / dynamic title | Route role | Link count |
|---|---|---|---|---|
| `about.html` | About Moment & Matter | Art, words, and visual structure for moments that matter. | About/positioning route | 31 |
| `archive.html` | Artwork archive / Moment & Matter | Project artwork prepared for the site archive. | Project artwork archive | 31 |
| `cart.html` | Checkout directory / Moment & Matter | Choose a product, then checkout through Shopify. | Checkout directory / Shopify route | 33 |
| `checkout.html` | Secure Shopify checkout / Moment & Matter | Pay securely through Shopify. | Checkout directory / Shopify route | 33 |
| `clarity-maps.html` | Clarity maps for decisions and pivots / Moment & Matter | For decisions, relationship patterns, creative pivots, and business direction. | Decision/pattern mapping offer page | 41 |
| `contact.html` | Contact / Moment & Matter | Start with the clearest version of the moment. | Contact/brief routing | 33 |
| `custom.html` | Create a custom visual piece / Moment & Matter | Send the moment. Receive a piece that makes it clearer. | Custom work brief and format choice | 36 |
| `faq.html` | FAQ / Moment & Matter | Questions before ordering. | Pre-order support | 31 |
| `gift-guide.html` | Gift guide / Moment & Matter | Find the right piece for the moment. | Occasion-based buying guide | 37 |
| `image-path-test.html` | Moment & Matter image path test | Image path test | Internal asset path test | 1 |
| `index.html` | Custom visual pieces for moments that are hard to explain / Moment & Matter | Custom visual pieces for moments that are hard to explain. | Homepage / orientation / primary offer gateway | 39 |
| `privacy.html` | Privacy / Moment & Matter | Privacy basics. | Privacy | 31 |
| `product.html` | Product / Moment & Matter | Dynamic / JS-rendered | Dynamic product detail route | 31 |
| `shipping.html` | Digital and physical delivery / Moment & Matter | Digital delivery. Physical shipping where configured. | Delivery and format policy | 31 |
| `shop.html` | Shop digital and physical pieces / Moment & Matter | Digital and physical pieces for meaningful moments. | Product catalogue grid | 31 |
| `spaces.html` | Art for professional spaces / Moment & Matter | Calm visual pieces for rooms where people think, talk, wait, work, or reset. | Professional spaces route | 33 |
| `terms.html` | Terms / Moment & Matter | Terms of use and order basics. | Terms | 31 |
| `thank-you.html` | Order request ready / Moment & Matter | Request is ready. | Generated order-request route | 33 |


Internal HTML link check: PASS.
Broken internal HTML links: []

## PASS 2 — Public Positioning Compression

Public-safe positioning:
> Custom visual pieces, cards, prints, and clarity maps for meaningful moments that need clearer words, structure, or a lasting visual artifact.

Homepage hero line retained:
> Custom visual pieces for moments that are hard to explain.

Offer line:
> Send the moment; receive a custom piece, card, print, Moment Map, or Clarity Map that is clear enough to keep, gift, print, frame, or use as a next-step reference.

Primary CTA:
> Create a custom piece.

Secondary CTAs:
> Shop formats. View Clarity Maps.

## PASS 3 — Route-by-Route Blueprint

- Homepage: orient, explain offer family, route to custom/shop/clarity.
- Custom: convert meaningful-moment requests into a clean brief.
- Clarity Maps: sell the deeper decision/pattern map while maintaining advice boundaries.
- Shop/Product: show products dynamically from `products.js`; needs product-data receipt.
- Cart/Checkout: route buyer to Shopify; local cart language reduced.
- Shipping/Terms/Privacy/FAQ: support trust and reduce misinterpretation.
- Archive/Spaces/Gift Guide: secondary discovery and expansion routes.
- Image Path Test: internal deployment support route.

## PASS 4 — Component Extraction

Observed/reused static components:
- `topbar`
- `desktop-nav`
- `mobile-panel`
- `hero`
- `hero-grid`
- `card`
- `product-card`
- `product-grid`
- `section-head`
- `footer`
- `copy-box`
- `notice-card` added
- `compact-boundary` added
- `fit-boundary-card` added

## PASS 5 — Claim-Safety Audit

Claims downgraded:
- “wired for Shopify checkout” → “prepared for Shopify checkout”
- “Physical worldwide” → “Physical shipping where configured”
- “worldwide shipping available” → “UK/international shipping where enabled”
- “checkout routes now route to Shopify” → “prepared to route to Shopify checkout”
- “digital delivery worldwide / physical worldwide” clarified as configuration-dependent where relevant.

Advice boundary strengthened:
- Clarity Maps page now includes a service-boundary notice.
- Spaces page now states no clinical, therapeutic, safety, or compliance claims.

## PASS 6 — QA / Proof Pass

Checks performed:
- All 20 uploaded files were loaded from /mnt/data and included in the revised package.
- All 18 HTML files parsed with BeautifulSoup after edits.
- Internal .html href targets were checked against the uploaded HTML manifest.
- Menu button accessibility attributes were added.
- Custom form labels were associated with controls.
- Claim-safety reductions were applied to Shopify and worldwide-shipping language.
- No-script fallbacks were added for dynamic product/archive/order areas.
- CSS focus-visible and reduced-motion support were added.
- site.js menu aria-expanded behavior and Escape close behavior were added.

Known unverified items:
- Image files under assets/img/* were not uploaded, so image existence could not be locally verified.
- assets/data/products.js, assets/js/shopify-config.js, and assets/js/shopify-buy-buttons.js were not uploaded, so product-data and Shopify live behavior could not be locally verified.
- No browser render screenshot was available in this run.

## PASS 7 — Release Package

Version recommendation:
- `v0.2.0` because this is a minor content/UX/governance uplift over the day-one static package.

Changed files:
- All 18 HTML files were parsed and normalized; substantive changes were made to accessibility, claim safety, no-script fallbacks, and selected page copy.
- `site.js` updated for accessible mobile-menu state handling.
- `site.css` updated for focus visibility, reduced motion, and boundary-note styling.
- `assets/css/site.css` and `assets/js/site.js` mirrored into expected deployed paths.

Rollback path:
- Use the original uploaded files in `/mnt/data` as the pre-run baseline.
- Replace the revised package files with the original 20-file manifest if the deployment should revert.

