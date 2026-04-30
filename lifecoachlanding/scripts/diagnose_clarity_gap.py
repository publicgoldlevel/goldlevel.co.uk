#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"
index_path = PROJECT / "index.html"
styles_path = PROJECT / "styles.css"
script_path = PROJECT / "script.js"
asset_path = PROJECT / "assets" / "generated" / "problem" / "problem-4x5-768.webp"

errors = []
warnings = []

if not index_path.exists():
    errors.append("Missing lifecoachlanding/index.html")
if not styles_path.exists():
    errors.append("Missing lifecoachlanding/styles.css")
if not script_path.exists():
    errors.append("Missing lifecoachlanding/script.js")

if errors:
    print("DIAGNOSE: FAIL")
    print("\n".join(f"- {e}" for e in errors))
    sys.exit(1)

html = index_path.read_text(encoding="utf-8")
css = styles_path.read_text(encoding="utf-8")
js = script_path.read_text(encoding="utf-8")

problem_start = html.find('id="problem"')
pathway_start = html.find('id="pathway"')
problem_slice = html[problem_start:pathway_start] if problem_start != -1 and pathway_start != -1 else ""

if problem_start == -1:
    errors.append("No #problem section found")
if 'data-component="clarity-gap-diagnostic-panel"' not in html:
    errors.append("The corrected diagnostic component is not installed")
if "Clarity Gap Diagnostic Panel v0.1.1" not in css:
    errors.append("The v0.1.1 diagnostic CSS is not installed in styles.css")
if "<ol" in problem_slice:
    errors.append("Problem section still uses <ol>; browser numbers will appear")
if "card-grid four" in problem_slice:
    errors.append("Legacy card-grid four still exists in the problem section")
if "###" in problem_slice or "## Meaningful" in problem_slice:
    errors.append("Literal Markdown markers are present inside the HTML problem section")
if not asset_path.exists():
    errors.append("problem-4x5-768.webp is missing; browser will show alt text instead of image")
if 'href="styles.css"' not in html:
    errors.append("index.html does not link styles.css")
if 'const CONTACT_EMAIL = "info@goldlevel.co.uk";' not in js:
    errors.append("script.js missing CONTACT_EMAIL constant")

if "symptom-list" in html and "symptom-list" not in css:
    errors.append("HTML uses symptom-list but CSS does not define it")

if errors:
    print("DIAGNOSE: FAIL")
    for e in errors:
        print("-", e)
    sys.exit(1)

print("DIAGNOSE: PASS")
if warnings:
    for w in warnings:
        print("WARN:", w)
