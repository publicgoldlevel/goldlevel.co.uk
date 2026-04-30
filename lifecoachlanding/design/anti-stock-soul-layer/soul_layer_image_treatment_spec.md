# Soul Layer Image Treatment Spec v0.1.0

## Problem

Raw images can feel like stock inserts when their boundaries are too visible and their color world does not blend into the page.

## Treatment stack

Apply:

```css
filter: saturate(0.88) sepia(0.10) contrast(0.96) brightness(1.02);
```

Then add pseudo-element overlays:

- warm cream light leak;
- gold/sage matte glaze;
- soft radial glow;
- subtle boundary line.

## Allowed transformations

- matte tinting;
- feathered / rounded masks;
- soft overlay gradients;
- visual halos;
- low-opacity ambient reuse.

## Avoid

- text baked into images;
- hard square crops;
- unrelated decorative stock photos;
- overlay text that damages readability.
