#!/usr/bin/env python3
from pathlib import Path
import re
import sys
import subprocess
from datetime import datetime, timezone

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"
BASE = "https://goldlevel.co.uk/lifecoachlanding"

errors = []
warnings = []
passes = []

def ok(x): passes.append(x)
def warn(x): warnings.append(x)
def fail(x): errors.append(x)

def read(path):
    return path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT).strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip()

index = read(PROJECT / "index.html")
css = read(PROJECT / "styles.css")

start = index.find('id="problem"')
end = index.find('id="pathway"')
problem = index[start:end if end != -1 else None] if start != -1 else ""

if start != -1: ok("local #problem section found")
else: fail("local #problem section missing")

local_checks = {
    "scene marker": 'data-component="clarity-gap-scene-integration"' in problem,
    "scene version 0.2.0": 'data-scene-version="0.2.0"' in problem,
    "visual field": 'scene-visual-field' in problem,
    "meaning field": 'scene-meaning-field' in problem,
    "four symptom nodes": problem.count('class="symptom-node"') == 4,
    "no ol": "<ol" not in problem and "</ol>" not in problem,
    "no card-grid four": "card-grid four" not in problem,
    "problem webp exists": (PROJECT / "assets/generated/problem/problem-4x5-768.webp").exists(),
    "scene css marker": "CLARITY_GAP_SCENE_INTEGRATION_v0_2_0" in css,
    "css has clarity gap scene": ".clarity-gap-scene" in css,
    "css has symptom node": ".symptom-node" in css,
    "css has animation": "claritySceneIn" in css,
    "cache bust css": "styles.css?v=0.2.0" in index,
}

for label, passed in local_checks.items():
    if passed: ok("local " + label)
    else: fail("local failed: " + label)

# Optional live checks if curl is available.
stamp = int(datetime.now(timezone.utc).timestamp())
live_index = Path.home() / ".gl_live_scene_v020_index.html"
live_css = Path.home() / ".gl_live_scene_v020_styles.css"
code_index = run(f'curl -L -s -o "{live_index}" -w "%{{http_code}}" "{BASE}/index.html?cb={stamp}"')
code_css = run(f'curl -L -s -o "{live_css}" -w "%{{http_code}}" "{BASE}/styles.css?v=0.2.0&cb={stamp}"')

if code_index == "200": ok("live index HTTP 200")
else: warn(f"live index HTTP {code_index}")

if code_css == "200": ok("live CSS HTTP 200")
else: warn(f"live CSS HTTP {code_css}")

live_html = read(live_index)
live_styles = read(live_css)

if 'data-component="clarity-gap-scene-integration"' in live_html:
    ok("live scene marker present")
else:
    warn("live scene marker not present yet")

if "GL_BUILD_CLARITY_GAP_SCENE=0.2.0" in live_html:
    ok("live build marker present")
else:
    warn("live build marker not present yet")

if "CLARITY_GAP_SCENE_INTEGRATION_v0_2_0" in live_styles:
    ok("live scene CSS marker present")
else:
    warn("live scene CSS marker not present yet")

receipt_dir = PROJECT / "docs"
receipt_dir.mkdir(exist_ok=True)
report = receipt_dir / "scene_integration_report.md"
report.write_text(
    "# Scene Integration Diagnostic Report v0.2.0\n\n"
    f"Generated UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Errors: {len(errors)}\n\n"
    f"Warnings: {len(warnings)}\n\n"
    "## Passes\n\n" + "\n".join(f"- PASS: {p}" for p in passes) +
    "\n\n## Warnings\n\n" + ("\n".join(f"- WARN: {w}" for w in warnings) if warnings else "- None") +
    "\n\n## Errors\n\n" + ("\n".join(f"- FAIL: {e}" for e in errors) if errors else "- None") +
    "\n",
    encoding="utf-8",
    newline="\n"
)

print("== CLARITY GAP SCENE DIAGNOSTIC v0.2.0 ==")
print("LOCAL:", "FAIL" if errors else "PASS")
print("PASSES:", len(passes))
print("WARNINGS:", len(warnings))
print("ERRORS:", len(errors))
print("REPORT:", report)

if warnings:
    print("\nWARNINGS:")
    for w in warnings:
        print("-", w)

if errors:
    print("\nERRORS:")
    for e in errors:
        print("-", e)

raise SystemExit(1 if errors else 0)
