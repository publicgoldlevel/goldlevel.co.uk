# LIVED ALCHEMY — TRANSPARENT PNG TEXT OVERLAY DRIVER v1.0

**Artifact type:** Markdown production driver  
**Output target:** Transparent-background `.png` text overlays for manual application onto finished visual artwork  
**Primary sequence:** 12-stage *Lived Alchemy* visual art sequence  
**Working title:** *Lived Alchemy*  
**Subtitle:** *How experience becomes knowledge, and knowledge becomes form.*  
**Primary use:** Instagram carousel, story frames, website hero images, PDF spreads, exhibition mockups, manual image compositing  
**Status:** Production scaffold / creative direction file  
**Version:** 1.0  
**Date:** 2026-04-27  

---

## 0. OPERATING SENTENCE

Create a multi-stage visual art sequence where lived experience becomes knowledge through attention, reflection, action, conversation, study, creation, destruction, projection, self-knowledge, nature, matter, and silence. Preserve mystery through image, preserve clarity through structure, and let the smallest true vessel carry the living charge.

---

## 1. PURPOSE

This Markdown file drives the creation of **text-only transparent PNG overlays** for manual application onto a separately produced visual image sequence.

The base images carry atmosphere, symbol, material, and emotional charge.

The overlays carry:

- stage number;
- stage title;
- primary line;
- optional subtitle;
- minimal caption fragment;
- sequence identity;
- subtle Source Flame / trajectory markers where useful.

The overlays must not become posters by themselves.

They are **transparent typographic vessels** designed to sit over artwork without blocking the visual field.

The core rule:

> **Image carries the charge. Text opens the door.**

---

## 2. CARRIER PRINCIPLE

### 2.1 Primary carrier division

| Meaning layer | Primary carrier | Overlay implication |
|---|---|---|
| Emotional charge | Image | Do not explain the feeling in text |
| Sequence | Stage number / placement | Use consistent stage markers |
| Threshold | Primary line | One strong sentence per overlay |
| Transformation | Slide order | Do not overload individual slides |
| Mystery | Negative space | Preserve transparent breathing room |
| Precision | Typography | Use hierarchy, not paragraphs |
| Continuity | Repeated anchor marks | Source Flame / trajectory marker |
| Public entry | Caption fragment | Optional, short, readable |
| Depth | Visual metaphor | Keep text compressed |

### 2.2 Overlay doctrine

```text
Do not make the overlay carry the whole work.
Do not make the image explain the whole work.
Do not make the caption repair unclear composition.
Each layer must carry only its lawful part.
```

### 2.3 Smallest true vessel rule

Every transparent PNG overlay must pass this question:

> **What is the smallest text layer that still lets the image carry the living charge?**

If the overlay feels like a paragraph, cut it.

If the overlay explains what the viewer can already see, cut it.

If the overlay weakens the image by naming too much, cut it.

If the overlay is beautiful but unreadable, revise it.

---

## 3. OUTPUT OBJECTIVES

This file specifies multiple `.png` overlay sets:

1. **SET A — Master Title Overlays**
2. **SET B — 12-Stage Carousel Overlays**
3. **SET C — Minimal One-Line Overlays**
4. **SET D — Expanded Poetic Overlays**
5. **SET E — Story / Reel Overlays**
6. **SET F — Website / PDF Hero Overlays**
7. **SET G — Source Flame / Trajectory Marker Overlays**
8. **SET H — Manual Application Instructions**
9. **SET I — Export Naming and Versioning**
10. **SET J — Validation Checklist**

Each exported overlay must have:

- transparent background;
- no full background fill;
- no image embedded;
- no decorative clutter;
- sufficient contrast against dark, light, and mixed imagery;
- safe margins;
- consistent typographic hierarchy;
- filename that identifies stage, overlay set, ratio, and version.

---

## 4. CANVAS SYSTEM

### 4.1 Primary canvas ratios

| Use case | Canvas size | Ratio | Export target |
|---|---:|---:|---|
| Instagram feed portrait | 2160 × 2700 px | 4:5 | Primary carousel |
| Instagram square | 2160 × 2160 px | 1:1 | Alternate feed |
| Instagram story / reel | 2160 × 3840 px | 9:16 | Story / reel cover |
| Website hero wide | 3840 × 2160 px | 16:9 | Web / presentation |
| PDF spread / print mockup | 3000 × 4242 px | A4 portrait approx | PDF / print |
| Thumbnail / preview | 1080 × 1350 px | 4:5 | Lightweight preview |

### 4.2 Recommended primary export

For the main sequence:

```text
CANVAS_PRIMARY = 2160 × 2700 px
BACKGROUND = transparent
FORMAT = PNG
COLOR_MODE = RGB
DPI = 300 if available; 72 acceptable for web
SAFE_MARGIN = 180 px minimum on all sides
TEXT_WIDTH_MAX = 1480 px
```

### 4.3 Safe zones

For 2160 × 2700 px:

| Zone | Coordinates / rule | Use |
|---|---|---|
| Top safe zone | y = 180–520 | Stage number / series label |
| Upper-mid zone | y = 620–1050 | Stage title |
| Center quiet zone | y = 1050–1650 | Usually empty; preserve image |
| Lower-mid zone | y = 1650–2050 | Primary line or short fragment |
| Bottom safe zone | y = 2200–2520 | Optional caption fragment / mark |
| Outer margin | x = 180 minimum | Avoid edge collision |

### 4.4 Placement philosophy

The overlay should usually occupy **no more than 20–28%** of the frame.

The transparent area should remain visually dominant.

Silence is part of the overlay.

---

## 5. TRANSPARENT PNG EXPORT RULES

### 5.1 Required export properties

```yaml
EXPORT:
  format: PNG
  background: transparent
  alpha_channel: true
  embedded_background: false
  flattened_with_artwork: false
  trim_transparency: false unless creating marker-only assets
  color_profile: sRGB
  filename_required: true
```

### 5.2 Do not export as

- JPG;
- flattened PNG with background;
- screenshot;
- PDF raster preview;
- Canva page with background colour still active;
- PNG with accidental white/black backdrop;
- low-resolution compressed social preview.

### 5.3 Manual transparency test

After export, place the PNG overlay over:

