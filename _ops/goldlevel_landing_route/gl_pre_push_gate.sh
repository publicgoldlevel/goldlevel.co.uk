#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "== GOLDLEVEL LANDING ROUTE GUARD =="
echo "Rule: selector may link to /landing/, but landing page must not replace docs/index.html"

fail=0

if [ ! -f docs/index.html ]; then
  echo "FAIL: docs/index.html selector missing"
  fail=1
else
  echo "PASS: docs/index.html exists"
fi

if [ ! -f docs/landing/index.html ]; then
  echo "FAIL: docs/landing/index.html landing page missing"
  fail=1
else
  echo "PASS: docs/landing/index.html exists"
fi

# Selector is allowed to mention/link Offer Clarity.
# It must NOT contain full landing-page takeover markers.
if [ -f docs/index.html ] && grep -qi "<title>GOLDLEVEL — Offer Clarity Read</title>" docs/index.html; then
  echo "FAIL: docs/index.html has landing page title"
  fail=1
else
  echo "PASS: selector does not use landing page title"
fi

if [ -f docs/index.html ] && grep -qi 'id="hero-title"' docs/index.html; then
  echo "FAIL: docs/index.html contains landing hero marker"
  fail=1
else
  echo "PASS: selector does not contain landing hero marker"
fi

if [ -f docs/index.html ] && grep -qi "Your page is live" docs/index.html; then
  echo "FAIL: docs/index.html contains landing hero copy"
  fail=1
else
  echo "PASS: selector does not contain landing hero copy"
fi

if [ -f docs/index.html ] && grep -qi "goldlevel-landing.css" docs/index.html; then
  echo "FAIL: docs/index.html references landing CSS"
  fail=1
else
  echo "PASS: selector does not reference landing CSS"
fi

if [ -f docs/index.html ] && grep -qi 'href="/landing/"' docs/index.html; then
  echo "PASS: selector links to /landing/"
else
  echo "FAIL: selector does not link to /landing/"
  fail=1
fi

if [ -f docs/landing/index.html ] && grep -qi "Offer Clarity\|Your page is live" docs/landing/index.html; then
  echo "PASS: Offer Clarity landing copy found under /landing/"
else
  echo "FAIL: Offer Clarity landing copy not found under /landing/"
  fail=1
fi

if [ -f docs/landing/assets/css/goldlevel-landing.css ]; then
  echo "PASS: landing CSS exists"
else
  echo "FAIL: landing CSS missing"
  fail=1
fi

if [ -f docs/landing/assets/js/goldlevel-landing.js ]; then
  echo "PASS: landing JS exists"
else
  echo "FAIL: landing JS missing"
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo "GOLDLEVEL LANDING ROUTE GUARD: FAIL"
  exit 1
fi

echo "GOLDLEVEL LANDING ROUTE GUARD: PASS"
