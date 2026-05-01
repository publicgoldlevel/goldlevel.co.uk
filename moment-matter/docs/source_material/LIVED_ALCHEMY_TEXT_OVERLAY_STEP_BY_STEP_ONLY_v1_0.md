# LIVED ALCHEMY — TEXT OVERLAY VERSION ONLY  
## Step-by-Step Production File v1.0

**Artifact type:** Markdown production file  
**Output target:** Transparent-background PNG text overlays  
**Primary use:** Instagram carousel, story/reel frames, website hero, PDF spreads  
**Sequence:** 12-stage *Lived Alchemy* visual art sequence  
**Canvas priority:** 2160 × 2700 px, 4:5 portrait  
**Background:** Transparent only  
**Core rule:** Image carries charge. Text gives entry. Silence preserves depth.

---

# 0. What This File Is For

Use this file to create **text-only transparent PNG overlays** that can be manually placed over the finished *Lived Alchemy* artwork.

This file does **not** generate background images.  
This file does **not** create final flattened composites.  
This file does **not** use long explanatory captions inside the artwork.

It gives you the exact text, hierarchy, layout order, export names, and production steps for the overlay layer only.

---

# 1. Production Principle

The overlay is not the artwork.  
The overlay is the threshold.

Use the smallest text layer that still lets the image carry the living charge.

If the image already says it, cut the text.  
If the overlay feels like a poster, reduce it.  
If the caption explains the visual, move meaning back into the image.  
If the text blocks the symbol, move it or use a minimal overlay.

---

# 2. Required Overlay Sets

For the text-overlay-only version, produce these first:

## Minimum Shippable Overlay Set

```text
01 title overlay
12 primary stage overlays
01 closing overlay
02 colour variants: LIGHT and DARK
01 Source Flame marker
```

## Recommended Working Set

```text
SET A — Master title overlay
SET B — 12-stage carousel overlays
SET C — Minimal one-line overlays
SET G — Marker-only overlays
```

Do not produce expanded poetic overlays until the primary set is clean.

---

# 3. Canvas Setup

## Primary Carousel Canvas

```yaml
canvas_size: 2160 x 2700 px
ratio: 4:5
background: transparent
colour_mode: RGB
export_format: PNG
safe_margin: 180 px minimum
text_width_max: 1480 px
```

## Transparent PNG Rules

```yaml
background: transparent
alpha_channel: true
embedded_background: false
flattened_with_artwork: false
trim_transparency: false
colour_profile: sRGB
```

Never export as JPG.  
Never include the artwork inside the overlay file.  
Never leave a white, black, or Canva-coloured background active.

---

# 4. Colour Variants

Export every primary overlay in at least two variants.

## LIGHT Variant

Use over dark artwork.

```yaml
primary_text: Bone White #F4EFE6
accent_text: Soft Gold #C9A95B
secondary_text: Ash Grey #B8B1A6
```

## DARK Variant

Use over light artwork.

```yaml
primary_text: Charcoal Ink #15130F
accent_text: Old Bronze #8F7541
secondary_text: Warm Black #080705
```

## Optional GOLD Variant

Use only for minimal, atmospheric slides.

```yaml
primary_text: Soft Gold #C9A95B
secondary_text: Bone White #F4EFE6
```

Gold should be an accent, not the whole voice.

---

# 5. Typography System

Use font categories rather than depending on one proprietary font.

## Recommended Pairing

```yaml
title_font: editorial serif
support_font: humanist sans or narrow sans
stage_number_font: small caps / mono / narrow sans
```

## Suggested Free / Common Pairings

```text
Option 1:
Title: Cormorant Garamond
Support: Inter

Option 2:
Title: Libre Baskerville
Support: Work Sans

Option 3:
Title: EB Garamond
Support: IBM Plex Sans

Option 4:
Title: Playfair-style serif
Support: Source Sans-style sans
```

## Hierarchy