1. black background;
2. white background;
3. busy photographic background;
4. final artwork.

If the overlay creates a white box, transparency failed.

If the text disappears on either dark or light backgrounds, export alternate colour versions.

---

## 6. TYPOGRAPHIC SYSTEM

### 6.1 Font categories

Do not depend on one specific proprietary font. Use categories.

| Role | Font category | Character |
|---|---|---|
| Series title | High-contrast editorial serif | literary, elegant, quiet authority |
| Stage title | Refined serif or humanist sans | clear, spacious, stable |
| Primary line | Editorial serif italic or light sans | intimate, poetic, breathable |
| Stage number | Small caps / mono / narrow sans | sequence, precision, index |
| Caption fragment | Humanist sans | readable, understated |
| Marker labels | Mono / small caps | technical, subtle |

### 6.2 Suggested font pairings

| Pairing | Display | Body / support |
|---|---|---|
| Editorial classic | Cormorant Garamond / Playfair-style serif | Inter / Source Sans-style sans |
| Literary minimal | Libre Baskerville-style serif | Work Sans / IBM Plex Sans-style sans |
| Manuscript-forward | EB Garamond-style serif | Spectral / system sans |
| Luxury restraint | High contrast serif | Low-contrast geometric sans |
| Systemic / epistemic | Serif title | Mono stage index |

### 6.3 Font weight guidance

| Text role | Weight | Case |
|---|---|---|
| Series title | Regular / SemiBold | Title Case |
| Stage title | Regular / Medium | Title Case |
| Primary line | Regular / Light | Sentence case |
| Caption fragment | Light / Regular | Sentence case |
| Stage number | Medium | Small caps / uppercase |

### 6.4 Tracking / letter spacing

| Role | Tracking |
|---|---:|
| Series marker | +80 to +160 |
| Stage number | +120 to +220 |
| Stage title | +10 to +40 |
| Primary line | 0 to +20 |
| Caption | +5 to +30 |

### 6.5 Line height

| Role | Line height |
|---|---:|
| Title | 0.95–1.1 |
| Stage title | 1.0–1.15 |
| Primary line | 1.15–1.35 |
| Caption fragment | 1.25–1.45 |

---

## 7. COLOUR SYSTEM FOR TRANSPARENT OVERLAYS

### 7.1 Core overlay colours

| Name | Hex | Use |
|---|---|---|
| Bone White | `#F4EFE6` | primary text on dark images |
| Soft Gold | `#C9A95B` | Source Flame, stage marker, emphasis |
| Ash Grey | `#B8B1A6` | secondary caption text |
| Charcoal Ink | `#15130F` | primary text on light images |
| Warm Black | `#080705` | shadow / dark variant |
| Pale Sand | `#D8CCB8` | alternate text |
| Old Bronze | `#8F7541` | subtle line / marker |

### 7.2 Overlay colour variants

For every overlay, export at least two variants:

```text
_LIGHT_TEXT = Bone White / Soft Gold
_DARK_TEXT = Charcoal Ink / Old Bronze
```

Optional third variant:

```text
_GOLD_TEXT = Soft Gold / Bone White
```

### 7.3 Shadow and stroke system

Use sparingly.

| Treatment | Settings |
|---|---|
| Soft shadow | black, 20–35% opacity, blur 18–36 px, y offset 4–12 px |
| Fine stroke for light text | charcoal / black, 15–25% opacity, 1–2 px |
| Fine stroke for dark text | bone / sand, 15–20% opacity, 1–2 px |
| Glow | avoid unless extremely subtle |
| Hard shadow | avoid |
| Thick outline | avoid |

### 7.4 Contrast rule

Text must remain readable without becoming dominant.

If readability requires a heavy shadow, the overlay is in the wrong place or the image needs a quieter area.

---

## 8. LAYOUT GRAMMAR

### 8.1 Overlay hierarchy

```text
SERIES MARKER
↓
STAGE NUMBER
↓
STAGE TITLE
↓
PRIMARY LINE
↓
OPTIONAL CAPTION FRAGMENT
↓
SOURCE FLAME / TRAJECTORY MARK
```

Not every overlay uses every element.

### 8.2 Default 4:5 layout

For 2160 × 2700 px:

```yaml
series_marker:
  x: 180
  y: 190
  size: 34
  tracking: 140

stage_number:
  x: 180
  y: 290
  size: 36
  tracking: 180

stage_title:
  x: 180
  y: 530
  width_max: 1480
  size: 126
  line_height: 1.02

primary_line:
  x: 180
  y: 1780
  width_max: 1420
  size: 78
  line_height: 1.18

caption_fragment:
  x: 180
  y: 2210
  width_max: 1280
  size: 42
  line_height: 1.35

source_flame:
  x: 180
  y: 2475
  size: 18
```

### 8.3 Alternate centered layout

Use when the image has visual quiet in center.

```yaml
stage_title:
  align: center
  x_center: 1080
  y: 760
  width_max: 1500
  size: 118

primary_line:
  align: center
  x_center: 1080
  y: 1500
  width_max: 1320
  size: 74

caption_fragment:
  align: center
  x_center: 1080
  y: 2140
  width_max: 1180
  size: 40
```

### 8.4 Bottom-weighted layout

Use when visual subject is upper frame.

```yaml
stage_marker:
  x: 180
  y: 1880
  size: 32

stage_title:
  x: 180
  y: 1980
  size: 96

primary_line:
  x: 180
  y: 2220
  size: 58

source_flame:
  x: 180
  y: 2510
```

### 8.5 Vertical title layout

Use sparingly for title slide or website hero.

```yaml
vertical_series:
  text: "LIVED ALCHEMY"
  orientation: vertical
  x: 180
  y_start: 420
  size: 36
  tracking: 220

main_title:
  x: 420
  y: 820
  size: 154
  line_height: 0.98
```

---

## 9. SOURCE FLAME MARK SYSTEM

### 9.1 Definition

The **Source Flame** is a recurring micro-mark that signals continuity across the work.

It should not look like a logo unless deliberately used as one.

It is a small typographic / symbolic flame, ember, dot, or gold line.

### 9.2 Source Flame meanings

