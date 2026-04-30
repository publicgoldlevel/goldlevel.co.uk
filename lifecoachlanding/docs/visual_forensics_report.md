# Visual Forensics Report

Generated UTC: 2026-04-30T12:17:52.240465+00:00

Canonical URL: https://goldlevel.co.uk/lifecoachlanding

Decision: `CACHE_BUST_AND_RETEST_BROWSER`

## Signals

- `live_index_http`: `200`
- `live_css_http`: `200`
- `local_index_sha16`: `755c61dc8f0cef2c`
- `live_index_sha16`: `fce8d3f3b06f2cde`
- `local_css_sha16`: `7bfa914ab0667a2d`
- `live_css_sha16`: `7bfa914ab0667a2d`
- `stylesheet_head_styles.css`: `HTTP/2 200  | server: openresty | date: Thu, 30 Apr 2026 12:17:50 GMT | content-type: text/css; charset=UTF-8 | content-length: 18922 | vary: Accept-Encoding | vary: Accept-Encoding | last-modified: Thu, 30 Apr 2026 11:54:54 GMT | etag: "69f3430e-49ea" | expires: Sat, 30 May 2026 12:15:27 GMT | cache-control: max-age=2592000 | cache-control: public, max-age=2592000 | x-cache: HIT | x-service: pixie-sh | accept-ranges: bytes`
- `live_problem_sha16`: `0c9a0c3fa607b02f`
- `local_problem_sha16`: `0c9a0c3fa607b02f`
- `selector_lines_.diagnostic-panel`: `[823, 917]`
- `selector_lines_.symptom-list`: `[868]`
- `selector_lines_.symptom-item`: `[875, 898, 904]`
- `selector_lines_.diagnostic-media`: `[835, 840, 846, 921]`
- `selector_lines_.section-asset`: `[708, 715, 735, 741, 782, 789, 806, 812]`
- `selector_lines_.media-frame`: `[684, 694, 720, 758, 768, 795]`
- `selector_lines_.card-grid.four`: `[344, 615, 663]`
- `selector_lines_.info-card`: `[347]`
- `problem_webp_head`: `HTTP/2 200  | server: openresty | date: Thu, 30 Apr 2026 12:17:51 GMT | content-type: image/webp | content-length: 38480 | last-modified: Thu, 30 Apr 2026 11:38:05 GMT | etag: "69f33f1d-9650" | expires: Sat, 30 May 2026 12:17:51 GMT | cache-control: max-age=2592000 | cache-control: public, max-age=2592000 | x-cache: MISS | x-service: pixie-sh | accept-ranges: bytes`
- `styles_head`: `HTTP/2 200  | server: openresty | date: Thu, 30 Apr 2026 12:17:53 GMT | content-type: text/css; charset=UTF-8 | content-length: 18922 | vary: Accept-Encoding | vary: Accept-Encoding | last-modified: Thu, 30 Apr 2026 11:54:54 GMT | etag: "69f3430e-49ea" | expires: Sat, 30 May 2026 12:15:27 GMT | cache-control: max-age=2592000 | cache-control: public, max-age=2592000 | x-cache: HIT | x-service: pixie-sh | accept-ranges: bytes`
- `decision`: `CACHE_BUST_AND_RETEST_BROWSER`

## Passes

- PASS: canonical live index returns 200
- PASS: canonical live styles.css returns 200
- PASS: local and live CSS hashes match
- PASS: stylesheet links found: ['styles.css']
- PASS: live #problem section extracted
- PASS: problem structure: component marker
- PASS: problem structure: problem asset role
- PASS: problem structure: problem webp route
- PASS: problem structure: no ordered list in problem
- PASS: problem structure: no legacy card grid in problem
- PASS: problem structure: no markdown markers in problem
- PASS: problem structure: four symptom rows
- PASS: problem structure: four symptom numbers
- PASS: local and live problem section hashes match
- PASS: live CSS contains Clarity Gap Diagnostic Panel v0.1.1
- PASS: live CSS contains .diagnostic-panel
- PASS: live CSS contains .diagnostic-media
- PASS: live CSS contains .diagnostic-copy
- PASS: live CSS contains .panel-label
- PASS: live CSS contains .symptom-list
- PASS: live CSS contains .symptom-item
- PASS: live CSS contains .symptom-number
- PASS: live CSS contains .panel-bridge
- PASS: live CSS contains object-fit: contain
- PASS: old v0.1.0 clarity-gap CSS absent live
- PASS: no obvious later broad CSS rules after .diagnostic-panel
- PASS: .diagnostic-panel selector count is low
- PASS: problem WebP served as image/webp HTTP 200

## Warnings

- WARN: local and live index hashes differ; deployment or transformation layer may be involved
- WARN: stylesheet link has no cache-busting query; browser may keep old CSS
- WARN: browser cache risk is active: stylesheet has no ?v= and may be cached

## Errors

- None

## Live problem section preview

```html
id="problem" data-section-role="problem" class="section-pad problem-section clarity-gap-section" aria-labelledby="problem-title">
  <div class="shell">
    <div class="section-heading compact">
      <p class="eyebrow"><span></span> The gap</p>
      <h2 id="problem-title">Meaningful coaching can still look unclear online.</h2>
      <p>A coach can have real depth, but the page still fails to show the message, offer, trust, and next step clearly.</p>
    </div>

    <div class="diagnostic-panel" data-component="clarity-gap-diagnostic-panel">
      <figure class="diagnostic-media-wrap">
        <picture class="diagnostic-media media-frame media-contain" data-asset-role="problem" data-style-family="cream_sage_gold_editorial">
          <img
            src="assets/generated/problem/problem-4x5-768.webp"
            srcset="
              assets/generated/problem/problem-4x5-480.webp 480w,
              assets/generated/problem/problem-4x5-768.webp 768w,
              assets/generated/problem/problem-4x5-1120.webp 1120w,
              assets/generated/problem/problem-4x5-1440.webp 1440w
            "
            sizes="(max-width: 860px) 92vw, 40vw"
            alt="Unclear material becoming a clearer website structure."
            loading="lazy"
            decoding="async"
          />
        </picture>
      </figure>

      <div class="diagnostic-copy">
        <p class="panel-label">Four symptoms of an unclear page</p>

        <div class="symptom-list" role="list">
          <article class="symptom-item" role="listitem">
            <span class="symptom-number" aria-hidden="true">01</span>
            <div>
              <h3>Message unclear</h3>
              <p>People do not immediately understand who you help.</p>
            </div>
          </article>

          <article class="symptom-item" role="listitem">
            <span class="symptom-number" aria-hidden="true">02</span>
            <div>
              <h3>Offer hidden</h3>
              <p>Sessions or packages are not easy to choose.</p>
            </div>
          </article>

          <article class="symptom-item" role="listitem">
            <span class="symptom-number" aria-hidden="true">03</span>
            <div>
              <h3>Trust not visible</h3>
              <p>Your presence is stronger in conversation than on the page.</p>
            </div>
          </article>

          <article class="symptom-item" role="listitem">
            <span class="symptom-number" aria-hidden="true">04</span>
            <div>
              <h3>Next step missing</h3>
              <p>Visitors do not know whether to book, enquire, or message.</p>
            </div>
          </article>
        </div>

        <p class="panel-bridge">The fix is not more decoration. It is a clearer pathway.</p>
      </div>
    </div>
  </div>
</section>

<section 
```
