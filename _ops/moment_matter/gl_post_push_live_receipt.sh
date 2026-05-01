#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DIR="$(dirname "$0")"
OUT="$DIR/post_push_live_receipt_$STAMP.md"

{
  echo "# Lane Post-Push Live Receipt"
  echo
  echo "- UTC: $STAMP"
  echo "- Lane dir: $DIR"
  echo "- Commit local: $(git rev-parse HEAD)"
  echo "- Commit origin/main: $(git rev-parse origin/main 2>/dev/null || echo unknown)"
} > "$OUT"

echo "Receipt written: $OUT"