| Meaning | Visual expression |
|---|---|
| Raw source | small gold ember |
| Attention | gold dot held within thin circle |
| Distillation | gold drop |
| Action | short gold strike line |
| Conversation | two gold dots connected |
| Study | gold marginal line |
| Creation | gold seed mark |
| Destruction | broken gold dash |
| Projection | mirrored gold point |
| Refinement | gold ring / calibration mark |
| Nature | gold vein / root line |
| Silence | thin gold horizon |

### 9.3 Source Flame variants

```text
SF_01_EMBER = •
SF_02_HELD_DOT = ⊙
SF_03_DROP = ◦
SF_04_STRIKE = —
SF_05_THREAD = •—•
SF_06_MARGIN = |
SF_07_SEED = ◌
SF_08_BROKEN = – –
SF_09_MIRROR = : :
SF_10_RING = ○
SF_11_VEIN = ⁄
SF_12_HORIZON = ─
```

### 9.4 Manual design instruction

If glyphs feel too typographic, replace them with drawn vector marks:

- 1–3 px gold line;
- small irregular gold circle;
- short hand-drawn dash;
- 12 px gold dot;
- fine-line circle;
- tiny gold horizon line.

The Source Flame should be felt, not announced.

---

## 10. TRAJECTORY SYSTEM

### 10.1 Core trajectory

```text
raw → held → distilled → tested → related → named → made → broken → revealed → refined → proportioned → settled
```

### 10.2 Overlay use

The trajectory can appear:

1. as a small footer line on title slides;
2. as a very faint 12-point index;
3. as a stage marker only;
4. as an optional website / PDF diagram;
5. not at all on main carousel if it creates clutter.

### 10.3 12-point trajectory marker

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

### 10.4 Footer trajectory line

```text
RAW → HELD → DISTILLED → TESTED → RELATED → NAMED → MADE → BROKEN → REVEALED → REFINED → PROPORTIONED → SETTLED
```

Use only on:

- title slide;
- closing slide;
- website hero;
- PDF divider.

Do not use on every stage slide.

---

## 11. SET A — MASTER TITLE OVERLAYS

### A01 — Master Title / Full

**Filename:** `LA_A01_MASTER_TITLE_FULL_4x5_LIGHT_v1.png`

```yaml
canvas: 2160x2700
background: transparent
text_color: Bone White
accent_color: Soft Gold
layout: left-weighted
```

**Overlay text:**

```text
Lived Alchemy

How experience becomes knowledge,
and knowledge becomes form.
```

**Support text:**

```text
raw → held → distilled → tested → related → named → made → broken → revealed → refined → proportioned → settled
```

**Placement:**

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

### A02 — Master Title / Minimal

**Filename:** `LA_A02_MASTER_TITLE_MINIMAL_4x5_LIGHT_v1.png`

**Overlay text:**

```text
Lived Alchemy
```

**Optional mark:**

```text
SOURCE FLAME: thin gold horizon line below title
```

**Placement:**

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

### A03 — Subtitle Only

**Filename:** `LA_A03_SUBTITLE_ONLY_4x5_LIGHT_v1.png`

**Overlay text:**

```text
How experience becomes knowledge,
and knowledge becomes form.
```

**Placement:**

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

### A04 — Operating Sentence Overlay

**Filename:** `LA_A04_OPERATING_SENTENCE_4x5_LIGHT_v1.png`

**Overlay text:**

```text
Preserve mystery through image.
Preserve clarity through structure.
Let the smallest true vessel carry the living charge.
```

**Placement:**

```yaml
text:
  x: 220
  y: 1580
  width_max: 1400
  size: 58
  line_height: 1.32
```

---

## 12. SET B — 12-STAGE CAROUSEL OVERLAYS

### Shared slide system

Every stage overlay may use:

```text
LIVED ALCHEMY
STAGE 01 / 12
[STAGE TITLE]
[PRIMARY LINE]
[OPTIONAL CAPTION FRAGMENT]
[SOURCE FLAME MARK]
```

Recommended public version:

```text
[STAGE TITLE]
[PRIMARY LINE]
```

The series marker and stage number can be included if the artwork needs sequencing.

---

## B01 — Stage 1 / The Raw Signal

**Filename:** `LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png`

**Stage marker:**

```text
01 / 12
```

**Stage title:**

```text
The Raw Signal
```

**Primary line:**

```text
Experience enters.
```

**Caption fragment:**

```text
The raw signal arrives before meaning.
```

**Source Flame mark:**

```text
•
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "01 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124
  line_height: 1.02

primary_line:
  x: 180
  y: 1780
  size: 82
  line_height: 1.15

caption_fragment:
  x: 180
  y: 2150
  width_max: 1180
  size: 40
  line_height: 1.35

source_flame:
  x: 180
  y: 2480
  size: 22
```

**Export variants:**

```text
LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png
LA_B01_STAGE01_RAW_SIGNAL_4x5_DARK_v1.png
LA_B01_STAGE01_RAW_SIGNAL_4x5_GOLD_v1.png
```

---

## B02 — Stage 2 / The Vessel

**Filename:** `LA_B02_STAGE02_VESSEL_4x5_LIGHT_v1.png`

**Stage marker:**

```text
02 / 12
```

**Stage title:**

```text
The Vessel
```

**Primary line:**

```text
Attention holds it.
```

**Caption fragment:**

```text
Experience needs somewhere to stay.
```

**Source Flame mark:**

```text
⊙
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "02 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1780
  size: 82

caption_fragment:
  x: 180
  y: 2150
  width_max: 1120
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B03 — Stage 3 / Distillation

**Filename:** `LA_B03_STAGE03_DISTILLATION_4x5_LIGHT_v1.png`

**Stage marker:**

```text
03 / 12
```

**Stage title:**

```text
Distillation
```

**Primary line:**

```text
Reflection distills it.
```

**Caption fragment:**

```text
Signal becomes pattern.
```

**Source Flame mark:**

```text
◦
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "03 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1780
  size: 82

caption_fragment:
  x: 180
  y: 2150
  size: 42

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B04 — Stage 4 / Testing

**Filename:** `LA_B04_STAGE04_TESTING_4x5_LIGHT_v1.png`

**Stage marker:**

```text
04 / 12
```

**Stage title:**

```text
Testing
```

