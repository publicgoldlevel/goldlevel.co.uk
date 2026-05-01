#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LANE="${1:-}"

if [ -z "$LANE" ]; then
  echo "Usage:"
  echo "  bash _ops/release_control/gl_create_lane.sh moment_matter"
  echo "  bash _ops/release_control/gl_create_lane.sh goldlevel_homepage"
  echo "  bash _ops/release_control/gl_create_lane.sh source_voice"
  exit 1
fi

case "$LANE" in
  *[!a-zA-Z0-9_-]*)
    echo "ERROR: lane name may only contain letters, numbers, underscore, hyphen."
    exit 1
    ;;
esac

DIR="_ops/$LANE"
mkdir -p "$DIR"

cat > "$DIR/registry.json" <<EOF
{
  "schema": "GOLDLEVEL.${LANE}.registry.v0.1",
  "lane": "$LANE",
  "status": "draft",
  "items": []
}
EOF

cat > "$DIR/assets.manifest.json" <<EOF
{
  "schema": "GOLDLEVEL.${LANE}.assets.manifest.v0.1",
  "lane": "$LANE",
  "assets": []
}
EOF

cat > "$DIR/routes.manifest.json" <<EOF
{
  "schema": "GOLDLEVEL.${LANE}.routes.manifest.v0.1",
  "lane": "$LANE",
  "routes": []
}
EOF

cat > "$DIR/release.status.json" <<EOF
{
  "schema": "GOLDLEVEL.${LANE}.release.status.v0.1",
  "lane": "$LANE",
  "status": "draft",
  "allowed_statuses": ["draft", "review", "available", "deployed", "archived", "offline"]
}
EOF

cat > "$DIR/validation.receipt.json" <<EOF
{
  "schema": "GOLDLEVEL.${LANE}.validation.receipt.v0.1",
  "lane": "$LANE",
  "status": "not_validated",
  "checks": []
}
EOF

cat > "$DIR/gl_pre_push_gate.sh" <<'EOF'
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
EOF
chmod +x "$DIR/gl_pre_push_gate.sh"

cat > "$DIR/gl_post_push_live_receipt.sh" <<'EOF'
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
EOF
chmod +x "$DIR/gl_post_push_live_receipt.sh"

echo "Created lane:"
echo "$DIR"
find "$DIR" -maxdepth 1 -type f | sort
