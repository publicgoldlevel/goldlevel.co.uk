#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="${1:-_ops/release_control/SOURCE_ARCHIVE_REGISTER.md}"

SEARCH_ROOTS=(
  "$HOME/storage/downloads"
  "$HOME/storage/shared/Download"
  "$HOME"
)

NAMES=(
  "GL_LLM55_DATASET_PORTABLE_EXECUTION_PACK_v0_1_0.zip"
  "CHATRMD_PYTHON_SOURCE_BANK_PACK_v0_1_0.zip"
  "CHATRMD_PYTHON_SOURCE_BANK_PACK_v0_1_0 (1).zip"
  "GOLDLEVEL_HYBRID_SITE_WORKING_v0_2_0.tar"
  "GOLDLEVEL_HYBRID_SITE_PATCH_v0_2_0.zip"
  "WEB__goldlevel_unified_domain_selector_and_storefront_v1.zip"
  "GL_UNIFIED_INTAKE_BLUEPRINT_PACK_v0_1_0.zip"
  "GOLDLEVEL_EXECUTION_LOOP_REDUCTION_REPORT_v0_1_0.md"
)

mkdir -p "$(dirname "$OUT")"

{
  echo "# Source Archive Register"
  echo
  echo "- UTC: $STAMP"
  echo "- Purpose: locate archives/source packs available to this Termux workspace."
  echo "- Execution note: archives are registered and checksummed; this script does not execute arbitrary archive code."
  echo
  echo "| Name | Found | Path | Size bytes | SHA256 |"
  echo "|---|---:|---|---:|---|"

  for name in "${NAMES[@]}"; do
    found=""
    for r in "${SEARCH_ROOTS[@]}"; do
      [ -d "$r" ] || continue
      hit="$(find "$r" -maxdepth 8 -type f -name "$name" 2>/dev/null | sort | tail -n 1 || true)"
      if [ -n "$hit" ]; then
        found="$hit"
        break
      fi
    done

    if [ -n "$found" ]; then
      size="$(wc -c < "$found" | tr -d ' ')"
      sha="$(sha256sum "$found" | awk '{print $1}')"
      echo "| $name | yes | \`$found\` | $size | \`$sha\` |"
    else
      echo "| $name | no |  |  |  |"
    fi
  done
} > "$OUT"

echo "$OUT"
