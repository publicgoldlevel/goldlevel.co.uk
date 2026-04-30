#!/usr/bin/env python3
from pathlib import Path
import re
import json
import subprocess
from datetime import datetime, timezone

ROOT = Path.cwd()
PROJECT = ROOT / "lifecoachlanding"
errors = []
warnings = []
passes = []

def ok(label): passes.append(label)
def warn(label): warnings.append(label)
def fail(label): errors.append(label)

def read(path):
    return path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT).strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip()

print("== GOLDLEVEL / ChatRMD Life Coach Full Diagnostic v0.1.2 ==")
print("UTC:", datetime.now(timezone.utc).isoformat())
print("Repo:", ROOT)
print("Project:", PROJECT)
print()

if (ROOT / ".git").exists():
    ok("Git repo exists")
else:
    fail("No .git folder found")

branch = run("git branch --show-current")
remote = run("git remote -v")
status = run("git status --short")

if branch == "main":
    ok("Current branch is main")
else:
    warn(f"Current branch is not main: {branch!r}")

if "git@github.com:publicgoldlevel/goldlevel.co.uk.git" in remote:
    ok("Git SSH remote is correct")
else:
    warn("Git SSH remote may not be correct:\n" + remote)

for f in ["index.html", "styles.css", "script.js"]:
    path = PROJECT / f
    if path.exists():
        ok(f"Found lifecoachlanding/{f}")
    else:
        fail(f"Missing lifecoachlanding/{f}")

html = read(PROJECT / "index.html")
css = read(PROJECT / "styles.css")
js = read(PROJECT / "script.js")

if 'href="styles.css"' in html:
    ok("index.html references styles.css")
else:
    fail("index.html does not reference styles.css")

if 'src="script.js' in html:
    ok("index.html references script.js")
else:
    fail("index.html does not reference script.js")

if 'const CONTACT_EMAIL = "info@goldlevel.co.uk";' in js:
    ok("script.js contains info@goldlevel.co.uk")
else:
    fail("script.js missing info@goldlevel.co.uk")

for term in ["YOUR_EMAIL_HERE", "Email placeholder still active", "Replace YOUR_EMAIL_HERE"]:
    if term in html + css + js:
        fail(f"Legacy placeholder still present: {term}")
    else:
        ok(f"Legacy placeholder absent: {term}")

wrong_path_patterns = {
    "lifecoachlanding/assets/": "Inside lifecoachlanding/index.html, use assets/... not lifecoachlanding/assets/...",
    "/assets/generated/": "Absolute asset route can break GitHub project pages.",
    "public/assets/": "Old public path found.",
    "../assets/": "Parent-relative asset path found.",
    "assets/images/generated/": "Old generated path style found."
}

for pattern, message in wrong_path_patterns.items():
    if pattern in html + css + js:
        fail(f"Old/wrong path active: {pattern} — {message}")
    else:
        ok(f"No old/wrong path pattern: {pattern}")

# Strict asset parsing:
# Only capture complete local web/image/json/css/js asset filenames.
asset_refs = set()
asset_refs.update(re.findall(r'assets/generated/[A-Za-z0-9_./-]+?\.webp', html + css + js))
asset_refs.update(re.findall(r'assets/[A-Za-z0-9_./-]+?\.json', html + css + js))
asset_refs.update(re.findall(r'assets/[A-Za-z0-9_./-]+?\.svg', html + css + js))
asset_refs.update(re.findall(r'assets/[A-Za-z0-9_./-]+?\.png', html + css + js))
asset_refs.update(re.findall(r'assets/[A-Za-z0-9_./-]+?\.jpg', html + css + js))
asset_refs.update(re.findall(r'assets/[A-Za-z0-9_./-]+?\.jpeg', html + css + js))

missing_assets = []
for ref in sorted(asset_refs):
    if not (PROJECT / ref).exists():
        missing_assets.append(ref)

if missing_assets:
    fail("Missing referenced assets:\n" + "\n".join(f"  - {m}" for m in missing_assets[:80]))
else:
    ok(f"All referenced local assets exist: {len(asset_refs)} refs checked")

problem_start = html.find('id="problem"')
pathway_start = html.find('id="pathway"')
problem_slice = html[problem_start:pathway_start] if problem_start != -1 and pathway_start != -1 else ""

if problem_start != -1:
    ok("#problem section found")
else:
    fail("#problem section missing")

if 'data-component="clarity-gap-diagnostic-panel"' in html:
    ok("Clarity gap diagnostic component installed")
else:
    fail("Clarity gap diagnostic component not installed")

if "Clarity Gap Diagnostic Panel v0.1.1" in css:
    ok("Clarity Gap v0.1.1 CSS installed")
else:
    fail("Clarity Gap v0.1.1 CSS missing")

if "Clarity Gap Diagnostic Panel v0.1.0" in css:
    warn("Old Clarity Gap v0.1.0 CSS still present")
else:
    ok("Old Clarity Gap v0.1.0 CSS absent")

