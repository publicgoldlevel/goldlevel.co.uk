#!/usr/bin/env python3
"""
GOLDLEVEL release compiler v0.2.

Default mode: audit.
Optional --write mode:
- Rebuilds moment-matter/assets/data/products.js from products.registry.json
  using only status == "available" products.
- Preserves existing product details from current products.js where possible.
- Cache-busts moment-matter/*.html script refs.
- Writes sitemap.xml and robots.txt from release.status.json.

This compiler is conservative: it will fail rather than invent product content.
"""
from pathlib import Path
from datetime import datetime, timezone
import json
import re
import sys

OPS = Path("_ops/release_control")
REG = OPS / "products.registry.json"
STATUS = OPS / "release.status.json"
PRODUCTS_JS = Path("moment-matter/assets/data/products.js")

STAMP = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
VERSION = f"compiled-{STAMP}"

if not REG.exists():
    raise SystemExit(f"Missing {REG}; run gl_bootstrap_release_control.py first")
if not PRODUCTS_JS.exists():
    raise SystemExit(f"Missing {PRODUCTS_JS}")

registry = json.loads(REG.read_text(encoding="utf-8"))
release_status = json.loads(STATUS.read_text(encoding="utf-8")) if STATUS.exists() else {}

def extract_js_array(text: str, name: str):
    m = re.search(rf"window\.{re.escape(name)}\s*=\s*(\[[\s\S]*?\]);", text)
    if not m:
        return [], None
    return json.loads(m.group(1)), m

current_text = PRODUCTS_JS.read_text(encoding="utf-8", errors="ignore")
current_products, products_match = extract_js_array(current_text, "PRODUCTS")
current_categories, categories_match = extract_js_array(current_text, "CATEGORIES")

by_id = {p.get("id"): p for p in current_products if p.get("id")}
available_registry = [p for p in registry.get("products", []) if p.get("status") == "available"]

print("GOLDLEVEL release compiler: AUDIT")
print(f"registry_products={len(registry.get('products', []))}")
print(f"available_products={len(available_registry)}")
for p in available_registry:
    print(f"AVAILABLE: {p.get('id')} | {p.get('title')} | {p.get('public_image')}")

if "--write" not in sys.argv:
    raise SystemExit(0)

if products_match is None:
    raise SystemExit("Cannot write: window.PRODUCTS not found")

compiled = []
missing = []

for reg_item in available_registry:
    pid = reg_item.get("id")
    existing = by_id.get(pid)

    if not existing:
        missing.append(pid)
        continue

    item = dict(existing)
    item["id"] = pid
    item["imagePath"] = reg_item.get("public_image", item.get("imagePath", ""))
    item.pop("image", None)
    compiled.append(item)

if missing:
    raise SystemExit(f"Cannot write: registry product IDs not found in current products.js: {missing}")

used_categories = {p.get("category") for p in compiled if p.get("category")}
compiled_categories = [c for c in current_categories if c.get("id") in used_categories]

new_text = current_text

if categories_match is not None:
    cats_json = json.dumps(compiled_categories, indent=2, ensure_ascii=False)
    new_text = new_text[:categories_match.start(1)] + cats_json + new_text[categories_match.end(1):]
    current_products, products_match = extract_js_array(new_text, "PRODUCTS")

products_json = json.dumps(compiled, indent=2, ensure_ascii=False)
new_text = new_text[:products_match.start(1)] + products_json + new_text[products_match.end(1):]

PRODUCTS_JS.write_text(new_text, encoding="utf-8")

for p in Path("moment-matter").glob("*.html"):
    text = p.read_text(encoding="utf-8", errors="ignore")
    old = text

    text = re.sub(
        r'assets/data/products\.js(?:\?v=[^"\']*)?',
        f'assets/data/products.js?v={VERSION}',
        text,
    )
    text = re.sub(
        r'assets/js/site\.js(?:\?v=[^"\']*)?',
        f'assets/js/site.js?v={VERSION}',
        text,
    )

    if text != old:
        p.write_text(text, encoding="utf-8")

moment_status = release_status.get("moment_matter_status", "online")
robots = Path("moment-matter/robots.txt")
sitemap = Path("moment-matter/sitemap.xml")

if moment_status == "offline":
    robots.write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")
    sitemap.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        '</urlset>\n',
        encoding="utf-8",
    )
else:
    robots.write_text(
        "User-agent: *\nAllow: /\n\n"
        "Sitemap: https://goldlevel.co.uk/moment-matter/sitemap.xml\n",
        encoding="utf-8",
    )
    urls = [
        "https://goldlevel.co.uk/moment-matter/",
        "https://goldlevel.co.uk/moment-matter/shop.html",
        "https://goldlevel.co.uk/moment-matter/product.html",
        "https://goldlevel.co.uk/moment-matter/about.html",
        "https://goldlevel.co.uk/moment-matter/contact.html",
    ]
    sitemap.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(f"  <url><loc>{u}</loc></url>" for u in urls)
        + "\n</urlset>\n",
        encoding="utf-8",
    )

print("WRITE COMPLETE")
print(f"version={VERSION}")
print(f"products_written={len(compiled)}")
