#!/usr/bin/env python3
from pathlib import Path
import re
import sys
from datetime import datetime, timezone

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"

index_path = PROJECT / "index.html"
styles_path = PROJECT / "styles.css"
component_html_path = PROJECT / "components" / "clarity-gap-diagnostic-panel" / "problem_section.html"
component_css_path = PROJECT / "components" / "clarity-gap-diagnostic-panel" / "problem_section.css"

for required in [index_path, styles_path, component_html_path, component_css_path]:
    if not required.exists():
        raise SystemExit(f"Missing required file: {required}")

index = index_path.read_text(encoding="utf-8")
styles = styles_path.read_text(encoding="utf-8")
new_section = component_html_path.read_text(encoding="utf-8").strip()
new_css = component_css_path.read_text(encoding="utf-8").strip()

pattern = re.compile(
    r'<section id="problem"[\s\S]*?</section>\s*(?=<section id="pathway"|<section id="includes"|<section)',
    re.MULTILINE
)

if not pattern.search(index):
    raise SystemExit("Could not locate existing #problem section for replacement.")

index = pattern.sub(new_section + "\n\n", index, count=1)

if "Clarity Gap Diagnostic Panel v0.1.0" not in styles:
    styles = styles.rstrip() + "\n\n" + new_css + "\n"

index = re.sub(r'script\.js\?v=[^"]+', 'script.js?v=0.1.4', index)

index_path.write_text(index, encoding="utf-8", newline="\n")
styles_path.write_text(styles, encoding="utf-8", newline="\n")

patched_index = index_path.read_text(encoding="utf-8")
patched_styles = styles_path.read_text(encoding="utf-8")
problem_start = patched_index.find('id="problem"')
pathway_start = patched_index.find('id="pathway"')
problem_slice = patched_index[problem_start:pathway_start] if pathway_start != -1 else patched_index[problem_start:]

checks = {
    "one_problem_section": patched_index.count('id="problem"') == 1,
    "section_role_present": 'data-section-role="problem"' in patched_index,
    "asset_role_present": 'data-asset-role="problem"' in patched_index,
    "diagnostic_panel_present": "diagnostic-panel" in patched_index,
    "diagnostic_css_present": "Clarity Gap Diagnostic Panel v0.1.0" in patched_styles,
    "legacy_problem_card_grid_removed": "card-grid four" not in problem_slice,
}

receipt_dir = PROJECT / "docs"
receipt_dir.mkdir(parents=True, exist_ok=True)
receipt = receipt_dir / "clarity_gap_patch_receipt_v0_1_0.md"
receipt.write_text(
    "# Clarity Gap Patch Receipt\n\n"
    f"Patched UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Status: {'PASS' if all(checks.values()) else 'FAIL'}\n\n"
    "Checks:\n" +
    "\n".join([f"- {key}: {value}" for key, value in checks.items()]) +
    "\n",
    encoding="utf-8",
    newline="\n"
)

if not all(checks.values()):
    print("PATCH QA: FAIL")
    for key, value in checks.items():
        if not value:
            print("-", key)
    sys.exit(1)

print("PATCH QA: PASS")
print(f"Receipt: {receipt}")
