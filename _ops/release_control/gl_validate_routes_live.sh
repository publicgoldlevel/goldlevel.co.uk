#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LIVE="${1:-https://goldlevel.co.uk}"
BUST="$(date +%s)"
OUT="_ops/release_control/live_route_validation_$(date -u +%Y%m%dT%H%M%SZ).txt"

mkdir -p "_ops/release_control"

echo "== Live route validation: $LIVE ==" | tee "$OUT"

ROUTES=(
  "/"
  "/goldlevel/"
  "/goldlevel/index.html"
  "/moment-matter/"
  "/moment-matter/shop.html"
  "/moment-matter/product.html"
)

fail=0

for route in "${ROUTES[@]}"; do
  url="$LIVE$route?v=$BUST"
  code="$(curl -L -s -o /dev/null -w "%{http_code}" "$url")"
  echo "$route HTTP $code" | tee -a "$OUT"
  [ "$code" = "200" ] || fail=1
done

python - <<'PY' > /tmp/gl_product_ids.txt
from pathlib import Path
import json

reg_path = Path("_ops/release_control/products.registry.json")
if not reg_path.exists():
    raise SystemExit("missing _ops/release_control/products.registry.json")

reg = json.loads(reg_path.read_text())
seen = set()

for p in reg.get("products", []):
    if p.get("status") == "available":
        ids = [p.get("id", "")] + list(p.get("direct_url_aliases", []))
        for pid in ids:
            if pid and pid not in seen:
                print(pid)
                seen.add(pid)
PY

while IFS= read -r pid; do
  [ -n "$pid" ] || continue
  url="$LIVE/moment-matter/product.html?id=$pid&v=$BUST"
  body="$(curl -L -s "$url")"

  if echo "$body" | grep -q "Product not found"; then
    echo "product id=$pid FAIL product-not-found" | tee -a "$OUT"
    fail=1
  else
    echo "product id=$pid PASS" | tee -a "$OUT"
  fi
done < /tmp/gl_product_ids.txt

if [ "$fail" -ne 0 ]; then
  echo "LIVE ROUTE VALIDATION: FAIL" | tee -a "$OUT"
  exit 1
fi

echo "LIVE ROUTE VALIDATION: PASS" | tee -a "$OUT"
