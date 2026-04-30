#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
import subprocess
import re
import hashlib
import sys

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"
BASE = "https://goldlevel.co.uk/lifecoachlanding"
STAMP = str(int(datetime.now(timezone.utc).timestamp()))

OUT_DIR = PROJECT / "docs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

LIVE_INDEX = Path.home() / ".gl_forensic_live_index.html"
LIVE_CSS = Path.home() / ".gl_forensic_live_styles.css"
LOCAL_INDEX = PROJECT / "index.html"
LOCAL_CSS = PROJECT / "styles.css"

errors = []
warnings = []
passes = []
signals = []

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT).strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip()

def fetch(url, out):
    code = run(f'curl -L -s -o "{out}" -w "%{{http_code}}" "{url}"')
    return code

def head(url):
    return run(f'curl -I -L -s "{url}" | head -n 20')

def read(path):
    return path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""

def sha(text):
    return hashlib.sha256(text.encode("utf-8", errors="replace")).hexdigest()[:16]

def ok(x): passes.append(x)
def warn(x): warnings.append(x)
def fail(x): errors.append(x)
def signal(k, v): signals.append((k, v))

print("== GOLDLEVEL / ChatRMD Visual Forensics ==")
print("UTC:", datetime.now(timezone.utc).isoformat())
print("Canonical:", BASE)
print()

# ------------------------------------------------------------
# 1. Fetch canonical live files with cache bypass
# ------------------------------------------------------------
index_code = fetch(f"{BASE}/index.html?cb={STAMP}", LIVE_INDEX)
css_code = fetch(f"{BASE}/styles.css?cb={STAMP}", LIVE_CSS)

signal("live_index_http", index_code)
signal("live_css_http", css_code)

if index_code == "200":
    ok("canonical live index returns 200")
else:
    fail(f"canonical live index returned {index_code}")

if css_code == "200":
    ok("canonical live styles.css returns 200")
else:
    fail(f"canonical live styles.css returned {css_code}")

local_html = read(LOCAL_INDEX)
local_css = read(LOCAL_CSS)
live_html = read(LIVE_INDEX)
live_css = read(LIVE_CSS)

signal("local_index_sha16", sha(local_html))
signal("live_index_sha16", sha(live_html))
signal("local_css_sha16", sha(local_css))
signal("live_css_sha16", sha(live_css))

if sha(local_html) == sha(live_html):
    ok("local and live index hashes match")
else:
    warn("local and live index hashes differ; deployment or transformation layer may be involved")

if sha(local_css) == sha(live_css):
    ok("local and live CSS hashes match")
else:
    warn("local and live CSS hashes differ; browser may be seeing a different stylesheet")

# ------------------------------------------------------------
# 2. Extract stylesheet href from live HTML
# ------------------------------------------------------------
hrefs = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', live_html)
hrefs += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', live_html)
hrefs = list(dict.fromkeys(hrefs))

if hrefs:
    ok(f"stylesheet links found: {hrefs}")
else:
    fail("no stylesheet link found in live HTML")

cache_bust_present = any("?v=" in h or "?cb=" in h for h in hrefs)
if cache_bust_present:
    ok("stylesheet link has cache-busting query")
else:
    warn("stylesheet link has no cache-busting query; browser may keep old CSS")

for href in hrefs:
    full = href if href.startswith("http") else f"{BASE}/{href.lstrip('./')}"
    signal(f"stylesheet_head_{href}", head(full).replace("\n", " | "))

# ------------------------------------------------------------
# 3. Problem-section structural checks
# ------------------------------------------------------------
def section_slice(html, start_id, next_id):
    start = html.find(f'id="{start_id}"')
    end = html.find(f'id="{next_id}"')
    if start == -1:
        return ""
    return html[start:end if end != -1 else None]

local_problem = section_slice(local_html, "problem", "pathway")
live_problem = section_slice(live_html, "problem", "pathway")

if live_problem:
    ok("live #problem section extracted")
else:
    fail("could not extract live #problem section")

checks = {
    "component marker": 'data-component="clarity-gap-diagnostic-panel"' in live_problem,
    "problem asset role": 'data-asset-role="problem"' in live_problem,
    "problem webp route": 'assets/generated/problem/problem-4x5-768.webp' in live_problem,
    "no ordered list in problem": "<ol" not in live_problem and "</ol>" not in live_problem,
    "no legacy card grid in problem": "card-grid four" not in live_problem,
    "no markdown markers in problem": "###" not in live_problem and "## Meaningful" not in live_problem,
    "four symptom rows": live_problem.count('class="symptom-item"') == 4,
    "four symptom numbers": live_problem.count('class="symptom-number"') == 4,
}

for label, passed in checks.items():
    if passed:
        ok(f"problem structure: {label}")
    else:
        fail(f"problem structure failed: {label}")

signal("live_problem_sha16", sha(live_problem))
signal("local_problem_sha16", sha(local_problem))

if sha(local_problem) == sha(live_problem):
    ok("local and live problem section hashes match")
else:
    warn("local and live problem section hashes differ")

# ------------------------------------------------------------
# 4. CSS presence and cascade checks
# ------------------------------------------------------------
required_css_tokens = [
    "Clarity Gap Diagnostic Panel v0.1.1",
    ".diagnostic-panel",
    ".diagnostic-media",
    ".diagnostic-copy",
    ".panel-label",
    ".symptom-list",
    ".symptom-item",
    ".symptom-number",
    ".panel-bridge",
    "object-fit: contain",
]