**Primary line:**

```text
Action tests what remains.
```

**Caption fragment:**

```text
Reality answers more cleanly than explanation.
```

**Source Flame mark:**

```text
—
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "04 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1760
  width_max: 1350
  size: 78

caption_fragment:
  x: 180
  y: 2140
  width_max: 1280
  size: 38
  line_height: 1.35

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B05 — Stage 5 / Conversation

**Filename:** `LA_B05_STAGE05_CONVERSATION_4x5_LIGHT_v1.png`

**Stage marker:**

```text
05 / 12
```

**Stage title:**

```text
Conversation
```

**Primary line:**

```text
The pattern meets other minds.
```

**Caption fragment:**

```text
Other minds expose what solitude cannot.
```

**Source Flame mark:**

```text
•—•
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "05 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 116

primary_line:
  x: 180
  y: 1760
  width_max: 1480
  size: 76

caption_fragment:
  x: 180
  y: 2140
  width_max: 1320
  size: 38

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B06 — Stage 6 / Study

**Filename:** `LA_B06_STAGE06_STUDY_4x5_LIGHT_v1.png`

**Stage marker:**

```text
06 / 12
```

**Stage title:**

```text
Study
```

**Primary line:**

```text
Study gives language.
```

**Caption fragment:**

```text
Structure forms around instinct.
```

**Source Flame mark:**

```text
|
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "06 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1780
  size: 82

caption_fragment:
  x: 180
  y: 2150
  width_max: 1220
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B07 — Stage 7 / Creation

**Filename:** `LA_B07_STAGE07_CREATION_4x5_LIGHT_v1.png`

**Stage marker:**

```text
07 / 12
```

**Stage title:**

```text
Creation
```

**Primary line:**

```text
The inner becomes outer.
```

**Caption fragment:**

```text
The unseen becomes material.
```

**Source Flame mark:**

```text
◌
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "07 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1780
  width_max: 1380
  size: 82

caption_fragment:
  x: 180
  y: 2150
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B08 — Stage 8 / Destruction

**Filename:** `LA_B08_STAGE08_DESTRUCTION_4x5_LIGHT_v1.png`

**Stage marker:**

```text
08 / 12
```

**Stage title:**

```text
Destruction
```

**Primary line:**

```text
The false falls away.
```

**Caption fragment:**

```text
Collapse can be part of refinement.
```

**Source Flame mark:**

```text
– –
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "08 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 116

primary_line:
  x: 180
  y: 1780
  width_max: 1320
  size: 82

caption_fragment:
  x: 180
  y: 2150
  width_max: 1280
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B09 — Stage 9 / Projection

**Filename:** `LA_B09_STAGE09_PROJECTION_4x5_LIGHT_v1.png`

**Stage marker:**

```text
09 / 12
```

**Stage title:**

```text
Projection
```

**Primary line:**

```text
The world becomes a mirror.
```

**Caption fragment:**

```text
Not everything seen belongs to the world.
```

**Source Flame mark:**

```text
: :
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "09 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1760
  width_max: 1450
  size: 78

caption_fragment:
  x: 180
  y: 2140
  width_max: 1320
  size: 38

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B10 — Stage 10 / Refinement

**Filename:** `LA_B10_STAGE10_REFINEMENT_4x5_LIGHT_v1.png`

**Stage marker:**

```text
10 / 12
```

**Stage title:**

```text
Refinement
```

**Primary line:**

```text
Self-knowledge tunes the instrument.
```

**Caption fragment:**

```text
Perception becomes cleaner.
```

**Source Flame mark:**

```text
○
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "10 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 116

primary_line:
  x: 180
  y: 1740
  width_max: 1520
  size: 76
  line_height: 1.15

caption_fragment:
  x: 180
  y: 2140
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B11 — Stage 11 / Nature and Matter

**Filename:** `LA_B11_STAGE11_NATURE_MATTER_4x5_LIGHT_v1.png`

**Stage marker:**

```text
11 / 12
```

**Stage title:**

```text
Nature and Matter
```

**Primary line:**

```text
The world teaches proportion.
```

**Caption fragment:**

```text
Matter teaches transformation.
```

**Source Flame mark:**

```text
⁄
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "11 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  width_max: 1500
  size: 108
  line_height: 1.04

primary_line:
  x: 180
  y: 1760
  width_max: 1450
  size: 78

caption_fragment:
  x: 180
  y: 2140
  size: 40

source_flame:
  x: 180
  y: 2480
  size: 22
```

---

## B12 — Stage 12 / Silence

**Filename:** `LA_B12_STAGE12_SILENCE_4x5_LIGHT_v1.png`

**Stage marker:**

```text
12 / 12
```

**Stage title:**

```text
Silence
```

**Primary line:**

```text
Silence lets it settle.
```

**Caption fragment:**

```text
What remains becomes usable.
```

**Source Flame mark:**

```text
─
```

**Placement:**

```yaml
series_marker:
  text: "LIVED ALCHEMY"
  x: 180
  y: 190
  size: 30
  tracking: 150

stage_number:
  text: "12 / 12"
  x: 180
  y: 300
  size: 34
  tracking: 160

stage_title:
  x: 180
  y: 560
  size: 124

primary_line:
  x: 180
  y: 1780
  width_max: 1300
  size: 82

caption_fragment:
  x: 180
  y: 2150
  size: 40

source_flame:
  x: 180
  y: 2480
  width: 180
  height: 3
```

---

## 13. SET C — MINIMAL ONE-LINE OVERLAYS

Use this set when the image is strong and should dominate.

No stage title. No caption fragment. No series label unless needed.

### C01–C12 one-line overlays

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

### C-set default placement

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

### C-set alternate placement

If the bottom image area is busy:

```yaml
primary_line:
  align: center
  x_center: 1080
  y: 720
  width_max: 1440
  size: 82

marker:
  align: center
  x_center: 1080
  y: 950
  size: 22
```

---

## 14. SET D — EXPANDED POETIC OVERLAYS

Use this set for PDF spreads, website features, or slower visual essays.

Each overlay may contain 2–4 lines.

Do not use this set for the primary Instagram carousel unless visual background is very quiet.

### D01 — Raw Signal / Expanded

**Filename:** `LA_D01_RAW_SIGNAL_EXPANDED_4x5_LIGHT_v1.png`

```text
Before language,
there is contact.

