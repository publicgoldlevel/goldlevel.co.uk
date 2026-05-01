/*
  Moment & Matter — Shopify wiring config
  ------------------------------------------------------------
  This file is safe to edit.

  Current working mode:
  - Direct product links work immediately after your Shopify CSV import, as long as the products are active and available on your Shopify storefront/sales channel.
  - Embedded Buy Buttons become active after you paste your Storefront access token and each Shopify product ID from the Buy Button channel.

  Do not paste Shopify admin passwords, PayPal credentials, or private payment details here.
*/
window.MOMENT_MATTER_SHOPIFY = {
  domain: 'xxitjd-tg.myshopify.com',

  // Optional but recommended for embedded Buy Buttons.
  // Get this from Shopify Admin → Buy Button channel → generated embed code.
  storefrontAccessToken: 'e3e2f940194130ef37ea4628e14749ed',

  // Fallback product links use the handles below.
  // For embedded Buy Buttons, paste each product ID into shopifyProductId.
  products: {
  "custom-moment-card-digital": {
    "handle": "custom-moment-card-digital",
    "shopifyProductId": "",
    "buttonLabel": "Order digital card",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/custom-moment-card-digital"
  },
  "custom-moment-card-physical": {
    "handle": "custom-moment-card-physical",
    "shopifyProductId": "",
    "buttonLabel": "Order printed card",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/custom-moment-card-physical"
  },
  "custom-moment-map-digital": {
    "handle": "custom-moment-map-digital",
    "shopifyProductId": "",
    "buttonLabel": "Order digital map",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/custom-moment-map-digital"
  },
  "custom-moment-map-physical": {
    "handle": "custom-moment-map-physical",
    "shopifyProductId": "",
    "buttonLabel": "Order printed map",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/custom-moment-map-physical"
  },
  "clarity-map-digital": {
    "handle": "clarity-map-digital",
    "shopifyProductId": "",
    "buttonLabel": "Order digital clarity map",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/clarity-map-digital"
  },
  "clarity-map-print": {
    "handle": "clarity-map-print",
    "shopifyProductId": "15477568274809",
    "buttonLabel": "Add to cart",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/clarity-map-print"
  },
  "digital-card-pack": {
    "handle": "digital-card-pack",
    "shopifyProductId": "",
    "buttonLabel": "Add pack",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/digital-card-pack"
  },
  "physical-card-set": {
    "handle": "physical-card-set",
    "shopifyProductId": "",
    "buttonLabel": "Add set",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/physical-card-set"
  },
  "digital-gift-print": {
    "handle": "digital-gift-print",
    "shopifyProductId": "",
    "buttonLabel": "Add digital print",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/digital-gift-print"
  },
  "physical-gift-print": {
    "handle": "physical-gift-print",
    "shopifyProductId": "",
    "buttonLabel": "Add print",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/physical-gift-print"
  },
  "digital-boxed-set": {
    "handle": "digital-boxed-set",
    "shopifyProductId": "",
    "buttonLabel": "Add digital set",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/digital-boxed-set"
  },
  "physical-boxed-set": {
    "handle": "physical-boxed-set",
    "shopifyProductId": "",
    "buttonLabel": "Add boxed set",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/physical-boxed-set"
  },
  "space-digital-curation": {
    "handle": "space-digital-curation",
    "shopifyProductId": "",
    "buttonLabel": "Enquire / order via Shopify",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/space-digital-curation"
  },
  "space-physical-set": {
    "handle": "space-physical-set",
    "shopifyProductId": "",
    "buttonLabel": "Enquire / order via Shopify",
    "shopifyUrl": "https://xxitjd-tg.myshopify.com/products/space-physical-set"
  }
}
};
