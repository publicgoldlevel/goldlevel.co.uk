#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime, timezone
import hashlib
import json
import mimetypes
import re
import subprocess
import sys

OPS = Path("_ops/release_control")
OPS.mkdir(parents=True, exist_ok=True)

LIVE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "https://goldlevel.co.uk"
STAMP = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

MM = Path("moment-matter")
PRODUCTS_JS = MM / "assets/data/products.js"

def run(cmd):
    return subprocess.run(
        cmd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    ).stdout

tracked = set(run(["git", "ls-files"]).splitlines())

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def write_json(path: Path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")

def extract_js_array(text: str, name: str):
    m = re.search(rf"window\.{re.escape(name)}\s*=\s*(\[[\s\S]*?\]);", text)
    if not m:
        return []
    return json.loads(m.group(1))

products = []
categories = []

if PRODUCTS_JS.exists():
    text = read_text(PRODUCTS_JS)
    products = extract_js_array(text, "PRODUCTS")
    categories = extract_js_array(text, "CATEGORIES")

UNAVAILABLE_IDS = {
    "digital-card-pack",
    "physical-card-set",
    "digital-gift-print",
    "physical-gift-print",
    "digital-boxed-set",
    "physical-boxed-set",
    "space-digital-curation",
    "space-physical-set",
}

ALIASES_DEFAULT = {
    "clarity-map-print": "clarity-map-print-edition",
    "custom-moment-map-physical": "custom-moment-map-printed",
}

registry = {
    "schema": "GOLDLEVEL.products.registry.v0.2",
    "generated_utc": STAMP,
    "source": str(PRODUCTS_JS),
    "status_note": "Generated diagnostically from current products.js. Review before treating as canonical.",
    "products": [],
}

for item in products:
    pid = item.get("id", "")
    public_image = item.get("imagePath") or item.get("image") or ""
    local_path = str(MM / public_image) if public_image else ""
    local_exists = bool(local_path and Path(local_path).exists())
    git_tracked = bool(local_path in tracked)

    status = "unavailable" if pid in UNAVAILABLE_IDS else "available"
    aliases = [alias for alias, target in ALIASES_DEFAULT.items() if target == pid]

    registry["products"].append({
        "id": pid,
        "status": status,
        "title": item.get("title", ""),
        "subtitle": item.get("subtitle", ""),
        "category": item.get("category", ""),
        "priceLabel": item.get("priceLabel", ""),
        "public_image": public_image,
        "public_image_local_path": local_path,
        "public_image_exists_local": local_exists,
        "public_image_git_tracked": git_tracked,
        "shopify_handle": item.get("shopifyHandle") or item.get("handle") or pid,
        "direct_url_aliases": aliases,
        "visible_in_shop": status == "available",
        "needs_review": status != "available" or not local_exists or not git_tracked,
    })

write_json(OPS / "products.registry.json", registry)

write_json(OPS / "aliases.json", {
    "schema": "GOLDLEVEL.aliases.v0.2",
    "generated_utc": STAMP,
    "aliases": ALIASES_DEFAULT,
})

image_exts = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".avif"}
assets = []

for p in sorted(Path(".").glob("moment-matter/assets/img/**/*")):
    if not p.is_file() or p.suffix.lower() not in image_exts:
        continue

    rel = str(p)
    assets.append({
        "path": rel,
        "size_bytes": p.stat().st_size,
        "mime_guess": mimetypes.guess_type(rel)[0] or "",
        "sha256": sha256(p),
        "git_tracked": rel in tracked,
        "public_url": f"{LIVE}/{rel}",
        "is_product_image_ref": any(x["public_image_local_path"] == rel for x in registry["products"]),
        "is_source_or_original_lane": "/originals/" in rel or "/source" in rel.lower() or "/_source/" in rel,
    })

write_json(OPS / "assets.manifest.json", {
    "schema": "GOLDLEVEL.assets.manifest.v0.2",
    "generated_utc": STAMP,
    "public_image_rule": "Product images should use moment-matter/assets/img/artwork/<canonical-descriptive-name>.jpg unless a different lane has live proof.",
    "assets": assets,
})

class TitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "title":
            self.in_title = True
    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data

routes = []
for p in sorted(Path(".").glob("**/*.html")):
    if ".git" in p.parts or "_ops" in p.parts:
        continue

    rel = str(p)
    text = read_text(p)
    parser = TitleParser()
    try:
        parser.feed(text)
    except Exception:
        pass

    url = f"{LIVE}/{rel}"
    if rel == "index.html":
        url = f"{LIVE}/"

    routes.append({
        "path": rel,
        "title": parser.title.strip(),
        "status": "offline" if "Temporarily offline" in text else "online",
        "contains_offline_text": "Temporarily offline" in text,
        "contains_products_js": "products.js" in text,
        "contains_site_js": "site.js" in text,
        "public_url": url,
    })

write_json(OPS / "routes.manifest.json", {
    "schema": "GOLDLEVEL.routes.manifest.v0.2",
    "generated_utc": STAMP,
    "routes": routes,
})

release_status = {
    "schema": "GOLDLEVEL.release.status.v0.2",
    "generated_utc": STAMP,
    "goldlevel_status": "online" if any(r["path"] == "goldlevel/index.html" for r in routes) else "unknown",
    "moment_matter_status": "offline" if any(r["path"].startswith("moment-matter/") and r["contains_offline_text"] for r in routes) else "online",
    "release_mode": "diagnostic",
    "proof_boundary": "Generated manifests are diagnostic until validators pass.",
}

write_json(OPS / "release.status.json", release_status)

summary = {
    "generated_utc": STAMP,
    "product_count": len(registry["products"]),
    "available_product_count": sum(1 for p in registry["products"] if p["status"] == "available"),
    "unavailable_product_count": sum(1 for p in registry["products"] if p["status"] != "available"),
    "product_image_missing_local": [p["id"] for p in registry["products"] if not p["public_image_exists_local"]],
    "product_image_not_git_tracked": [p["id"] for p in registry["products"] if not p["public_image_git_tracked"]],
    "route_count": len(routes),
    "offline_route_count": sum(1 for r in routes if r["status"] == "offline"),
    "source_or_original_asset_count": sum(1 for a in assets if a["is_source_or_original_lane"]),
}

write_json(OPS / "validation.receipt.json", {
    "schema": "GOLDLEVEL.validation.receipt.v0.2",
    "generated_utc": STAMP,
    "status": "DIAGNOSTIC_GENERATED_NOT_VALIDATED",
    "summary": summary,
})

print("BOOTSTRAP RELEASE CONTROL: COMPLETE")
print(json.dumps(summary, indent=2))
