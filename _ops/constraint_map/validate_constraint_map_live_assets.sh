#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-https://goldlevel.co.uk/constraint-map}"
STAMP="$(date -u +%s)"
FAIL=0

echo "== validating local files =="
for f in \
  constraint-map/index.html \
  constraint-map/image-proof.html \
  constraint-map/assets/gl-pro-images/pro-01.png \
  constraint-map/assets/gl-pro-images/pro-02.png \
  constraint-map/assets/gl-pro-images/pro-03.png \
  constraint-map/assets/gl-pro-images/pro-04.png
do
  if [ ! -s "$f" ]; then
    echo "FAIL local missing: $f"
    FAIL=1
  else
    echo "PASS local: $f"
  fi
done

echo
echo "== validating live files =="
for p in \
  "" \
  "image-proof.html" \
  "assets/gl-pro-images/pro-01.png" \
  "assets/gl-pro-images/pro-02.png" \
  "assets/gl-pro-images/pro-03.png" \
  "assets/gl-pro-images/pro-04.png"
do
  URL="$BASE/$p"
  URL="${URL%/}"
  [ -z "$p" ] && URL="$BASE/"
  CODE="$(curl -L -sS -o /dev/null -w "%{http_code}" "$URL?guard=$STAMP" || echo 000)"
  echo "$CODE $URL"
  case "$p:$CODE" in
    :200|:301|:302) ;;
    image-proof.html:200) ;;
    assets/gl-pro-images/*:200) ;;
    *) FAIL=1 ;;
  esac
done

echo
echo "== selector check =="
ROOT_CODE="$(curl -L -sS "$BASE/../?guard=$STAMP" 2>/dev/null | grep -c '/constraint-map/' || true)"
echo "root selector link count: $ROOT_CODE"

exit "$FAIL"
