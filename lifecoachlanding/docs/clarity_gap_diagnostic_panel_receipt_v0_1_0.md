# Clarity Gap Diagnostic Panel Receipt

Generated UTC: 2026-04-30T11:44:27.592446+00:00

## Status

```text
BUILT_DRAFT
```

## Design decision

The problem section is now treated as:

```text
CLARITY_GAP_DIAGNOSTIC_PANEL
```

not as:

```text
heading + standalone image + separate card grid
```

## Promotion condition

Promote only after the patch is applied locally and browser view confirms:

- image and symptom list read as one panel;
- no chopped standalone WebP effect;
- mobile stacks cleanly;
- bridge line leads naturally to pathway section.
