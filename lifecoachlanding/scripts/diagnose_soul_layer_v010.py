#!/usr/bin/env python3
from pathlib import Path
import subprocess
from datetime import datetime, timezone
import sys

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"
BASE = "https://goldlevel.co.uk/lifecoachlanding"

errors = []
warnings = []
passes = []

def ok(x): passes.append(x)
def warn(x): warnings.append(x)
def fail(x): errors.append(x)
def read(p): return p.read_text(encoding="utf-8", errors="replace") if p.exists() else ""
def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT).strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip()

html = read(PROJECT / "index.html")
css = read(PROJECT / "styles.css")

local_checks = {
    "body soul layer active": "soul-layer-active" in html,
    "build marker": "GL_BUILD_SOUL_LAYER=0.1.0" in html,
    "route marker": "CHATRMD_LEVEL_ROUTE_v0_2_2" in html,
    "css v0.2.2": "styles.css?v=0.2.2" in html,
    "script v0.2.2": "script.js?v=0.2.2" in html,
    "css soul marker": "ANTI_STOCK_SOUL_LAYER_SYSTEM_v0_1_0" in css,
    "typography vars": "--soul-serif" in css and "--soul-sans" in css,
    "image treatment": "saturate(0.88)" in css and "sepia(0.10)" in css,
    "micro element rules": ".symptom-node::after" in css,
    "section atmosphere": "radial-gradient(circle at 9% 1%" in css,
}

for label, value in local_checks.items():
    ok("local " + label) if value else fail("local failed: " + label)

stamp = int(datetime.now(timezone.utc).timestamp())
live_index = Path.home() / ".gl_live_soul_layer_index.html"
live_css = Path.home() / ".gl_live_soul_layer_styles.css"

code_index = run(f'curl -L -s -o "{live_index}" -w "%{{http_code}}" "{BASE}/index.html?cb={stamp}"')
code_css = run(f'curl -L -s -o "{live_css}" -w "%{{http_code}}" "{BASE}/styles.css?v=0.2.2&cb={stamp}"')

if code_index == "200": ok("live index HTTP 200")
else: warn(f"live index HTTP {code_index}")

if code_css == "200": ok("live CSS HTTP 200")
else: warn(f"live CSS HTTP {code_css}")

live_html = read(live_index)
live_styles = read(live_css)

if "GL_BUILD_SOUL_LAYER=0.1.0" in live_html:
    ok("live build marker present")
else:
    warn("live build marker not present yet")

if "styles.css?v=0.2.2" in live_html:
    ok("live cache-busted CSS reference present")
else:
    warn("live cache-busted CSS reference not present yet")

if "ANTI_STOCK_SOUL_LAYER_SYSTEM_v0_1_0" in live_styles:
    ok("live soul CSS marker present")
else:
    warn("live soul CSS marker not present yet")

report = PROJECT / "docs" / "soul_layer_diagnostic_report_v0_1_0.md"
report.write_text(
    "# Soul Layer Diagnostic Report v0.1.0\n\n"
    f"Generated UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Errors: {len(errors)}\n"
    f"Warnings: {len(warnings)}\n\n"
    "## Passes\n\n" + "\n".join(f"- PASS: {p}" for p in passes) +
    "\n\n## Warnings\n\n" + ("\n".join(f"- WARN: {w}" for w in warnings) if warnings else "- None") +
    "\n\n## Errors\n\n" + ("\n".join(f"- FAIL: {e}" for e in errors) if errors else "- None") +
    "\n",
    encoding="utf-8",
    newline="\n"
)

print("== ANTI-STOCK SOUL LAYER DIAGNOSTIC v0.1.0 ==")
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

sys.exit(1 if errors else 0)