Before meaning,
there is pressure.
```

### D02 — Vessel / Expanded

```text
Attention is the first container.

It keeps the signal
from disappearing.
```

### D03 — Distillation / Expanded

```text
Reflection does not repeat the event.

It lets heat separate
signal from noise.
```

### D04 — Testing / Expanded

```text
The world is the anvil.

Only what survives contact
becomes knowledge.
```

### D05 — Conversation / Expanded

```text
Conversation places
the pattern into relation.

Another mind reveals
depth, edge, and distortion.
```

### D06 — Study / Expanded

```text
Study does not replace experience.

It gives the private signal
a larger field.
```

### D07 — Creation / Expanded

```text
Creation gives the unseen
a surface.

What was held
can now be met.
```

### D08 — Destruction / Expanded

```text
Some forms collapse
because they were weak.

Some collapse
because they are complete.
```

### D09 — Projection / Expanded

```text
Projection shows what has been
placed onto reality.

The mirror is not the world.
```

### D10 — Refinement / Expanded

```text
Self-knowledge is calibration.

The instrument becomes cleaner.
The field becomes wider.
```

### D11 — Nature and Matter / Expanded

```text
Nature teaches rhythm,
scale, patience, emergence.

Matter transforms
without performance.
```

### D12 — Silence / Expanded

```text
Immersion teaches.
Distance teaches.
Action teaches.

Silence lets the field
find its measure.
```

### D-set placement

```yaml
expanded_text:
  x: 220
  y: 1480
  width_max: 1380
  size: 58
  line_height: 1.32

stage_number:
  x: 220
  y: 220
  size: 32
  tracking: 180

stage_title:
  x: 220
  y: 420
  size: 86
```

---

## 15. SET E — STORY / REEL OVERLAYS

### 15.1 Canvas

```yaml
canvas: 2160x3840
ratio: 9:16
background: transparent
safe_margin_x: 180
safe_margin_top: 320
safe_margin_bottom: 420
```

### 15.2 Story title overlay

**Filename:** `LA_E00_STORY_TITLE_9x16_LIGHT_v1.png`

```text
Lived Alchemy

How experience becomes knowledge,
and knowledge becomes form.
```

**Placement:**

```yaml
title:
  align: center
  x_center: 1080
  y: 1450
  size: 170
  line_height: 0.98

subtitle:
  align: center
  x_center: 1080
  y: 1820
  width_max: 1400
  size: 62
```

### 15.3 Story stage overlays

Use one line per story frame:

```text
01 Experience enters.
02 Attention holds it.
03 Reflection distills it.
04 Action tests what remains.
05 The pattern meets other minds.
06 Study gives language.
07 The inner becomes outer.
08 The false falls away.
09 The world becomes a mirror.
10 Self-knowledge tunes the instrument.
11 The world teaches proportion.
12 Silence lets it settle.
```

### 15.4 Story placement

```yaml
stage_line:
  align: center
  x_center: 1080
  y: 2920
  width_max: 1480
  size: 72
  line_height: 1.18

stage_marker:
  align: center
  x_center: 1080
  y: 2750
  size: 32
  tracking: 180
```

### 15.5 Reel cover overlay

**Filename:** `LA_E13_REEL_COVER_9x16_LIGHT_v1.png`

```text
Lived Alchemy

A visual sequence
on how experience becomes form.
```

---

## 16. SET F — WEBSITE / PDF HERO OVERLAYS

### F01 — Website Hero Wide

**Filename:** `LA_F01_WEBSITE_HERO_16x9_LIGHT_v1.png`

```yaml
canvas: 3840x2160
background: transparent
layout: left-weighted
```

**Overlay text:**

```text
Lived Alchemy

How experience becomes knowledge,
and knowledge becomes form.
```

**Support line:**

```text
raw → held → distilled → tested → related → named → made → broken → revealed → refined → proportioned → settled
```

**Placement:**

```yaml
title:
  x: 240
  y: 610
  size: 176
  line_height: 0.98

subtitle:
  x: 250
  y: 1000
  width_max: 1450
  size: 64
  line_height: 1.22

trajectory:
  x: 250
  y: 1780
  size: 30
  tracking: 90
```

---

### F02 — PDF Divider Overlay

**Filename:** `LA_F02_PDF_DIVIDER_4x5_LIGHT_v1.png`

**Overlay text:**

```text
raw
held
distilled
tested
related
named
made
broken
revealed
refined
proportioned
settled
```

**Placement:**

```yaml
word_stack:
  x: 260
  y: 430
  size: 64
  line_height: 1.42
  tracking: 40
```

---

### F03 — Closing Website Overlay

**Filename:** `LA_F03_CLOSING_WEBSITE_16x9_LIGHT_v1.png`

**Overlay text:**

```text
Between participation and witnessing,
experience becomes knowledge.

Knowledge becomes form.

What remains is lived alchemy.
```

**Placement:**

```yaml
closing_text:
  x: 240
  y: 760
  width_max: 1680
  size: 72
  line_height: 1.28
