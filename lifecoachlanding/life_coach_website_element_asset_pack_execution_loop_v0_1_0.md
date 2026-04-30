# CANON_HEADER v1.0.0
# NAME=LIFE_COACH_WEBSITE_ELEMENT_ASSET_PACK_EXECUTION_LOOP
# CANONICAL_FILENAME=life_coach_website_element_asset_pack_execution_loop_v0_1_0.md
# TITLE=Life Coach Website Element Asset Pack — Execution Loop
# ROLE=STAGE_01_IMAGE_ASSET_PACK_BUILD_AND_SITE_ROUTING
# STATUS=BUILT_DRAFT
# VERSION=0.1.0
# ROUTE=CHATRMD_FIRST
# CREATED_UTC=2026-04-30T10:03:32.700492+00:00

## Execution sequence

```text
raw 4:5 artifacts
→ Python derivative generator
→ responsive WebP variants
→ wide matte canvases
→ image manifest
→ HTML picture/srcset routing
→ CSS display-mode classes
→ QA receipt
→ archive output
```

## Source-status split

| State | Meaning |
|---|---|
| Known | The asset files in this archive exist and are referenced by generated HTML/CSS. |
| Inferred | Visual quality should be improved by matte/wide variants and contain-mode routing. |
| Not yet proven | Live browser rendering on GitHub Pages; mobile screenshot behavior; real user conversion. |

## Promotion condition

Move from BUILT_DRAFT to DEPLOYABLE only after opening `index.html` locally or on GitHub Pages and confirming:
- all section assets render;
- hero, pathway, process, and contact can use wide matte variants on desktop;
- mobile view keeps full 4:5 visibility;
- no image paths are broken;
- contact handoff still routes to info@goldlevel.co.uk.
