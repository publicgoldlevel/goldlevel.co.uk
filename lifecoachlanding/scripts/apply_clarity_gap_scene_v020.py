#!/usr/bin/env python3
from pathlib import Path
import re
import sys
from datetime import datetime, timezone

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"

index_path = PROJECT / "index.html"
styles_path = PROJECT / "styles.css"
component_html_path = PROJECT / "components" / "clarity-gap-scene" / "problem_scene.html"
component_css_path = PROJECT / "components" / "clarity-gap-scene" / "problem_scene.css"
expected_asset = PROJECT / "assets" / "generated" / "problem" / "problem-4x5-768.webp"

required = [index_path, styles_path, component_html_path, component_css_path, expected_asset]
missing = [str(p) for p in required if not p.exists()]
if missing:
    raise SystemExit("Missing required files:\n" + "\n".join(missing))

index = index_path.read_text(encoding="utf-8")
styles = styles_path.read_text(encoding="utf-8")

new_section = component_html_path.read_text(encoding="utf-8").strip()
new_css = component_css_path.read_text(encoding="utf-8").strip()

pattern = re.compile(
    r'<section\s+id=["\']problem["\'][\s\S]*?</section>\s*(?=<section\s+id=["\']pathway["\']|<section\s+id=["\']includes["\']|<section\s)',
    re.MULTILINE
)

if not pattern.search(index):
    raise SystemExit("Could not locate existing #problem section for scene replacement.")

index = pattern.sub(new_section + "\n\n", index, count=1)

# Remove previous scene integration block if re-running.
styles = re.sub(
    r'/\* CLARITY_GAP_SCENE_INTEGRATION_v0_2_0 \*/[\s\S]*?(?=/\*|$)',
    '',
    styles,
    flags=re.MULTILINE
)

# Keep older diagnostic CSS in place but append scene block after it to dominate cascade.
styles = styles.rstrip() + "\n\n" + new_css + "\n"

VERSION = "0.2.0"
index = re.sub(
    r'href="styles\.css(?:\?v=[^"]*)?"',
    f'href="styles.css?v={VERSION}"',
    index
)
index = re.sub(
    r'src="script\.js(?:\?v=[^"]*)?"',
    f'src="script.js?v={VERSION}"',
    index
)

marker = f"<!-- GL_BUILD_CLARITY_GAP_SCENE={VERSION} UTC={datetime.now(timezone.utc).isoformat()} -->"
if "GL_BUILD_CLARITY_GAP_SCENE=" not in index:
    index = index.replace("</head>", f"  {marker}\n</head>")
else:
    index = re.sub(r'<!-- GL_BUILD_CLARITY_GAP_SCENE=.*?-->', marker, index)

index_path.write_text(index, encoding="utf-8", newline="\n")
styles_path.write_text(styles, encoding="utf-8", newline="\n")

html = index_path.read_text(encoding="utf-8")
css = styles_path.read_text(encoding="utf-8")
start = html.find('id="problem"')
end = html.find('id="pathway"')
problem = html[start:end if end != -1 else None]

checks = {
    "one_problem_section": html.count('id="problem"') == 1,
    "scene_marker_present": 'data-component="clarity-gap-scene-integration"' in problem,
    "scene_version_present": 'data-scene-version="0.2.0"' in problem,
    "scene_visual_field_present": 'class="scene-visual-field"' in problem,
    "scene_meaning_field_present": 'class="scene-meaning-field"' in problem,
    "symptom_node_count": problem.count('class="symptom-node"') == 4,
    "no_ordered_list_in_problem": "<ol" not in problem and "</ol>" not in problem,
    "no_legacy_card_grid_in_problem": "card-grid four" not in problem,
    "problem_webp_referenced": "assets/generated/problem/problem-4x5-768.webp" in problem,
    "scene_css_marker_present": "CLARITY_GAP_SCENE_INTEGRATION_v0_2_0" in css,
    "cache_bust_css": "styles.css?v=0.2.0" in html,
    "cache_bust_js": "script.js?v=0.2.0" in html,
}

receipt_dir = PROJECT / "docs"
receipt_dir.mkdir(parents=True, exist_ok=True)
receipt_path = receipt_dir / "clarity_gap_scene_receipt_v0_2_0.md"
receipt_path.write_text(
    "# Clarity Gap Scene Integration Receipt v0.2.0\n\n"
    f"Patched UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Status: {'PASS' if all(checks.values()) else 'FAIL'}\n\n"
    "## Checks\n\n" +
    "\n".join([f"- {k}: {v}" for k, v in checks.items()]) +
    "\n",
    encoding="utf-8",
    newline="\n"
)

if not all(checks.values()):
    print("SCENE PATCH QA: FAIL")
    for key, value in checks.items():
        if not value:
            print("-", key)
    raise SystemExit(1)

print("SCENE PATCH QA: PASS")
print(f"Receipt: {receipt_path}")
