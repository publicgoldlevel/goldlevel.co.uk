#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail

BASE="${BASE:-https://goldlevel.co.uk/constraint-map}"
ROOT_BASE="${ROOT_BASE:-https://goldlevel.co.uk}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOCAL_FILE="${LOCAL_FILE:-constraint-map/index.html}"
ROOT_FILE="${ROOT_FILE:-index.html}"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

echo "== Validate Constraint Map Fit Check =="
echo "Base:      $BASE"
echo "Root base: $ROOT_BASE"
echo "Stamp:     $STAMP"
echo

[ -f "$LOCAL_FILE" ] || fail "missing local file: $LOCAL_FILE"

grep -q "GL_CONSTRAINT_MAP_FIT_CHECK_APP_BEGIN" "$LOCAL_FILE" || fail "local marker missing"
grep -q "Constraint Map Fit Check" "$LOCAL_FILE" || fail "local heading missing"
grep -q "cmFitCheckForm" "$LOCAL_FILE" || fail "local form id missing"
grep -q "cmFitCheckGenerate" "$LOCAL_FILE" || fail "generate button id missing"
grep -q "cmActiveTension" "$LOCAL_FILE" || fail "active tension field missing"
grep -q "Integrated next move" "$LOCAL_FILE" || fail "integrated next move output missing"

if [ -f "$ROOT_FILE" ]; then
  grep -q "/constraint-map/" "$ROOT_FILE" || fail "root selector does not link /constraint-map/"
fi

TMP_ROUTE="$(mktemp)"
TMP_ROOT="$(mktemp)"
trap 'rm -f "$TMP_ROUTE" "$TMP_ROOT"' EXIT

curl -L -fsS "$BASE/?guard=$STAMP" -o "$TMP_ROUTE" || fail "live route did not return 200: $BASE"
grep -q "GL_CONSTRAINT_MAP_FIT_CHECK_APP_BEGIN" "$TMP_ROUTE" || fail "live marker missing"
grep -q "Constraint Map Fit Check" "$TMP_ROUTE" || fail "live heading missing"
grep -q "cmFitCheckForm" "$TMP_ROUTE" || fail "live form id missing"
grep -q "cmActiveTension" "$TMP_ROUTE" || fail "live active tension field missing"

curl -L -fsS "$ROOT_BASE/?guard=$STAMP" -o "$TMP_ROOT" || fail "live root did not return 200: $ROOT_BASE"
grep -q "/constraint-map/" "$TMP_ROOT" || fail "live selector/root missing /constraint-map/ link"

echo "PASS: local and live Constraint Map Fit Check markers verified."
