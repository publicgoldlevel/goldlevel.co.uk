#!/usr/bin/env python3
from pathlib import Path
import re
from datetime import datetime, timezone
import sys

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"

index_path = PROJECT / "index.html"
styles_path = PROJECT / "styles.css"
soul_css_path = PROJECT / "components" / "soul-layer" / "soul_layer_tokens.css"

for p in [index_path, styles_path, soul_css_path]:
    if not p.exists():
        raise SystemExit(f"Missing required file: {p}")

html = index_path.read_text(encoding="utf-8")
css = styles_path.read_text(encoding="utf-8")
soul_css = soul_css_path.read_text(encoding="utf-8").strip()

# Activate body class.
html = re.sub(
    r'<body([^>]*)>',
    lambda m: '<body' + (
        (m.group(1) if 'class=' in m.group(1) else m.group(1) + ' class="soul-layer-active"')
    ) + '>',
    html,
    count=1
)

# If body already had class, merge class safely.
html = re.sub(
    r'<body([^>]*class=["\'])([^"\']*)(["\'][^>]*)>',
    lambda m: '<body' + m.group(1) + (
        m.group(2) if 'soul-layer-active' in m.group(2).split() else (m.group(2) + ' soul-layer-active').strip()
    ) + m.group(3) + '>',
    html,
    count=1
)

VERSION = "0.2.2"
html = re.sub(
    r'href="styles\.css(?:\?v=[^"]*)?"',
    f'href="styles.css?v={VERSION}"',
    html
)
html = re.sub(
    r'src="script\.js(?:\?v=[^"]*)?"',
    f'src="script.js?v={VERSION}"',
    html
)

marker = f"<!-- GL_BUILD_SOUL_LAYER=0.1.0 ROUTE=CHATRMD_LEVEL_ROUTE_v0_2_2 UTC={datetime.now(timezone.utc).isoformat()} -->"
if "GL_BUILD_SOUL_LAYER=" in html:
    html = re.sub(r'<!-- GL_BUILD_SOUL_LAYER=.*?-->', marker, html)
else:
    html = html.replace("</head>", f"  {marker}\n</head>")

# Remove previous block then append.
css = re.sub(
    r'/\* ANTI_STOCK_SOUL_LAYER_SYSTEM_v0_1_0 \*/[\s\S]*?(?=/\*|$)',
    '',
    css,
    flags=re.MULTILINE
)
css = css.rstrip() + "\n\n" + soul_css + "\n"

index_path.write_text(html, encoding="utf-8", newline="\n")
styles_path.write_text(css, encoding="utf-8", newline="\n")

# QA
html2 = index_path.read_text(encoding="utf-8")
css2 = styles_path.read_text(encoding="utf-8")
checks = {
    "body_soul_layer_active": "soul-layer-active" in html2,
    "html_build_marker": "GL_BUILD_SOUL_LAYER=0.1.0" in html2,
    "route_marker": "CHATRMD_LEVEL_ROUTE_v0_2_2" in html2,
    "css_cache_bust": "styles.css?v=0.2.2" in html2,
    "js_cache_bust": "script.js?v=0.2.2" in html2,
    "css_marker": "ANTI_STOCK_SOUL_LAYER_SYSTEM_v0_1_0" in css2,
    "css_body_scope": "body.soul-layer-active" in css2,
    "css_image_treatment": "sepia(0.10)" in css2,
    "css_micro_elements": "symptom-node::after" in css2,
}

receipt_dir = PROJECT / "docs"
receipt_dir.mkdir(parents=True, exist_ok=True)
receipt_path = receipt_dir / "soul_layer_receipt_v0_1_0.md"
receipt_path.write_text(
    "# Anti-Stock Soul Layer Receipt v0.1.0\n\n"
    f"Patched UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Status: {'PASS' if all(checks.values()) else 'FAIL'}\n\n"
    "## Checks\n\n" +
    "\n".join([f"- {k}: {v}" for k, v in checks.items()]) +
    "\n",
    encoding="utf-8",
    newline="\n"
)

if not all(checks.values()):
    print("SOUL LAYER PATCH QA: FAIL")
    for k, v in checks.items():
        if not v:
            print("-", k)
    sys.exit(1)

print("SOUL LAYER PATCH QA: PASS")
print(f"Receipt: {receipt_path}")