for token in required_css_tokens:
    if token in live_css:
        ok(f"live CSS contains {token}")
    else:
        fail(f"live CSS missing {token}")

if "Clarity Gap Diagnostic Panel v0.1.0" in live_css:
    warn("old v0.1.0 clarity-gap CSS still present live")
else:
    ok("old v0.1.0 clarity-gap CSS absent live")

# Count selector appearances and find line order.
css_lines = live_css.splitlines()
selector_report = {}
for selector in [".diagnostic-panel", ".symptom-list", ".symptom-item", ".diagnostic-media", ".section-asset", ".media-frame", ".card-grid.four", ".info-card"]:
    positions = [i + 1 for i, line in enumerate(css_lines) if selector in line]
    selector_report[selector] = positions
    signal(f"selector_lines_{selector}", positions)

# Heuristic: if diagnostic CSS exists but appears before broad media/card/grid rules, later rules may reduce visual effect.
diag_first_line = selector_report.get(".diagnostic-panel", [None])[0]
later_possible_overrides = []
if diag_first_line:
    for selector in [".section-asset", ".media-frame", ".info-card", ".card-grid.four"]:
        for line_no in selector_report.get(selector, []):
            if line_no > diag_first_line:
                later_possible_overrides.append((selector, line_no))

if later_possible_overrides:
    warn("possible later broad CSS rules after .diagnostic-panel: " + str(later_possible_overrides[:20]))
else:
    ok("no obvious later broad CSS rules after .diagnostic-panel")

# Detect duplicate diagnostic block or selector fragmentation.
if live_css.count(".diagnostic-panel") > 2:
    warn(f".diagnostic-panel appears {live_css.count('.diagnostic-panel')} times; inspect duplicate/conflicting rules")
else:
    ok(".diagnostic-panel selector count is low")

# ------------------------------------------------------------
# 5. Asset serving check
# ------------------------------------------------------------
webp_url = f"{BASE}/assets/generated/problem/problem-4x5-768.webp?cb={STAMP}"
webp_head = head(webp_url)
signal("problem_webp_head", webp_head.replace("\n", " | "))

if "200" in webp_head and "image/webp" in webp_head:
    ok("problem WebP served as image/webp HTTP 200")
else:
    fail("problem WebP not served correctly")

# ------------------------------------------------------------
# 6. Browser-cache risk assessment
# ------------------------------------------------------------
css_head = head(f"{BASE}/styles.css")
signal("styles_head", css_head.replace("\n", " | "))

cache_risk = False
if not cache_bust_present:
    cache_risk = True
if "max-age" in css_head.lower() and not cache_bust_present:
    cache_risk = True

if cache_risk:
    warn("browser cache risk is active: stylesheet has no ?v= and may be cached")
else:
    ok("browser cache risk low")

# ------------------------------------------------------------
# 7. Decision classification
# ------------------------------------------------------------
technical_core_pass = (
    not errors and
    'data-component="clarity-gap-diagnostic-panel"' in live_problem and
    "Clarity Gap Diagnostic Panel v0.1.1" in live_css and
    "200" in webp_head and
    "image/webp" in webp_head
)

if errors:
    decision = "REPAIR_TECHNICAL_WIRING"
elif cache_risk:
    decision = "CACHE_BUST_AND_RETEST_BROWSER"
elif warnings:
    decision = "INSPECT_WARNINGS_THEN_VISUAL_STRENGTH_PASS"
else:
    decision = "VISUAL_STRENGTH_PASS_READY"

signal("decision", decision)

# ------------------------------------------------------------
# 8. Write report
# ------------------------------------------------------------
report = OUT_DIR / "visual_forensics_report.md"
report.write_text(
    "# Visual Forensics Report\n\n"
    f"Generated UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
    f"Canonical URL: {BASE}\n\n"
    f"Decision: `{decision}`\n\n"
    "## Signals\n\n" +
    "\n".join([f"- `{k}`: `{v}`" for k, v in signals]) +
    "\n\n## Passes\n\n" +
    "\n".join([f"- PASS: {p}" for p in passes]) +
    "\n\n## Warnings\n\n" +
    ("\n".join([f"- WARN: {w}" for w in warnings]) if warnings else "- None") +
    "\n\n## Errors\n\n" +
    ("\n".join([f"- FAIL: {e}" for e in errors]) if errors else "- None") +
    "\n\n## Live problem section preview\n\n```html\n" +
    live_problem[:5000] +
    "\n```\n",
    encoding="utf-8",
    newline="\n"
)

print()
print("== VISUAL FORENSICS RESULT ==")
print("Decision:", decision)
print("Passes:", len(passes))
print("Warnings:", len(warnings))
print("Errors:", len(errors))
print("Report:", report)

if warnings:
    print("\n== WARNINGS ==")
    for w in warnings:
        print("-", w)

if errors:
    print("\n== ERRORS ==")
    for e in errors:
        print("-", e)

print("\n== SELECTOR LINE SIGNALS ==")
for selector, lines in selector_report.items():
    print(selector, "=>", lines[:20])

raise SystemExit(1 if errors else 0)
