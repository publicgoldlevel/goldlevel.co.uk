# CANON_HEADER v1.0.0
# NAME=GOLDLEVEL_LIVE_PUBLICATION_SYNC_RECEIPT
# TITLE=Live Publication Sync Receipt
# STATUS=LOCAL_RECEIPT
# REPO_FULL_NAME=publicgoldlevel/goldlevel.co.uk
# BRANCH=main
# DATE=20260512T185408+0100

## 1. Purpose

Mirror the patched root website selector into the docs publication path so the live publication route can serve the updated website flow.

## 2. Files touched

- docs/index.html
- docs/assets/css/selector.css
- docs/CNAME

## 3. Verification passes

- Publication Architecture marker present
- Capsule vertical separator marker present
- Flow CSS marker present
- Custom domain present
- git diff --check passed
