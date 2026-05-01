#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "== GOLDLEVEL OFFER CLARITY FAST-CLOSE GUARD =="

fail=0

mapfile -t candidates < <(
  find . -type f -name "*.html" \
    -not -path "./.git/*" \
    -not -path "./node_modules/*" \
    -not -path "./_ops/*" \
    -not -path "./_goldlevel*/*" \
    -print | while read -r f; do
      if grep -qi "Your page is live\|GOLDLEVEL — Offer Clarity Read\|Live-But-Not-Landing Read" "$f"; then
        echo "$f"
      fi
    done | sort
)

if [ "${#candidates[@]}" -eq 0 ]; then
  echo "FAIL: no Offer Clarity landing HTML candidates found"
  exit 1
fi

for f in "${candidates[@]}"; do
  echo "-- checking $f"

  grep -q "GL_PATCH_OFFER_CLARITY_FAST_CLOSE_V1" "$f" \
    && echo "PASS: fast-close patch marker present" \
    || { echo "FAIL: fast-close patch marker missing"; fail=1; }

  grep -q "£35" "$f" \
    && echo "PASS: £35 price present" \
    || { echo "FAIL: £35 price missing"; fail=1; }

  grep -q "24–48h\|24-48h" "$f" \
    && echo "PASS: delivery window present" \
    || { echo "FAIL: delivery window missing"; fail=1; }

  grep -qi "One live asset" "$f" \
    && echo "PASS: one live asset scope present" \
    || { echo "FAIL: one live asset scope missing"; fail=1; }

  grep -qi "Example mini-read" "$f" \
    && echo "PASS: example mini-read present" \
    || { echo "FAIL: example mini-read missing"; fail=1; }

  grep -qi "DM .READ.*£35\|DM “READ” — £35\|DM &ldquo;READ&rdquo;.*£35" "$f" \
    && echo "PASS: direct DM READ price CTA present" \
    || { echo "FAIL: direct DM READ price CTA missing"; fail=1; }
done

# Root selector must not be overwritten by landing page.
for selector in ./index.html ./docs/index.html ./goldlevel/index.html; do
  if [ -f "$selector" ]; then
    if grep -qi "id=\"hero-title\".*Your page is live\|<title>GOLDLEVEL — Offer Clarity Read</title>" "$selector"; then
      echo "FAIL: selector appears overwritten by Offer Clarity landing page: $selector"
      fail=1
    else
      echo "PASS: selector not overwritten: $selector"
    fi
  fi
done

# Root helper scripts should not remain in repo.
if find . -maxdepth 1 -type f -name "gl_*.sh" | grep -q .; then
  echo "FAIL: root helper scripts exist"
  find . -maxdepth 1 -type f -name "gl_*.sh" -print
  fail=1
else
  echo "PASS: no root helper scripts"
fi

if [ "$fail" -ne 0 ]; then
  echo "GOLDLEVEL OFFER CLARITY FAST-CLOSE GUARD: FAIL"
  exit 1
fi

echo "GOLDLEVEL OFFER CLARITY FAST-CLOSE GUARD: PASS"
