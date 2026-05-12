# CANON_HEADER v1.0.0
# NAME=GOLDLEVEL_SRC_EDITORIAL_FRONTDOOR_CLEANUP_RECEIPT
# TITLE=SRC-Governed Front-Door Cleanup Receipt
# VERSION=0.1.0
# STATUS=LOCAL_RECEIPT
# REPO_FULL_NAME=publicgoldlevel/goldlevel.co.uk
# BRANCH=site/src-editorial-frontdoor-cleanup-v0-1-0
# DATE=20260512T193157+0100
# ENCODING=UTF-8

## 1. Purpose

Use SRC authorship/editorial doctrine to reduce public front-door sprawl, preserve the two-primary-route selector, correct secondary/footer link contrast, and keep diagnostic/archive complexity subordinate.

## 2. Files touched

- index.html
- docs/index.html
- assets/css/selector.css
- docs/assets/css/selector.css

## 3. Editorial rule applied

- Public vessels must be finite.
- Reader entry is protected before source architecture is exposed.
- GOLDLEVEL and Moment & Matter remain the two primary front-door routes.
- Offer Clarity, Constraint Map, and Archive become secondary utility links.

## 4. Verification targets

- Root selector marker present: GOLDLEVEL_SRC_EDITORIAL_UTILITY_START v0.1.0
- Docs selector marker present: GOLDLEVEL_SRC_EDITORIAL_UTILITY_START v0.1.0
- CSS marker present: GOLDLEVEL_SRC_EDITORIAL_CLEANUP_START v0.1.0
- Prior route/publication sprawl markers absent from root/docs selector pages.
- git diff --check passed before commit.