```yaml
series_marker:
  size: 30
  tracking: 150
  case: uppercase

stage_number:
  size: 34
  tracking: 160
  case: uppercase

stage_title:
  size: 108-124
  tracking: 10-40
  case: title_case

primary_line:
  size: 76-82
  tracking: 0-20
  case: sentence_case

caption_fragment:
  size: 38-42
  tracking: 5-30
  case: sentence_case
```

---

# 6. Default 4:5 Layout

Use this as the starting layout for SET B.

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  width_max: 1480
  size: 116-124
  line_height: 1.02

primary_line:
  x: 180
  y: 1760-1780
  width_max: 1450
  size: 76-82
  line_height: 1.15

caption_fragment:
  x: 180
  y: 2140-2150
  width_max: 1320
  size: 38-42
  line_height: 1.35

source_flame:
  x: 180
  y: 2480
  size: 22
```

Preserve the center of the frame when possible.  
The overlay should occupy no more than 20–28% of the composition.

---

# 7. Step-by-Step Workflow

## Step 1 — Create Project Folder

```text
/lived_alchemy_overlay_project/
  /01_overlay_source_files/
  /02_overlays_light/
  /03_overlays_dark/
  /04_overlays_gold_optional/
  /05_marker_assets/
  /06_test_backgrounds/
  /07_final_composites/
  /08_archive/
```

## Step 2 — Create Master Frame

Create a transparent canvas:

```yaml
size: 2160 x 2700 px
background: transparent
safe_margin: 180 px
```

Create guides:

```yaml
left_margin: 180
right_margin: 1980
top_margin: 180
bottom_margin: 2520
center_x: 1080
```

## Step 3 — Build Text Styles

Create these reusable styles:

```text
LA_SERIES_MARKER
LA_STAGE_NUMBER
LA_STAGE_TITLE
LA_PRIMARY_LINE
LA_CAPTION_FRAGMENT
LA_SOURCE_FLAME
```

## Step 4 — Build Title Overlay

Use SET A01 or A02 below. Export LIGHT and DARK variants.

## Step 5 — Build 12 Stage Overlays

Use SET B below.

Each stage gets:

```text
series marker
stage number
stage title
primary line
optional caption fragment
source flame marker
```

## Step 6 — Build Minimal One-Line Set

Use SET C only where the artwork is strong enough to need less text.

## Step 7 — Export PNGs

Export as:

```yaml
format: PNG
background: transparent
alpha_channel: true
scale: 1x
```

Do not flatten over artwork.

## Step 8 — Test Transparency

Place each overlay over:

```text
black background
white background
busy image
final artwork
```

Reject any overlay with:

```text
white box
black box
unreadable text
heavy shadow
blocked visual symbol
incorrect stage number
wrong filename
```

## Step 9 — Apply to Artwork

Layer order:

```text
TOP
  optional final grain / grade
  transparent PNG text overlay
  optional local contrast mask
  final artwork image
BOTTOM
```

## Step 10 — Export Final Composites Separately

Final flattened images should go into:

```text
/07_final_composites/
```

Transparent overlay originals stay preserved.

---

# 8. SET A — Master Title Overlays

## A01 — Master Title / Full

**Filename LIGHT:** `LA_A01_MASTER_TITLE_FULL_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_A01_MASTER_TITLE_FULL_4x5_DARK_v1.png`

### Overlay Text

```text
Lived Alchemy

How experience becomes knowledge,
and knowledge becomes form.
```

### Optional Trajectory Footer

```text
raw → held → distilled → tested → related → named → made → broken → revealed → refined → proportioned → settled
```

### Placement

```yaml
title:
  x: 180
  y: 760
  size: 168
  line_height: 0.98

subtitle:
  x: 190
  y: 1120
  width_max: 1280
  size: 58
  line_height: 1.25

trajectory:
  x: 190
  y: 2350
  width_max: 1650
  size: 26
  tracking: 80
```

---

## A02 — Master Title / Minimal

**Filename LIGHT:** `LA_A02_MASTER_TITLE_MINIMAL_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_A02_MASTER_TITLE_MINIMAL_4x5_DARK_v1.png`

### Overlay Text

```text
Lived Alchemy
```

### Source Flame

```text
thin gold horizon line
```

### Placement

```yaml
title:
  align: center
  x_center: 1080
  y: 1250
  size: 178

