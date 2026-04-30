# CANON_HEADER v1.0.0
# NAME=LIFE_COACH_STATIC_LANDING_PAGE_EXECUTION_LOOP
# CANONICAL_FILENAME=life_coach_static_landing_page_execution_loop_v0_1_0.md
# TITLE=Life Coach Static Landing Page — Execution Loop
# ROLE=STAGE_04_BUILD_PLAN_AND_QA_RECEIPT
# STATUS=BUILT
# VERSION=0.1.0
# ROUTE=CHATRMD_FIRST
# CREATED_UTC=2026-04-30T09:21:48.678696+00:00

## Loop

```text
Visual slides
→ copyboard
→ wireframe
→ static build
→ QA
→ GitHub archive
→ live-page verification
→ outreach/pitch use
→ receipt
```

## Artifact Inputs

1. Artifact 01 — Visual Ledger / Word Development Plan.
2. Artifact 02 — Three-slide visual advertisement set.
3. Artifact 03 — Landing Page Copyboard.
4. Artifact 04 — Landing Page Wireframe.

## Artifact 05 Output

```text
LIFE_COACH_STATIC_LANDING_PAGE_HTML_v0_1_0
```

## Files Produced

```text
index.html
styles.css
script.js
assets/slide-01-awareness.jpg
assets/slide-02-pathway.jpg
assets/slide-03-invitation.jpg
README.md
```

## QA Gates

- local slide assets exist;
- `index.html` references `styles.css` and `script.js`;
- `script.js` contains `const CONTACT_EMAIL = "info@goldlevel.co.uk";`;
- no `YOUR_EMAIL_HERE` placeholder;
- three-slide viewer exists;
- contact consent checkbox exists;
- GitHub archive contains root-level `index.html`.

## Promotion Condition

Promote from `BUILT_DRAFT` to `DEPLOYED` only after live URL loads, slide images render, mobile layout works, and contact handoff produces an email addressed to `info@goldlevel.co.uk`.
