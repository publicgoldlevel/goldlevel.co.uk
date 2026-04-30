# CANON_HEADER v1.0.0
# NAME=CLARITY_GAP_DIAGNOSTIC_PANEL
# CANONICAL_FILENAME=CLARITY_GAP_DIAGNOSTIC_PANEL_v0_1_0.md
# TITLE=Life Coach Landing Page — Clarity Gap Diagnostic Panel
# ROLE=COMPONENT_SPEC_AND_IMPLEMENTATION_PATCH
# STATUS=BUILT_DRAFT
# VERSION=0.1.0
# ROUTE=CHATRMD_FIRST
# CREATED_UTC=2026-04-30T11:44:27.592446+00:00

## Purpose

Replace the chopped “The gap” section with one coherent diagnostic component.

## Design repair

The previous section had three unbound layers:

```text
heading text
standalone WebP image
four independent cards
```

This component binds them into one object:

```text
section header
→ diagnostic panel
→ image left
→ four symptoms right
→ bridge line into pathway
```

## Component rule

```text
The image supports the diagnostic state.
The symptom rows explain the diagnostic state.
The bridge line moves the user into the next section.
```

## QA pass conditions

- `#problem` exists once.
- `data-section-role="problem"` exists.
- `data-asset-role="problem"` exists.
- `.diagnostic-panel` CSS exists.
- `assets/generated/problem/problem-4x5-768.webp` is referenced.
- No legacy chopped `card-grid four` remains inside the problem section.