source_flame:
  align: center
  x_center: 1080
  y: 1495
  width: 220
  height: 3
```

---

## A03 — Subtitle Only

**Filename LIGHT:** `LA_A03_SUBTITLE_ONLY_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_A03_SUBTITLE_ONLY_4x5_DARK_v1.png`

### Overlay Text

```text
How experience becomes knowledge,
and knowledge becomes form.
```

### Placement

```yaml
subtitle:
  align: center
  x_center: 1080
  y: 1260
  width_max: 1360
  size: 72
  line_height: 1.22
```

---

# 9. SET B — 12-Stage Carousel Text Overlays

Use these for the main carousel.

---

## B01 — Stage 01 / The Raw Signal

**Filename LIGHT:** `LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B01_STAGE01_RAW_SIGNAL_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

01 / 12

The Raw Signal

Experience enters.

The raw signal arrives before meaning.

•
```

---

## B02 — Stage 02 / The Vessel

**Filename LIGHT:** `LA_B02_STAGE02_VESSEL_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B02_STAGE02_VESSEL_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

02 / 12

The Vessel

Attention holds it.

Experience needs somewhere to stay.

⊙
```

---

## B03 — Stage 03 / Distillation

**Filename LIGHT:** `LA_B03_STAGE03_DISTILLATION_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B03_STAGE03_DISTILLATION_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

03 / 12

Distillation

Reflection distills it.

Signal becomes pattern.

◦
```

---

## B04 — Stage 04 / Testing

**Filename LIGHT:** `LA_B04_STAGE04_TESTING_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B04_STAGE04_TESTING_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

04 / 12

Testing

Action tests what remains.

Reality answers more cleanly than explanation.

—
```

---

## B05 — Stage 05 / Conversation

**Filename LIGHT:** `LA_B05_STAGE05_CONVERSATION_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B05_STAGE05_CONVERSATION_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

05 / 12

Conversation

The pattern meets other minds.

Other minds expose what solitude cannot.

•—•
```

---

## B06 — Stage 06 / Study

**Filename LIGHT:** `LA_B06_STAGE06_STUDY_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B06_STAGE06_STUDY_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

06 / 12

Study

Study gives language.

Structure forms around instinct.

|
```

---

## B07 — Stage 07 / Creation

**Filename LIGHT:** `LA_B07_STAGE07_CREATION_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B07_STAGE07_CREATION_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

07 / 12

Creation

The inner becomes outer.

The unseen becomes material.

◌
```

---

## B08 — Stage 08 / Destruction

**Filename LIGHT:** `LA_B08_STAGE08_DESTRUCTION_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B08_STAGE08_DESTRUCTION_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

08 / 12

Destruction

The false falls away.

Collapse can be part of refinement.

– –
```

---

## B09 — Stage 09 / Projection

**Filename LIGHT:** `LA_B09_STAGE09_PROJECTION_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B09_STAGE09_PROJECTION_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

09 / 12

Projection

The world becomes a mirror.

Not everything seen belongs to the world.

: :
```

---

## B10 — Stage 10 / Refinement

**Filename LIGHT:** `LA_B10_STAGE10_REFINEMENT_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B10_STAGE10_REFINEMENT_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

10 / 12

Refinement

Self-knowledge tunes the instrument.

Perception becomes cleaner.

○
```

---

## B11 — Stage 11 / Nature and Matter

**Filename LIGHT:** `LA_B11_STAGE11_NATURE_MATTER_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B11_STAGE11_NATURE_MATTER_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

11 / 12

Nature and Matter

The world teaches proportion.

Matter teaches transformation.

⁄
```

---

## B12 — Stage 12 / Silence

**Filename LIGHT:** `LA_B12_STAGE12_SILENCE_4x5_LIGHT_v1.png`  
**Filename DARK:** `LA_B12_STAGE12_SILENCE_4x5_DARK_v1.png`

```text
LIVED ALCHEMY

12 / 12

Silence

Silence lets it settle.

