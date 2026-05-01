# Moment & Matter — Shopify Checkout HTML Patch

Upload/replace the files in this patch inside your existing `moment_matter_website` folder.

## What this patch does

- Replaces the internal order-request buttons with Shopify checkout buttons/links.
- Adds `assets/js/shopify-config.js` for your Shopify domain and Buy Button credentials.
- Adds `assets/js/shopify-buy-buttons.js` to render embedded Buy Buttons when configured.
- Falls back to direct Shopify product links using the handles created by the Shopify CSV import.
- Updates cart/checkout pages so they direct buyers through Shopify.
- Keeps the existing visual design, product data, product images, and static site structure.

## Immediate working mode

After importing the Shopify CSV, each product should have a Shopify handle matching the website product ID, for example:

`clarity-map-print` → `https://xxitjd-tg.myshopify.com/products/clarity-map-print`

The buttons will link directly to those Shopify product pages unless embedded Buy Button IDs are added.

## Embedded Buy Button mode

Open:

`assets/js/shopify-config.js`

Paste:

1. `storefrontAccessToken` from Shopify Buy Button embed code.
2. Each product's `shopifyProductId` from the Buy Button embed code.

Do not paste Shopify admin passwords, PayPal credentials, or private payment details.

## Shopify checklist

- Products imported from CSV.
- Products set to Active.
- Products available on Online Store and/or Buy Button sales channel.
- Digital products set to no shipping required.
- Physical products set to require shipping.
- Shipping profiles configured in Shopify.
- PayPal Express enabled in Shopify payments.
