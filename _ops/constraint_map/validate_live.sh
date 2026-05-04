#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://goldlevel.co.uk/constraint-map}"
STAMP="$(date -u +%s)"
FAIL=0
for p in \
  "" \
  "image-proof.html" \
  "assets/gl-pro-images/pro-01.png" \
  "assets/gl-pro-images/pro-02.png" \
  "assets/gl-pro-images/pro-03.png" \
  "assets/gl-pro-images/pro-04.png"
do
  URL="$BASE/$p"
  [ -z "$p" ] && URL="$BASE/"
  CODE="$(curl -L -sS -o /dev/null -w "%{http_code}" "$URL?guard=$STAMP" || echo 000)"
  echo "$CODE $URL"
  case "$CODE" in
    200|301|302) ;;
    *) FAIL=1 ;;
  esac
done
exit "$FAIL"