What remains becomes usable.

─
```

---

# 10. SET B Placement Overrides

Most slides use the default layout from Section 6.

Apply these overrides where necessary.

```yaml
B01:
  stage_title_size: 124
  primary_line_y: 1780
  caption_y: 2150

B02:
  stage_title_size: 124
  primary_line_y: 1780

B03:
  stage_title_size: 124
  caption_size: 42

B04:
  primary_line_y: 1760
  primary_line_size: 78
  caption_size: 38

B05:
  stage_title_size: 116
  primary_line_y: 1760
  primary_line_size: 76
  caption_size: 38

B06:
  stage_title_size: 124
  primary_line_y: 1780

B07:
  stage_title_size: 124
  primary_line_y: 1780

B08:
  stage_title_size: 116
  primary_line_y: 1780

B09:
  stage_title_size: 124
  primary_line_y: 1760
  primary_line_size: 78
  caption_size: 38

B10:
  stage_title_size: 116
  primary_line_y: 1740
  primary_line_size: 76

B11:
  stage_title_size: 108
  primary_line_y: 1760
  primary_line_size: 78

B12:
  stage_title_size: 124
  primary_line_y: 1780
```

---

# 11. SET C — Minimal One-Line Overlays

Use this set when the artwork should dominate.

No title.  
No caption fragment.  
No series marker unless needed.

## C-Set Placement

```yaml
primary_line:
  align: center
  x_center: 1080
  y: 1970
  width_max: 1440
  size: 82
  line_height: 1.15

marker:
  align: center
  x_center: 1080
  y: 2200
  size: 22
```

## C-Set Text Library

| File | Overlay text | Marker |
|---|---|---|
| `LA_C01_EXPERIENCE_ENTERS_4x5_LIGHT_v1.png` | Experience enters. | • |
| `LA_C02_ATTENTION_HOLDS_4x5_LIGHT_v1.png` | Attention holds it. | ⊙ |
| `LA_C03_REFLECTION_DISTILLS_4x5_LIGHT_v1.png` | Reflection distills it. | ◦ |
| `LA_C04_ACTION_TESTS_4x5_LIGHT_v1.png` | Action tests what remains. | — |
| `LA_C05_PATTERN_MEETS_MINDS_4x5_LIGHT_v1.png` | The pattern meets other minds. | •—• |
| `LA_C06_STUDY_LANGUAGE_4x5_LIGHT_v1.png` | Study gives language. | | |
| `LA_C07_INNER_OUTER_4x5_LIGHT_v1.png` | The inner becomes outer. | ◌ |
| `LA_C08_FALSE_FALLS_4x5_LIGHT_v1.png` | The false falls away. | – – |
| `LA_C09_WORLD_MIRROR_4x5_LIGHT_v1.png` | The world becomes a mirror. | : : |
| `LA_C10_TUNES_INSTRUMENT_4x5_LIGHT_v1.png` | Self-knowledge tunes the instrument. | ○ |
| `LA_C11_WORLD_PROPORTION_4x5_LIGHT_v1.png` | The world teaches proportion. | ⁄ |
| `LA_C12_SILENCE_SETTLES_4x5_LIGHT_v1.png` | Silence lets it settle. | ─ |

Export DARK versions by replacing `_LIGHT_` with `_DARK_`.

---

# 12. SET G — Marker-Only Assets

Use these as micro-assets for manual placement.

## G01 — Source Flame Dot

**Filename:** `LA_G01_SOURCE_FLAME_DOT_GOLD_TRANSPARENT_v1.png`

```yaml
canvas: 256 x 256 px
shape: imperfect gold dot
colour: Soft Gold #C9A95B
background: transparent
```

## G02 — Source Flame Horizon

**Filename:** `LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png`

```yaml
canvas: 512 x 128 px
shape: thin horizontal gold line
width: 220 px
height: 3 px
colour: Soft Gold #C9A95B
background: transparent
```

## G03 — Minimal Series Mark

**Filename:** `LA_G03_SERIES_MARK_LIGHT_v1.png`

```text
LIVED ALCHEMY
```

## G04 — 12-Point Trajectory Index

**Filename:** `LA_G04_TRAJECTORY_INDEX_4x5_LIGHT_v1.png`

```text
01 RAW
02 HELD
03 DISTILLED
04 TESTED
05 RELATED
06 NAMED
07 MADE
08 BROKEN
09 REVEALED
10 REFINED
11 PROPORTIONED
12 SETTLED
```

---

# 13. Closing Overlay Options

Use one closing overlay only.

## Closing Option 1 — Minimal

**Filename:** `LA_Z01_CLOSING_MINIMAL_4x5_LIGHT_v1.png`

```text
What remains
is lived alchemy.
```

## Closing Option 2 — Balanced

**Filename:** `LA_Z02_CLOSING_BALANCED_4x5_LIGHT_v1.png`

```text
Experience becomes knowledge.
Knowledge becomes form.

