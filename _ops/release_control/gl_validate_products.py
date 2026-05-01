#!/usr/bin/env python3
from pathlib import Path
import json
import re
import subprocess

OPS = Path("_ops/release_control")
REG = OPS / "products.registry.json"
PRODUCTS_JS = Path("moment-matter/assets/data/products.js")

def die(msg):
    print("FAIL:", msg)
    raise SystemExit(1)

if not REG.exists():
    die(f"missing {REG}; run gl_bootstrap_release_control.py first")
if not PRODUCTS_JS.exists():
    die(f"missing {PRODUCTS_JS}")

registry = json.loads(REG.read_text(encoding="utf-8"))
products_text = PRODUCTS_JS.read_text(encoding="utf-8", errors="ignore")
tracked = set(subprocess.run(["git", "ls-files"], text=True, stdout=subprocess.PIPE).stdout.splitlines())

errors = []
warnings = []

if "window.PRODUCTS" not in products_text:
    errors.append("products.js does not define window.PRODUCTS")

for item in registry.get("products", []):
    pid = item.get("id", "")
    status = item.get("status", "")
    img = item.get("public_image", "")
    local = item.get("public_image_local_path", "")

    if status == "available":
        if not img:
            errors.append(f"{pid}: available but no public_image")
        if local and not Path(local).exists():
            errors.append(f"{pid}: image missing locally: {local}")
        if local and local not in tracked:
            errors.append(f"{pid}: image not git tracked: {local}")
    else:
        if pid and re.search(rf'"id"\s*:\s*"{re.escape(pid)}"', products_text):
            warnings.append(f"{pid}: non-available in registry but still appears in products.js")

if Path("moment-matter/assets/img/originals").exists():
    errors.append("public originals folder exists: moment-matter/assets/img/originals")

if errors:
    print("PRODUCT VALIDATION: FAIL")
    for e in errors:
        print("ERROR:", e)
    for w in warnings:
        print("WARN:", w)
    raise SystemExit(1)

print("PRODUCT VALIDATION: PASS")
for w in warnings:
    print("WARN:", w)
