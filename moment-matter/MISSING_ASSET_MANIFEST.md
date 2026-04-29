# MISSING_ASSET_MANIFEST

The uploaded thread contained the 20 core website files, but did not include the image/data/Shopify asset folders that the HTML references.

## Not locally verified

- `assets/img/brand-mark.svg`
- `assets/img/product-artifacts/*`
- `assets/img/artwork/*`
- `assets/img/system/project-art-contact-sheet.jpg`
- `assets/data/products.js`
- `assets/js/shopify-config.js`
- `assets/js/shopify-buy-buttons.js`

## Mirrored during this run

To make the revised archive match the HTML paths for the uploaded CSS/JS:

- `site.css` was copied to `assets/css/site.css`
- `site.js` was copied to `assets/js/site.js`

Do not treat missing external assets as failed if they exist in the deployment repository but were not uploaded to this thread.