What remains
is lived alchemy.
```

## Closing Option 3 — Poetic

**Filename:** `LA_Z03_CLOSING_POETIC_4x5_LIGHT_v1.png`

```text
Between participation and witnessing,
between forming matter and letting it collapse,
the work becomes wisdom.
```

## Closing Option 4 — Silent

**Filename:** `LA_Z04_CLOSING_SILENT_4x5_LIGHT_v1.png`

```text
Silence lets it settle.
```

Recommended default: **Closing Option 4** if the final image is strong.

---

# 14. Canva Step-by-Step

```text
1. Create custom design: 2160 × 2700 px.
2. Set page background to transparent if available.
3. Add safe-margin guides at 180 px.
4. Add text objects:
   - LIVED ALCHEMY
   - stage number
   - stage title
   - primary line
   - optional caption fragment
   - Source Flame marker
5. Use Bone White / Soft Gold for LIGHT version.
6. Duplicate page.
7. Change text to Charcoal Ink / Old Bronze for DARK version.
8. Export as PNG.
9. Select transparent background.
10. Confirm that no image or background colour is included.
```

---

# 15. Figma Step-by-Step

```text
1. Create frame: 2160 × 2700 px.
2. Remove frame fill or set fill opacity to 0%.
3. Add layout guides:
   - 180 px margins
   - center x = 1080
4. Create text styles:
   - LA_SERIES_MARKER
   - LA_STAGE_NUMBER
   - LA_STAGE_TITLE
   - LA_PRIMARY_LINE
   - LA_CAPTION_FRAGMENT
   - LA_SOURCE_FLAME
5. Build A01 title overlay.
6. Duplicate frame for B01–B12.
7. Replace stage text per Section 9.
8. Export each frame as PNG.
9. Confirm transparency by placing exports over black and white test frames.
```

---

# 16. Photoshop Step-by-Step

```text
1. New file: 2160 × 2700 px.
2. Background contents: Transparent.
3. Add guides at 180 px from all sides.
4. Add text layers using the hierarchy in Section 5.
5. Keep artwork out of this PSD.
6. Group layers by stage:
   - series marker
   - stage number
   - stage title
   - primary line
   - caption fragment
   - Source Flame
7. Save PSD source file.
8. Export PNG with transparency.
9. Open exported PNG over black and white backgrounds to verify alpha.
```

---

# 17. Procreate Step-by-Step

```text
1. Create canvas: 2160 × 2700 px.
2. Turn off background layer before export.
3. Add text layers or import typography from another tool.
4. Keep text sharp and avoid raster scaling too much.
5. Export PNG.
6. Test over a coloured background.
7. Preserve a working copy with editable text if possible.
```

---

# 18. Readability and Safety Validation

Each overlay must pass:

```text
[ ] Transparent background confirmed.
[ ] Stage number correct.
[ ] Stage title correct.
[ ] Primary line exact.
[ ] Text readable at mobile size.
[ ] Overlay does not block key image symbol.
[ ] Overlay does not explain what the image already carries.
[ ] Caption fragment is one short line only.
[ ] Source Flame is subtle.
[ ] Filename matches export manifest.
[ ] LIGHT and DARK variants exported.
```

---

# 19. Sequence Validation

Read the full sequence out loud:

```text
Experience enters.
Attention holds it.
Reflection distills it.
Action tests what remains.
The pattern meets other minds.
Study gives language.
The inner becomes outer.
The false falls away.
The world becomes a mirror.
Self-knowledge tunes the instrument.
The world teaches proportion.
Silence lets it settle.
```

Pass only if the sequence feels like movement, not a list.

---

# 20. Final Export Manifest

## Minimum Primary Set

```text
LA_A01_MASTER_TITLE_FULL_4x5_LIGHT_v1.png
LA_A01_MASTER_TITLE_FULL_4x5_DARK_v1.png

LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png
LA_B01_STAGE01_RAW_SIGNAL_4x5_DARK_v1.png
LA_B02_STAGE02_VESSEL_4x5_LIGHT_v1.png
LA_B02_STAGE02_VESSEL_4x5_DARK_v1.png
LA_B03_STAGE03_DISTILLATION_4x5_LIGHT_v1.png
LA_B03_STAGE03_DISTILLATION_4x5_DARK_v1.png
LA_B04_STAGE04_TESTING_4x5_LIGHT_v1.png
LA_B04_STAGE04_TESTING_4x5_DARK_v1.png
LA_B05_STAGE05_CONVERSATION_4x5_LIGHT_v1.png
LA_B05_STAGE05_CONVERSATION_4x5_DARK_v1.png
LA_B06_STAGE06_STUDY_4x5_LIGHT_v1.png
LA_B06_STAGE06_STUDY_4x5_DARK_v1.png
LA_B07_STAGE07_CREATION_4x5_LIGHT_v1.png
LA_B07_STAGE07_CREATION_4x5_DARK_v1.png
LA_B08_STAGE08_DESTRUCTION_4x5_LIGHT_v1.png
LA_B08_STAGE08_DESTRUCTION_4x5_DARK_v1.png
LA_B09_STAGE09_PROJECTION_4x5_LIGHT_v1.png
LA_B09_STAGE09_PROJECTION_4x5_DARK_v1.png
LA_B10_STAGE10_REFINEMENT_4x5_LIGHT_v1.png
LA_B10_STAGE10_REFINEMENT_4x5_DARK_v1.png
LA_B11_STAGE11_NATURE_MATTER_4x5_LIGHT_v1.png
LA_B11_STAGE11_NATURE_MATTER_4x5_DARK_v1.png
LA_B12_STAGE12_SILENCE_4x5_LIGHT_v1.png
LA_B12_STAGE12_SILENCE_4x5_DARK_v1.png

LA_Z04_CLOSING_SILENT_4x5_LIGHT_v1.png
LA_Z04_CLOSING_SILENT_4x5_DARK_v1.png

LA_G01_SOURCE_FLAME_DOT_GOLD_TRANSPARENT_v1.png
LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png
```

---

# 21. Final Text Lock

Use this as the locked public overlay text.

```text
Lived Alchemy

How experience becomes knowledge,
and knowledge becomes form.

01 / The Raw Signal
Experience enters.

02 / The Vessel
Attention holds it.

03 / Distillation
Reflection distills it.

04 / Testing
Action tests what remains.

05 / Conversation
The pattern meets other minds.

06 / Study
Study gives language.

07 / Creation
The inner becomes outer.

08 / Destruction
The false falls away.

09 / Projection
The world becomes a mirror.

10 / Refinement
Self-knowledge tunes the instrument.

11 / Nature and Matter
The world teaches proportion.

12 / Silence
Silence lets it settle.
```

---

# 22. Stop Criteria

This overlay production phase is complete when:

```text
[ ] A01 title overlay exists.
[ ] B01–B12 overlays exist.
[ ] LIGHT and DARK variants exist.
[ ] Closing overlay exists.
[ ] Source Flame marker exists.
[ ] Every PNG has transparent background.
[ ] Every overlay has been tested over black, white, busy, and final artwork.
[ ] Final composites are exported separately.
[ ] Original transparent overlays are preserved.
```

End.