```

---

## 17. SET G — MARKER-ONLY TRANSPARENT PNGS

These are micro-assets for manual placement in any design.

### G01 — Source Flame Dot

**Filename:** `LA_G01_SOURCE_FLAME_DOT_GOLD_TRANSPARENT_v1.png`

```yaml
canvas: 256x256
shape: imperfect gold dot
color: Soft Gold
background: transparent
```

### G02 — Source Flame Horizon

**Filename:** `LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png`

```yaml
canvas: 512x128
shape: thin horizontal gold line
width: 220px
height: 3px
background: transparent
```

### G03 — 12-Point Trajectory Index

**Filename:** `LA_G03_TRAJECTORY_INDEX_4x5_LIGHT_v1.png`

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

### G04 — Minimal Series Mark

**Filename:** `LA_G04_SERIES_MARK_LIGHT_v1.png`

```text
LIVED ALCHEMY
```

### G05 — Gold Stage Slash

**Filename:** `LA_G05_STAGE_SLASH_GOLD_TRANSPARENT_v1.png`

```text
/
```

### G06 — Fine Gold Corner Rule

**Filename:** `LA_G06_CORNER_RULE_GOLD_TRANSPARENT_v1.png`

```yaml
canvas: 512x512
shape: two fine gold lines forming an L corner
line_weight: 2px
background: transparent
```

### G07 — Quiet Breath Mark

**Filename:** `LA_G07_BREATH_MARK_GOLD_TRANSPARENT_v1.png`

```text
—
```

Use for pauses in story / voiceover visuals.

---

## 18. MANUAL APPLICATION INSTRUCTIONS

### 18.1 General workflow

```text
1. Produce or select final background image.
2. Open image in Photoshop, Figma, Canva, Procreate, Affinity, or equivalent.
3. Import transparent PNG overlay.
4. Place overlay in safe zone.
5. Check contrast.
6. Scale no more than ±15% if possible.
7. Adjust opacity only if needed.
8. Export final flattened artwork separately.
9. Preserve original transparent overlay PNG.
```

### 18.2 Recommended layer order

```text
TOP:
  optional grain / final colour grade
  text overlay PNG
  optional shadow mask if needed
  artwork image
  background / base frame
BOTTOM
```

### 18.3 Placement adjustment rules

| Situation | Adjustment |
|---|---|
| Text crosses bright image area | Use dark text variant |
| Text crosses dark image area | Use light text variant |
| Mixed contrast behind text | Move overlay before adding heavy shadow |
| Image feels blocked | Use C-set minimal overlay |
| Slide feels too empty | Add small Source Flame marker |
| Slide feels too designed | Remove marker or caption fragment |
| Text feels like a poster | Reduce size by 10–20% |
| Text feels disconnected | Add stage number or trajectory mark |
| Text competes with image subject | Move to opposite third |

### 18.4 Manual application rule

Do not force a single overlay position across all images if the visual composition changes.

Keep typography consistent.

Let placement respond to the image.

---

## 19. EXPORT NAMING SYSTEM

### 19.1 Filename formula

```text
LA_[SET][NUMBER]_[STAGE/TYPE]_[RATIO]_[COLOUR]_[VERSION].png
```

### 19.2 Examples

```text
LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png
LA_B01_STAGE01_RAW_SIGNAL_4x5_DARK_v1.png
LA_C04_ACTION_TESTS_4x5_GOLD_v1.png
LA_E12_STORY_SILENCE_9x16_LIGHT_v1.png
LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png
```

### 19.3 Ratio labels

```text
4x5
1x1
9x16
16x9
A4P
THUMB
```

### 19.4 Colour labels

```text
LIGHT
DARK
GOLD
MIXED
MARK
```

### 19.5 Version labels

```text
v1
v1_1
v1_2
v2
```

Use `v2` only when the language, typography system, or layout architecture changes substantially.

---

## 20. COMPLETE EXPORT MANIFEST

### 20.1 Minimum viable overlay set

```text
LA_A01_MASTER_TITLE_FULL_4x5_LIGHT_v1.png
LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png
LA_B02_STAGE02_VESSEL_4x5_LIGHT_v1.png
LA_B03_STAGE03_DISTILLATION_4x5_LIGHT_v1.png
LA_B04_STAGE04_TESTING_4x5_LIGHT_v1.png
LA_B05_STAGE05_CONVERSATION_4x5_LIGHT_v1.png
LA_B06_STAGE06_STUDY_4x5_LIGHT_v1.png
LA_B07_STAGE07_CREATION_4x5_LIGHT_v1.png
LA_B08_STAGE08_DESTRUCTION_4x5_LIGHT_v1.png
LA_B09_STAGE09_PROJECTION_4x5_LIGHT_v1.png
LA_B10_STAGE10_REFINEMENT_4x5_LIGHT_v1.png
LA_B11_STAGE11_NATURE_MATTER_4x5_LIGHT_v1.png
LA_B12_STAGE12_SILENCE_4x5_LIGHT_v1.png
```

### 20.2 Recommended full carousel overlay set

```text
LA_A01_MASTER_TITLE_FULL_4x5_LIGHT_v1.png
LA_A01_MASTER_TITLE_FULL_4x5_DARK_v1.png
LA_A02_MASTER_TITLE_MINIMAL_4x5_LIGHT_v1.png
LA_A03_SUBTITLE_ONLY_4x5_LIGHT_v1.png

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

LA_G01_SOURCE_FLAME_DOT_GOLD_TRANSPARENT_v1.png
LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png
LA_G04_SERIES_MARK_LIGHT_v1.png
```

### 20.3 Story / reel export set

```text
LA_E00_STORY_TITLE_9x16_LIGHT_v1.png
LA_E01_STORY_EXPERIENCE_ENTERS_9x16_LIGHT_v1.png
LA_E02_STORY_ATTENTION_HOLDS_9x16_LIGHT_v1.png
LA_E03_STORY_REFLECTION_DISTILLS_9x16_LIGHT_v1.png
LA_E04_STORY_ACTION_TESTS_9x16_LIGHT_v1.png
LA_E05_STORY_PATTERN_MEETS_MINDS_9x16_LIGHT_v1.png
LA_E06_STORY_STUDY_LANGUAGE_9x16_LIGHT_v1.png
LA_E07_STORY_INNER_OUTER_9x16_LIGHT_v1.png
LA_E08_STORY_FALSE_FALLS_9x16_LIGHT_v1.png
LA_E09_STORY_WORLD_MIRROR_9x16_LIGHT_v1.png
LA_E10_STORY_SELF_KNOWLEDGE_9x16_LIGHT_v1.png
LA_E11_STORY_WORLD_PROPORTION_9x16_LIGHT_v1.png
LA_E12_STORY_SILENCE_SETTLES_9x16_LIGHT_v1.png
LA_E13_REEL_COVER_9x16_LIGHT_v1.png
```

---

## 21. OVERLAY PROMPTS FOR DESIGN TOOLS

### 21.1 Generic overlay creation prompt

```text
Create a transparent-background PNG text overlay for the Lived Alchemy visual sequence.

