# CANON_HEADER v1.0.0
# NAME=GOLDLEVEL_WEBSITE_FLOW_PATCH_RECEIPT
# TITLE=Website Flow Patch Receipt
# VERSION=0.1.1
# STATUS=LOCAL_RECEIPT
# REPO_FULL_NAME=publicgoldlevel/goldlevel.co.uk
# BASE_BRANCH=main
# PATCH_BRANCH=site/flow-fluidity-publication-architecture-v0-1-1
# DATE=20260512T183958+0100
# ENCODING=UTF-8

## 1. Files touched

- index.html
- assets/css/selector.css

## 2. Installed changes

1. CSS preload marker for selector.css.
2. Publication Architecture section on the root selector page.
3. Vertical title/descriptor separators inside publication capsules.
4. Vertical title/descriptor separator styling for existing route selector capsules.
5. CSS containment/content-visibility safeguards for smoother static-page traversal.
6. Reduced-motion guardrail.
7. No external dependencies added.
8. No CSP weakening performed.

## 3. Verification passes

- Repo origin checked: publicgoldlevel/goldlevel.co.uk
- Base branch checked: main
- Patch branch used: site/flow-fluidity-publication-architecture-v0-1-1
- HTML marker check: PASS
- CSS marker check: PASS
- Capsule separator check: PASS
- External runtime dependency check: PASS
- git diff --check: PASS

## 4. Next operator actions

```bash
git diff
git status
git add index.html assets/css/selector.css .goldlevel_receipts/
git commit -m "Improve website flow and publication architecture capsules"
git push -u origin site/flow-fluidity-publication-architecture-v0-1-1
```
