#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LIVE="${1:-https://goldlevel.co.uk}"
BUST="$(date +%s)"
OUT="_ops/release_control/live_asset_validation_$(date -u +%Y%m%dT%H%M%SZ).txt"

mkdir -p "_ops/release_control"

echo "== Live asset validation: $LIVE ==" | tee "$OUT"

python - <<'PY' > /tmp/gl_asset_refs.txt
from pathlib import Path
import json

reg_path = Path("_ops/release_control/products.registry.json")
if not reg_path.exists():
    raise SystemExit("missing _ops/release_control/products.registry.json")

reg = json.loads(reg_path.read_text())
seen = set()

for p in reg.get("products", []):
    if p.get("status") == "available" and p.get("public_image"):
        ref = p["public_image"]
        if ref not in seen:
            print(ref)
            seen.add(ref)
PY

fail=0

while IFS= read -r ref; do
  [ -n "$ref" ] || continue
  url="$LIVE/moment-matter/$ref?v=$BUST"
  line="$(curl -L -s -o /dev/null -w "$ref HTTP %{http_code} | %{content_type} | %{size_download} bytes" "$url")"
  echo "$line" | tee -a "$OUT"
  echo "$line" | grep -q "HTTP 200" || fail=1
done < /tmp/gl_asset_refs.txt

if [ "$fail" -ne 0 ]; then
  echo "LIVE ASSET VALIDATION: FAIL" | tee -a "$OUT"
  exit 1
fi

echo "LIVE ASSET VALIDATION: PASS" | tee -a "$OUT"
