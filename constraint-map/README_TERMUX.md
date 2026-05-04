# 48-Hour Constraint Map HTML Build

Static, dependency-free website build for Android / Termux.

## Files

- `index.html` — full static landing page + micro-fit form + paid intake form
- `assets/style.css` — local styling
- `assets/app.js` — local offline form classification, copy, and JSON export
- `templates/diagnostic-template.md` — one-page diagnostic template
- `templates/intake-form.md` — paid intake form as Markdown
- `logs/laps-receipt-log-schema.csv` — receipt / pipeline log schema
- `logs/self-learning-update-table.csv` — learning loop schema
- `run-termux.sh` — optional local server launcher

## Install / run in Termux from Android Downloads

Assuming the zip is in `/sdcard/Download`:

```sh
termux-setup-storage
cd /sdcard/Download
unzip constraint_map_html_build.zip -d constraint-map-site
cd constraint-map-site
python -m http.server 8080
```

Then open Android browser:

```text
http://127.0.0.1:8080
```

## No server mode

You can also open `index.html` directly in a browser or file viewer. The copy/download buttons are more reliable when served through `python -m http.server`.

## Edit points

In `index.html`, replace:

- payment link placeholder
- intake link placeholder if you move intake to a form provider
- brand/contact details
- currency if using GBP instead of USD

## Operational rule

Do not broaden the offer. This build sells only the 48-Hour Constraint Map:
one live bottleneck, one-page map, 48-hour delivery after payment + completed intake.
