# GOLDLEVEL Secret Scan Review

UTC: 20260501T201715Z

Diagnosis source:
/data/data/com.termux/files/home/storage/shared/Download/GL_FULL_GIT_DIAG_goldlevel.co.uk__20260501T201226Z

## Secret scan rows reviewed

```csv
file,line,pattern,redacted_excerpt
_ops/full_git_diagnosis/FINDINGS_CLASSIFICATION_20260501T200539Z.md,32,generic_token_assignment,| `moment-matter/assets/js/shopify-buy-buttons.js` | 5 | `generic_token_assignment` | `const TOKEN=***REDACTED*** \|\| '').trim();` | REVIEW_REQUIRED | Open locally. If real credential: remove + rotate. If placeholder: document false positive. |
moment-matter/assets/js/shopify-buy-buttons.js,5,generic_token_assignment,const TOKEN=***REDACTED*** || '').trim();
```

## Shopify JS inspection

Target:
moment-matter/assets/js/shopify-buy-buttons.js

Observed pattern:
```js
(function () {
  const CFG = window.MOMENT_MATTER_SHOPIFY || {};
  const SHOP_DOMAIN = CFG.domain || 'xxitjd-tg.myshopify.com';
  const PRODUCT_MAP = CFG.products || {};
  const TOKEN = (CFG.storefrontAccessToken || '').trim();
  const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  let uiPromise = null;
```

Classification:
REVIEWED_FALSE_POSITIVE_RUNTIME_VARIABLE

Reason:
The scanner detected a variable named TOKEN / storefrontAccessToken, but local inspection found no standard hardcoded credential pattern such as ghp_, github_pat_, sk-, AKIA, sk_live_, or pk_live_.

## Standard credential grep

Command:
grep -RInE "(ghp_|github_pat_|sk-|AKIA|sk_live_|pk_live_)[A-Za-z0-9_\-]+" .

Result:
No standard real credential pattern detected, unless listed separately in terminal output.

## Evidence boundary

This review classifies static scanner output only. If a real Shopify Storefront token is ever hardcoded into the public repo, it must be removed and rotated.
