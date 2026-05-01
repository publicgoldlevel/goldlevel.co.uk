# GOLDLEVEL Full Git Diagnosis Findings Classification

Diagnosis source: `/data/data/com.termux/files/home/storage/shared/Download/GL_FULL_GIT_DIAG_goldlevel.co.uk__20260501T195336Z`

## 1. Summary

| Area | Count |
|---|---:|
| tracked_files | 342 |
| untracked_files | 0 |
| modified_files | 0 |
| deleted_files | 0 |
| html_files | 46 |
| offer_landing_candidates | 6 |
| selector_candidates | 19 |
| missing_local_assets | 2 |
| danger_scripts | 0 |
| secret_hits_redacted | 1 |
| public_private_lane_risks | 30 |

## 2. Missing local assets

| HTML file | Link | Resolved path | Classification | Action |
|---|---|---|---|---|
| `lifecoachlanding/components/clarity-gap-diagnostic-panel/problem_section.html` | `assets/generated/problem/problem-4x5-768.webp` | `lifecoachlanding/components/clarity-gap-diagnostic-panel/assets/generated/problem/problem-4x5-768.webp` | REVIEW_REQUIRED | Check whether stale path, wrong route, missing asset, or acceptable placeholder. |
| `lifecoachlanding/components/clarity-gap-scene/problem_scene.html` | `assets/generated/problem/problem-4x5-768.webp` | `lifecoachlanding/components/clarity-gap-scene/assets/generated/problem/problem-4x5-768.webp` | REVIEW_REQUIRED | Check whether stale path, wrong route, missing asset, or acceptable placeholder. |

## 3. Secret-like redacted hits

| File | Line | Pattern | Redacted excerpt | Classification | Action |
|---|---:|---|---|---|---|
| `moment-matter/assets/js/shopify-buy-buttons.js` | 5 | `generic_token_assignment` | `const TOKEN=***REDACTED*** \|\| '').trim();` | REVIEW_REQUIRED | Open locally. If real credential: remove + rotate. If placeholder: document false positive. |

## 4. Public/private advisory risks

Broad scanner flags only. They do not automatically prove exposure.

Count: 30

| File | Reason |
|---|---|
| `goldlevel/diagnostic-read.html` | `diag` |
| `moment-matter/archive.html` | `archive` |
| `docs/landing/assets/meta/landing_receipt.txt` | `receipt` |
| `landing/assets/meta/landing_receipt.txt` | `receipt` |
| `moment-matter/docs/legacy_archives/goldlevel_site_cmode_release_v3.zip` | `archive` |
| `moment-matter/docs/legacy_archives/moment_matter_website_imagery_v2_full_and_merge.zip` | `archive` |
| `moment-matter/docs/legacy_archives/moment_matter_website_v1.zip` | `archive` |
| `moment-matter/docs/source_material/00_MASTER_SEQUENCE_IMAGE_CREATOR.md` | `source` |
| `moment-matter/docs/source_material/01_the_raw_signal.md` | `source,raw` |
| `moment-matter/docs/source_material/02_the_vessel.md` | `source` |
| `moment-matter/docs/source_material/03_distillation.md` | `source` |
| `moment-matter/docs/source_material/04_testing.md` | `source` |
| `moment-matter/docs/source_material/05_conversation.md` | `source` |
| `moment-matter/docs/source_material/06_study.md` | `source` |
| `moment-matter/docs/source_material/07_creation.md` | `source` |
| `moment-matter/docs/source_material/08_destruction.md` | `source` |
| `moment-matter/docs/source_material/09_projection.md` | `source` |
| `moment-matter/docs/source_material/10_refinement.md` | `source` |
| `moment-matter/docs/source_material/11_nature_and_matter.md` | `source` |
| `moment-matter/docs/source_material/12_silence.md` | `source` |
| `moment-matter/docs/source_material/99_BATCH_COPY_PASTE_PROMPTS.md` | `source,prompt` |
| `moment-matter/docs/source_material/Author_Event_Lessons_Master_SourceVoice_v0_1_4_CREATIVE_PHASE_TRANSITION.md` | `source` |
| `moment-matter/docs/source_material/LIVED_ALCHEMY_TEXT_OVERLAY_COPY_PASTE_LOCK_v1_0.md` | `source` |
| `moment-matter/docs/source_material/LIVED_ALCHEMY_TEXT_OVERLAY_STEP_BY_STEP_ONLY_v1_0.md` | `source` |
| `moment-matter/docs/source_material/LIVED_ALCHEMY_TRANSPARENT_PNG_TEXT_OVERLAY_DRIVER_v1_0.md` | `source` |
| `moment-matter/docs/source_material/NEW_WORK_SINGLE_MASTER_EXECUTABLE_v2_1.md` | `source` |
| `moment-matter/docs/source_material/RETURN_PASSAGE_MONEY_ABUNDANCE_FIRST_SET_MASTER_v1.md` | `source` |
| `moment-matter/docs/source_material/SourceVoice_Literary_Craft_Master_Canonical_v0_1_0.md` | `source` |
| `lifecoachlanding/components/clarity-gap-diagnostic-panel/problem_section.css` | `diag` |
| `lifecoachlanding/components/clarity-gap-diagnostic-panel/problem_section.html` | `diag` |

## 5. Overseer decision

Do not rebuild the site. Resolve/classify the missing assets and secret-like hit, then return to buyer acquisition and delivery proof.
