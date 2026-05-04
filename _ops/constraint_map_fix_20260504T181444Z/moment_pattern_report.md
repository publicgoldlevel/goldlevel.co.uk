# Moment Matter / working image pattern report

## Local files likely involved
_ops/constraint_map_fix_20260504T181444Z/moment_pattern_report.md
_ops/moment_matter
_ops/moment_matter/assets.manifest.json
_ops/moment_matter/gl_post_push_live_receipt.sh
_ops/moment_matter/gl_pre_push_gate.sh
_ops/moment_matter/registry.json
_ops/moment_matter/release.status.json
_ops/moment_matter/routes.manifest.json
_ops/moment_matter/validation.receipt.json
constraint-map/assets/img/product-artifacts/custom_moment_card_digital.svg
constraint-map/assets/img/product-artifacts/custom_moment_map_digital.svg
constraint-map/assets/img/professional-asset-sets/custom_moment_card_method_professional_example.jpg
constraint-map/assets/img/professional-asset-sets/custom_moment_map_coherence_professional_example.jpg
moment-matter
moment-matter/assets/img/artwork/custom-moment-card-digital.jpg
moment-matter/assets/img/artwork/custom-moment-card-digital.png
moment-matter/assets/img/artwork/custom-moment-card-printed-posted.jpg
moment-matter/assets/img/artwork/custom-moment-card-printed-posted.png
moment-matter/assets/img/artwork/custom-moment-map-digital.jpg
moment-matter/assets/img/artwork/custom-moment-map-digital.png
moment-matter/assets/img/artwork/custom-moment-map-example.jpg
moment-matter/assets/img/artwork/custom-moment-map-example.png
moment-matter/assets/img/artwork/custom-moment-map-printed.jpg
moment-matter/assets/img/product-artifacts/Custom_Moment_Map_printed.png
moment-matter/assets/img/product-artifacts/custom_moment_card_digital.png
moment-matter/assets/img/product-artifacts/custom_moment_card_physical.png
moment-matter/assets/img/product-artifacts/custom_moment_map_digital.png
moment-matter/assets/img/product-artifacts/custom_moment_map_digital_example.png
moment-matter/docs/legacy_archives/moment_matter_website_imagery_v2_full_and_merge.zip
moment-matter/docs/legacy_archives/moment_matter_website_v1.zip

## Moment Matter ops manifests

### _ops/moment_matter/routes.manifest.json
{
  "schema": "GOLDLEVEL.moment_matter.routes.manifest.v0.1",
  "lane": "moment_matter",
  "routes": []
}

### _ops/moment_matter/assets.manifest.json
{
  "schema": "GOLDLEVEL.moment_matter.assets.manifest.v0.1",
  "lane": "moment_matter",
  "assets": []
}

### _ops/moment_matter/registry.json
{
  "schema": "GOLDLEVEL.moment_matter.registry.v0.1",
  "lane": "moment_matter",
  "status": "draft",
  "items": []
}

### _ops/moment_matter/validation.receipt.json
{
  "schema": "GOLDLEVEL.moment_matter.validation.receipt.v0.1",
  "lane": "moment_matter",
  "status": "not_validated",
  "checks": []
}

## Root selector references to moment/constraint
index.html:20:        <article class="route-card route-card-matter" aria-labelledby="moment-route-title"><div class="route-card-inner"><div class="route-label">Storefront</div><h2 id="moment-route-title">Moment &amp; Matter</h2><p class="route-lede">For custom visual pieces, meaningful cards, prints, Moment Maps, Clarity Maps, digital files, and physical print editions.</p><ul class="route-list"><li>Custom Moment Cards and Moment Maps</li><li>Clarity Maps for decisions, relationships, and business direction</li><li>Digital delivery and physical formats</li></ul><div class="route-actions"><a class="btn btn-light" href="moment-matter/">Enter Storefront</a><a class="route-small-link" href="moment-matter/shop.html">Shop directly</a></div></div></article>
index.html:40:      <a class="route-selector-card" href="/constraint-map/">
docs/index.html:95:<section id="constraint-map-selector-link" style="margin:24px auto;padding:18px;max-width:760px;border:1px solid #d8c9ad;border-radius:18px;background:#fffaf0;">
docs/index.html:97:  <p style="margin:0 0 12px;">Open the visual constraint map and professional example proof.</p>
docs/index.html:98:  <a href="/constraint-map/" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#201a12;color:#fff;text-decoration:none;">Open Constraint Map</a>
goldlevel/index.html:149:<section id="constraint-map-selector-link" style="margin:24px auto;padding:18px;max-width:760px;border:1px solid #d8c9ad;border-radius:18px;background:#fffaf0;">
goldlevel/index.html:151:  <p style="margin:0 0 12px;">Open the visual constraint map and professional example proof.</p>
goldlevel/index.html:152:  <a href="/constraint-map/" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#201a12;color:#fff;text-decoration:none;">Open Constraint Map</a>
docs/index.html:95:<section id="constraint-map-selector-link" style="margin:24px auto;padding:18px;max-width:760px;border:1px solid #d8c9ad;border-radius:18px;background:#fffaf0;">
docs/index.html:97:  <p style="margin:0 0 12px;">Open the visual constraint map and professional example proof.</p>
docs/index.html:98:  <a href="/constraint-map/" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#201a12;color:#fff;text-decoration:none;">Open Constraint Map</a>
docs/constraint-map/README_TERMUX.md:23:unzip constraint_map_html_build.zip -d constraint-map-site
docs/constraint-map/README_TERMUX.md:24:cd constraint-map-site
docs/constraint-map/assets/app.js:112:  $("#downloadFitResult").addEventListener("click", () => downloadText("constraint-map-fit-check.json", JSON.stringify({ createdAt: new Date().toISOString(), data, result }, null, 2)));
docs/constraint-map/assets/app.js:132:  downloadText("48h-constraint-map-intake.json", JSON.stringify({ createdAt: new Date().toISOString(), data }, null, 2));
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:3:  "route": "constraint-map",
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:5:  "asset_dir": "/data/data/com.termux/files/home/goldlevel.co.uk/constraint-map/assets/img/professional-examples",
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:13:      "src_abs_local": "/constraint-map/assets/img/professional-examples/set_01.png?v=20260504T162945Z",
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:23:      "src_abs_local": "/constraint-map/assets/img/professional-examples/set_02.png?v=20260504T162945Z",
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:33:      "src_abs_local": "/constraint-map/assets/img/professional-examples/set_03.png?v=20260504T162945Z",
docs/constraint-map/assets/img/professional-examples/professional_examples_manifest.json:43:      "src_abs_local": "/constraint-map/assets/img/professional-examples/set_04.png?v=20260504T162945Z",
docs/constraint-map/assets/img/professional-examples/dynamic_story_examples_manifest.json:3:  "route": "constraint-map",
docs/constraint-map/assets/gl-pro-images/manifest.json:3:  "route": "/constraint-map",
docs/constraint-map/DEPLOY_PROOF_c17bdef.txt:1:20260504T171209Z c17bdef docs constraint-map deploy proof
docs/constraint-map/image-proof.html:26:<p><a href="/constraint-map/">Back to Constraint Map</a></p>
docs/constraint-map/LIVE_IMAGE_FIX_PROOF_20260504T180825Z.txt:1:20260504T180825Z constraint-map live image fix installed; route=/constraint-map/; images=assets/gl-pro-images/pro-01.png..pro-04.png; selector_link_required=true
