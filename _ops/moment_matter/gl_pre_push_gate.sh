#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "== LANE PRE-PUSH GATE =="
echo "Lane dir: $(dirname "$0")"

fail=0

for f in registry.json assets.manifest.json routes.manifest.json release.status.json validation.receipt.json; do
  if [ ! -f "$(dirname "$0")/$f" ]; then
    echo "FAIL: missing $f"
    fail=1
  else
    echo "PASS: $f exists"
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "LANE PRE-PUSH GATE: FAIL"
  exit 1
fi

echo "LANE PRE-PUSH GATE: PASS"