Canvas: 2160 × 2700 px.
Background: transparent.
Do not include any image or background fill.
Use refined editorial typography with generous negative space.
Use Bone White text (#F4EFE6) and Soft Gold accent (#C9A95B).
Place text within 180 px safe margins.
Keep overlay minimal and readable.
Export as PNG with alpha channel.

Overlay text:
[PASTE STAGE TEXT]

Stage marker:
[PASTE STAGE NUMBER]

Source Flame marker:
[PASTE MARK]
```

### 21.2 Canva instruction

```text
1. Create custom size: 2160 × 2700 px.
2. Set page background to transparent if available; otherwise remove before export.
3. Add text only.
4. Use title, stage number, primary line, optional caption fragment.
5. Use export setting: PNG, transparent background.
6. Do not add image background.
7. Export both light and dark text variants.
```

### 21.3 Figma instruction

```text
1. Create frame: 2160 × 2700.
2. Set frame fill to 0% opacity or remove fill.
3. Create text groups:
   - series marker
   - stage number
   - stage title
   - primary line
   - caption fragment
   - Source Flame marker
4. Name all layers clearly.
5. Export frame as PNG.
6. Confirm transparent background.
```

### 21.4 Photoshop instruction

```text
1. New document: 2160 × 2700 px, transparent background.
2. Add text layers.
3. Keep artwork out of this file.
4. Add subtle shadow only if necessary.
5. Save working file as PSD.
6. Export overlay as PNG with transparency.
7. Place PNG over final artwork manually.
```

### 21.5 Procreate instruction

```text
1. Create canvas: 2160 × 2700 px.
2. Turn off background layer before export.
3. Add text layers or imported typography.
4. Keep text as sharp as possible.
5. Export PNG.
6. Confirm transparency by opening over a coloured test background.
```

---

## 22. TEXT OVERLAY CONTENT LIBRARY

### 22.1 Title library

```text
Lived Alchemy
```

```text
How experience becomes knowledge,
and knowledge becomes form.
```

```text
The smallest true vessel
carries the living charge.
```

```text
Experience becomes knowledge.
Knowledge becomes form.
```

```text
Preserve mystery through image.
Preserve clarity through structure.
```

---

### 22.2 Stage title library

```text
The Raw Signal
The Vessel
Distillation
Testing
Conversation
Study
Creation
Destruction
Projection
Refinement
Nature and Matter
Silence
```

---

### 22.3 Primary line library

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

---

### 22.4 Caption fragment library

```text
The raw signal arrives before meaning.
Experience needs somewhere to stay.
Signal becomes pattern.
Reality answers more cleanly than explanation.
Other minds expose what solitude cannot.
Structure forms around instinct.
The unseen becomes material.
Collapse can be part of refinement.
Not everything seen belongs to the world.
Perception becomes cleaner.
Matter teaches transformation.
What remains becomes usable.
```

---

### 22.5 Closing line library

```text
Between participation and witnessing,
the work becomes wisdom.
```

```text
Between forming matter
and letting it collapse,
experience becomes knowledge.
```

```text
What remains is lived alchemy.
```

```text
The image carries the charge.
The structure carries the movement.
The silence carries the rest.
```

---

## 23. SLIDE-BY-SLIDE OVERLAY PAIRING WITH VISUAL FIELD

| Stage | Visual field | Overlay type | Recommended text weight | Placement |
|---:|---|---|---|---|
| 1 | Dark earth / fragments | B or C | medium title + primary | lower-left |
| 2 | Hands / vessel / water | C | one-line only | lower-center |
| 3 | Steam / gold drops | B | title + primary | upper-left |
| 4 | Forge / anvil | C or B | strong primary | lower-left |
| 5 | Faces / threads | B | title + primary + small caption | upper-left |
| 6 | Books / diagrams | B | title + primary | upper-left |
| 7 | Hands / forming object | C | primary only | lower-center |
| 8 | Ash / cracked vessel | B | title + primary | upper-left or bottom |
| 9 | Mirror / landscape | C | primary only | bottom |
| 10 | Tuning fork / compass | B | title + primary | upper-left |
| 11 | Roots / tides / minerals | B | title + primary | top or bottom depending texture |
| 12 | Still water / horizon | C or D | primary + closing line | lower-center |

---

## 24. READABILITY CHECKS

### 24.1 Visual check

Pass only if:

- text is readable at phone size;
- transparent area remains dominant;
- the eye sees image first, text second or equal;
- the stage can be understood in under 3 seconds;
- the overlay does not block the key symbol.

### 24.2 Language check

Pass only if:

- no slide explains more than one movement;
- no caption fragment exceeds one short line unless in D-set;
- no abstract phrase repeats without visual reason;
- no private cosmology leaks into public overlay;
- no claim requires proof;
- no text implies diagnosis, legal conclusion, or final identity statement.

### 24.3 Sequence check

Pass only if the full overlay sequence reads:

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

If one slide feels like it belongs to a different series, adjust typography, marker, or wording.

---

## 25. FAILURE MODES

### 25.1 Visual failure modes

| Failure | Signal | Correction |
|---|---|---|
| Overlay becomes poster | Text dominates image | Use C-set minimal overlay |
| Text unreadable | Background too busy | Move text / use alternate colour |
| Too much gold | Looks decorative or mystical | Reduce gold to marker only |
| Too literal | Text repeats image | Cut caption fragment |
| Too abstract | Viewer has no entry | Use primary line only |
| Too much shadow | Text looks heavy | Move placement instead |
| Misaligned set | Slides feel unrelated | Reapply stage marker system |
| Over-designed | Typography performs | Remove decorative elements |

### 25.2 Language failure modes

| Failure | Signal | Correction |
|---|---|---|
| Generic self-help | Sounds like advice content | Return to material image |
| Decorative mysticism | Alchemy becomes aesthetic only | Use process language |
| Over-explanation | Caption explains the whole stage | Cut to one sentence |
| Grandiosity | Claims too total | Use grounded verbs |
| Private leakage | Requires backstory | Replace with public-facing threshold |
| Didacticism | Sounds like lecture | Let image carry more |
| Weak title | No charge | Use primary line as title |
| Too many nouns | Dense abstraction | Use verb + object |

---

## 26. VALIDATION PROTOCOL

### 26.1 Overlay validation pass

For each overlay, answer:

```text
1. Does it have transparent background?
2. Is the stage number correct?
3. Is the primary line exact?
4. Is the text readable at mobile size?
5. Does the overlay preserve the image?
6. Does the text carry only one movement?
7. Is the Source Flame subtle?
8. Are margins safe?
9. Is the filename correct?
10. Was a light and dark variant exported?
```

### 26.2 Manual application validation

After placing overlay onto artwork, answer:

```text
1. Does the text sit naturally in the image?
2. Does the image still carry the emotional charge?
3. Does the overlay clarify the stage?
4. Is any text redundant with the image?
5. Does the slide work without reading the caption?
6. Does the slide work at phone scale?
7. Does it belong to the same sequence?
8. Is the export clean?
```

### 26.3 Final sequence validation

The full 12-slide set passes only if:

```text
- It moves from raw to settled.
- Each slide carries one movement.
- The overlays are consistent but not rigid.
- The Source Flame is present but not distracting.
- The final slide settles rather than performs.
- The public viewer can enter without the private source architecture.
- The sequence can be manually applied to alternate image sets later.
```

---

## 27. WORKING EXPORT CHECKLIST

```md
## Lived Alchemy Overlay Export Checklist

### Project
- [ ] Project folder created
- [ ] `/overlays_light/` created
- [ ] `/overlays_dark/` created
- [ ] `/overlays_gold/` created
- [ ] `/markers/` created
- [ ] `/final_composites/` created
- [ ] `/source_files/` created

### Canvas
- [ ] 2160 × 2700 px master frame created
- [ ] Transparent background confirmed
- [ ] Safe margins applied
- [ ] Typography styles created
- [ ] Colour styles created

### Text
- [ ] Title overlay exported
- [ ] 12 B-set overlays exported
- [ ] 12 C-set overlays exported if needed
- [ ] Story overlays exported if needed
- [ ] Marker-only assets exported

### Variants
- [ ] Light text variants exported
- [ ] Dark text variants exported
- [ ] Gold marker variants exported

### Testing
- [ ] Tested on black background
- [ ] Tested on white background
- [ ] Tested on busy image
- [ ] Tested on final artwork
- [ ] Checked at phone size

### Final
- [ ] Filenames checked
- [ ] Sequence order checked
- [ ] Final composites exported separately
- [ ] Transparent overlay originals preserved
```

---

## 28. FOLDER STRUCTURE

```text
/lived_alchemy_overlay_project/
  /00_md_driver/
    LIVED_ALCHEMY_TRANSPARENT_PNG_TEXT_OVERLAY_DRIVER_v1_0.md

  /01_source_text/
    stage_text_library.md
    captions.md
    voiceover.md

  /02_overlay_source_files/
    lived_alchemy_overlay_master.fig
    lived_alchemy_overlay_master.psd
    lived_alchemy_overlay_master.canva_link.txt

  /03_overlays_light/
    LA_B01_STAGE01_RAW_SIGNAL_4x5_LIGHT_v1.png
    ...

  /04_overlays_dark/
    LA_B01_STAGE01_RAW_SIGNAL_4x5_DARK_v1.png
    ...

  /05_overlays_gold/
    LA_C01_EXPERIENCE_ENTERS_4x5_GOLD_v1.png
    ...

  /06_marker_assets/
    LA_G01_SOURCE_FLAME_DOT_GOLD_TRANSPARENT_v1.png
    LA_G02_SOURCE_FLAME_HORIZON_GOLD_TRANSPARENT_v1.png

  /07_background_artwork/
    stage_01_raw_signal.png
    stage_02_vessel.png
    ...

  /08_final_composites/
    LA_FINAL_01_RAW_SIGNAL_4x5_v1.png
    ...

  /09_exports_social/
    carousel_4x5/
    stories_9x16/
    thumbnails/

  /10_archive/
    previous_versions/
    rejected_overlays/
    notes/
```

---

## 29. PRODUCTION NOTES FOR MANUAL APPLICATION

### 29.1 When to use B-set

Use B-set when:

- the slide needs sequence clarity;
- the visual is atmospheric but not self-explanatory;
- stage title helps viewer enter;
- carousel is being posted without long caption.

### 29.2 When to use C-set

Use C-set when:

- the background image is powerful;
- stage title feels redundant;
- the sequence is already established;
- the artwork should feel less designed;
- the post should feel more gallery-like.

### 29.3 When to use D-set

Use D-set when:

- PDF / website context allows slower reading;
- image has quiet negative space;
- the overlay functions like wall text;
- the piece is being presented as visual essay.

### 29.4 When to use marker-only overlays

Use marker-only overlays when:

- a title already exists elsewhere;
- the image needs only continuity;
- the work is used in a reel;
- text would weaken the visual;
- a silent slide is required.

---

## 30. FINAL TEXT LOCK

The following text is locked for the primary public sequence.

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

## 31. FINAL CLOSING OVERLAY OPTIONS

### Closing Option 1 — Minimal

```text
What remains
is lived alchemy.
```

### Closing Option 2 — Balanced

```text
Experience becomes knowledge.
Knowledge becomes form.

What remains
is lived alchemy.
```

### Closing Option 3 — Poetic

```text
Between participation and witnessing,
between forming matter and letting it collapse,
the work becomes wisdom.
```

### Closing Option 4 — Silent

```text
Silence lets it settle.
```

Use Option 4 if the final image is strong enough.

---

## 32. SHIP STATE

Minimum shippable state:

```text
1 title overlay
+ 12 primary stage overlays
+ 2 colour variants
+ final closing overlay
+ Source Flame marker
```

Full shippable state:

```text
4 title overlays
+ 12 B-set overlays
+ 12 C-set overlays
+ 12 D-set overlays
+ story overlays
+ website overlays
+ marker assets
+ export manifest
+ validation checklist
```

Do not claim production is complete until actual PNG files exist and have been checked over test backgrounds.

---

## 33. CHANGE LOG

| Version | Date | Change |
|---|---:|---|
| 1.0 | 2026-04-27 | Initial transparent PNG text overlay driver for Lived Alchemy visual sequence |

---

## 34. FINAL OPERATING RULE

```text
The overlay is not the work.
The overlay is the threshold.

The image carries charge.
The structure carries movement.
The text gives entry.
The silence gives depth.
```

End.