if "<ol" in problem_slice or "</ol>" in problem_slice:
    fail("Problem section still contains <ol>")
else:
    ok("Problem section does not use <ol>")

if "card-grid four" in problem_slice:
    fail("Legacy card-grid four still present inside problem section")
else:
    ok("Legacy problem card grid absent")

if "###" in problem_slice or "## Meaningful" in problem_slice:
    fail("Literal Markdown markers visible inside problem section")
else:
    ok("No Markdown heading markers inside problem section")

problem_asset = PROJECT / "assets/generated/problem/problem-4x5-768.webp"
if problem_asset.exists():
    ok("Problem WebP exists")
else:
    fail("Problem WebP missing: assets/generated/problem/problem-4x5-768.webp")

manifest_candidates = [
    PROJECT / "assets/image_manifest.json",
    PROJECT / "assets/manifests/image_manifest.json",
]
registry_candidates = [
    PROJECT / "site_section_registry.json",
    PROJECT / "assets/manifests/site_section_registry.json",
]

manifest_path = next((p for p in manifest_candidates if p.exists()), None)
registry_path = next((p for p in registry_candidates if p.exists()), None)

if manifest_path:
    ok(f"Image manifest found: {manifest_path.relative_to(ROOT)}")
else:
    warn("No image manifest found")

if registry_path:
    ok(f"Section registry found: {registry_path.relative_to(ROOT)}")
else:
    warn("No section registry found")

if manifest_path and registry_path:
    try:
        manifest = json.loads(read(manifest_path))
        registry = json.loads(read(registry_path))

        sections = registry.get("sections", {})
        roles_from_registry = {v.get("image_role") for v in sections.values() if v.get("image_role")}
        roles_from_manifest = set(manifest.get("roles", {}).keys())

        missing_manifest_roles = roles_from_registry - roles_from_manifest
        extra_manifest_roles = roles_from_manifest - roles_from_registry

        if missing_manifest_roles:
            fail("Registry roles missing in manifest: " + ", ".join(sorted(missing_manifest_roles)))
        else:
            ok("All registry image roles exist in manifest")

        if extra_manifest_roles:
            warn("Manifest has roles not in registry: " + ", ".join(sorted(extra_manifest_roles)))
        else:
            ok("Manifest roles match registry roles")

        manifest_webps = set()
        for role_data in manifest.get("roles", {}).values():
            for variants in role_data.get("variants", {}).values():
                for variant in variants:
                    p = variant.get("path")
                    if p:
                        manifest_webps.add(p)

        html_webps = set(re.findall(r'assets/generated/[A-Za-z0-9_./-]+?\.webp', html))
        random_webps = html_webps - manifest_webps

        if random_webps:
            fail("HTML references WebP files not listed in manifest:\n" + "\n".join(f"  - {p}" for p in sorted(random_webps)))
        else:
            ok("HTML WebP references are listed in manifest")

        missing_manifest_files = [p for p in manifest_webps if not (PROJECT / p).exists()]
        if missing_manifest_files:
            fail("Manifest WebP files missing on disk:\n" + "\n".join(f"  - {p}" for p in missing_manifest_files[:80]))
        else:
            ok(f"All manifest WebP files exist: {len(manifest_webps)} files")

    except Exception as e:
        fail(f"Manifest/registry parse check failed: {e}")

for token in [".diagnostic-panel", ".symptom-list", ".symptom-item", ".diagnostic-media", "object-fit: contain"]:
    if token in css:
        ok(f"CSS contains {token}")
    else:
        fail(f"CSS missing {token}")

receipt_dir = PROJECT / "docs"
receipt_dir.mkdir(parents=True, exist_ok=True)
receipt_path = receipt_dir / "local_full_diagnostic_receipt.txt"
receipt_path.write_text(
    "GOLDLEVEL / ChatRMD Life Coach Full Diagnostic v0.1.2\n"
    f"UTC: {datetime.now(timezone.utc).isoformat()}\n"
    f"Repo: {ROOT}\n"
    f"Branch: {branch}\n"
    f"Errors: {len(errors)}\n"
    f"Warnings: {len(warnings)}\n"
    "\nERRORS:\n" + "\n".join(errors) +
    "\n\nWARNINGS:\n" + "\n".join(warnings) +
    "\n\nPASSES:\n" + "\n".join(passes) +
    "\n",
    encoding="utf-8"
)

print()
print("== RESULT ==")
print("LOCAL DIAGNOSTIC:", "FAIL" if errors else "PASS")
print(f"Passes: {len(passes)}")
print(f"Warnings: {len(warnings)}")
print(f"Errors: {len(errors)}")
print(f"Receipt: {receipt_path}")

if warnings:
    print("\n== WARNINGS ==")
    for w in warnings:
        print("-", w)

if errors:
    print("\n== ERRORS ==")
    for e in errors:
        print("-", e)

print("\n== GIT STATUS ==")
print(status if status else "clean")

raise SystemExit(1 if errors else 0)
