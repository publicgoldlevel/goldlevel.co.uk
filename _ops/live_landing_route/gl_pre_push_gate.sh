#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "== GOLDLEVEL LIVE LANDING ROUTE GUARD =="

fail=0

SELECTOR_FILE="index.html"
SITE_ROOT="."

if [ -f "$SELECTOR_FILE" ]; then
  echo "PASS: selector source exists: $SELECTOR_FILE"
else
  echo "FAIL: selector source missing: $SELECTOR_FILE"
  fail=1
fi

if [ -f "$SITE_ROOT/landing/index.html" ]; then
  echo "PASS: live-root landing index exists"
else
  echo "FAIL: live-root landing index missing"
  fail=1
fi

if grep -qi "Offer Clarity\|Your page is live" "$SITE_ROOT/landing/index.html" 2>/dev/null; then
  echo "PASS: Offer Clarity copy found under live-root /landing/"
else
  echo "FAIL: Offer Clarity copy missing under live-root /landing/"
  fail=1
fi

if grep -qi "<title>GOLDLEVEL — Offer Clarity Read</title>\|id=\"hero-title\"\|Your page is live" "$SELECTOR_FILE" 2>/dev/null; then
  echo "FAIL: selector appears overwritten by landing page"
  fail=1
else
  echo "PASS: selector not overwritten by landing page"
fi

if [ -f "$SITE_ROOT/landing/assets/css/goldlevel-landing.css" ]; then
  echo "PASS: landing CSS exists"
else
  echo "FAIL: landing CSS missing"
  fail=1
fi

if [ -f "$SITE_ROOT/landing/assets/js/goldlevel-landing.js" ]; then
  echo "PASS: landing JS exists"
else
  echo "FAIL: landing JS missing"
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo "GOLDLEVEL LIVE LANDING ROUTE GUARD: FAIL"
  exit 1
fi

echo "GOLDLEVEL LIVE LANDING ROUTE GUARD: PASS"
