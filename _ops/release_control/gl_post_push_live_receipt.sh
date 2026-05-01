#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LIVE="${1:-https://goldlevel.co.uk}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="_ops/release_control/post_push_live_receipt_$STAMP.md"

mkdir -p "_ops/release_control"

{
  echo "# GOLDLEVEL Post-Push Live Receipt"
  echo
  echo "- UTC: $STAMP"
  echo "- Live: $LIVE"
  echo "- Commit local: $(git rev-parse HEAD)"
  echo "- Commit origin/main: $(git rev-parse origin/main 2>/dev/null || echo unknown)"
  echo
  echo "## Route checks"
} > "$OUT"

bash _ops/release_control/gl_validate_routes_live.sh "$LIVE" | tee -a "$OUT"

{
  echo
  echo "## Asset checks"
} >> "$OUT"

bash _ops/release_control/gl_validate_assets_live.sh "$LIVE" | tee -a "$OUT"

echo
echo "Receipt written:"
echo "$OUT"
