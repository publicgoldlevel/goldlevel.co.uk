#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "== GOLDLEVEL PRE-PUSH GATE =="

fail=0

echo
echo "== Git state =="
git status --short

echo
echo "== Block helper scripts in repo root =="
if find . -maxdepth 1 -type f -name "gl_*.sh" | grep -q .; then
  echo "FAIL: helper scripts exist in repo root:"
  find . -maxdepth 1 -type f -name "gl_*.sh"
  fail=1
else
  echo "PASS: no root helper scripts"
fi

echo
echo "== Products validation =="
python _ops/release_control/gl_validate_products.py || fail=1

echo
echo "== Site JS resolver checks =="
if [ -f moment-matter/assets/js/site.js ]; then
  node -c moment-matter/assets/js/site.js || fail=1

  if grep -q "mmAssetUrl" moment-matter/assets/js/site.js; then
    echo "PASS: mmAssetUrl present"
  else
    echo "FAIL: mmAssetUrl missing"
    fail=1
  fi

  if grep -q "imagePath" moment-matter/assets/js/site.js; then
    echo "PASS: imagePath priority present"
  else
    echo "FAIL: imagePath priority missing"
    fail=1
  fi
else
  echo "FAIL: missing moment-matter/assets/js/site.js"
  fail=1
fi

echo
echo "== Offline text guard =="
if grep -RIn "Temporarily offline" goldlevel moment-matter --include="*.html"; then
  echo "FAIL: offline text present in public HTML"
  fail=1
else
  echo "PASS: no offline text"
fi

echo
echo "== Unavailable product IDs guard =="
if grep -RInE "digital-card-pack|physical-card-set|digital-gift-print|physical-gift-print|digital-boxed-set|physical-boxed-set|space-digital-curation|space-physical-set" moment-matter/assets/data/products.js; then
  echo "FAIL: unavailable product IDs present in products.js"
  fail=1
else
  echo "PASS: unavailable product IDs absent from products.js"
fi

echo
echo "== Source/private public lane guard =="
if [ -d moment-matter/assets/img/originals ]; then
  echo "FAIL: originals folder exists under public path"
  fail=1
else
  echo "PASS: no public originals folder"
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "PRE-PUSH GATE: FAIL"
  exit 1
fi

echo
echo "PRE-PUSH GATE: PASS"
