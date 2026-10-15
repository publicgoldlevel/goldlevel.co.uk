#!/usr/bin/env bash
# Linux Docker installer. It never edits/reloads the existing HTTPS web server.
set +x
set -Eeuo pipefail
umask 077

fail() {
  printf '%s\n' "Deployment stopped: $1" >&2
  if declare -F rollback_pending >/dev/null; then rollback_pending; fi
  exit 1
}
usage() {
  cat <<'EOF'
Usage: sudo bash scripts/deploy-host.sh --bundle /private/staged-bundle \
  --root /opt/goldlevel-uc-private-portal \
  --node-image node:24-bookworm-slim@sha256:<reviewed-64-hex-digest>

The bundle has service/, private-runtime/content/ and
private-runtime/secrets/users.json. No password or ingress key is an argument.
The script builds a code-only image and starts one loopback-bound container.
It generates private ingress fragments; merge/validate/reload HTTPS ingress
separately. A Docker internal network reduces default egress but does not prove
that a compromised process cannot reach its host bridge or exploit its host.
EOF
}

BUNDLE='' ROOT='' NODE_IMAGE=''
while (($#)); do
  case "$1" in
    --bundle) (($# >= 2)) || fail 'Missing bundle path.'; BUNDLE=$2; shift 2 ;;
    --root) (($# >= 2)) || fail 'Missing installation root.'; ROOT=$2; shift 2 ;;
    --node-image) (($# >= 2)) || fail 'Missing pinned image.'; NODE_IMAGE=$2; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) fail 'Unknown argument.' ;;
  esac
done
[[ ${EUID} == 0 ]] || fail 'Run through an authorised sudo/root session.'
case "$ROOT" in
  /opt/goldlevel-uc-private-portal|/srv/goldlevel-uc-private-portal) ;;
  *) fail 'Use the dedicated /opt or /srv installation root shown in help.' ;;
esac
[[ "$NODE_IMAGE" =~ ^node:24(-[a-z0-9.-]+)?@sha256:[a-f0-9]{64}$ ]] || fail 'A Node 24 image with an exact SHA-256 digest is mandatory.'
[[ -n "$BUNDLE" && -d "$BUNDLE" && ! -L "$BUNDLE" ]] || fail 'A real staged bundle directory is required.'
for command in docker realpath find install cp chown chmod date openssl awk sha256sum stat readlink ln mv tr cmp curl; do
  command -v "$command" >/dev/null || fail "Required host command is unavailable: $command"
done
BUNDLE=$(realpath -- "$BUNDLE")
[[ -d "$BUNDLE/service/src" && -f "$BUNDLE/service/compose.yaml" && -f "$BUNDLE/service/Dockerfile" ]] || fail 'Service source is incomplete.'
[[ -s "$BUNDLE/private-runtime/content/manifest.json" && -s "$BUNDLE/private-runtime/secrets/users.json" ]] || fail 'Private manifest or accounts file is missing.'
[[ -z $(find "$BUNDLE/service" "$BUNDLE/private-runtime" -type l -print -quit) ]] || fail 'Symlinks are not accepted in a deployment bundle.'
[[ -z $(find "$BUNDLE/service" "$BUNDLE/private-runtime" ! -type f ! -type d -print -quit) ]] || fail 'Only regular files and directories are accepted.'
[[ ! -L "$ROOT" ]] || fail 'Installation root cannot be a symlink.'
[[ $(realpath -m -- "$ROOT") == "$ROOT" ]] || fail 'Installation root contains an indirect path.'
if [[ -e "$ROOT" ]]; then
  [[ -d "$ROOT" && $(stat -c '%u' "$ROOT") == 0 ]] || fail 'Existing installation root must be a root-owned directory.'
fi
docker compose version >/dev/null || fail 'Docker Compose v2 is required.'
docker info >/dev/null 2>&1 || fail 'The Docker engine is unavailable.'

install -d -m 0700 "$ROOT" "$ROOT/releases" "$ROOT/shared-secrets"
PREVIOUS=''
CREDENTIAL_STATE_CHANGED=0
if [[ -e "$ROOT/current" || -L "$ROOT/current" ]]; then
  [[ -L "$ROOT/current" ]] || fail 'The current release pointer must be a managed symlink.'
  PREVIOUS=$(realpath -- "$ROOT/current")
  [[ "$PREVIOUS" == "$ROOT"/releases/* && -f "$PREVIOUS/deploy.env" ]] || fail 'Previous release pointer is invalid.'
  if ! cmp -s "$BUNDLE/private-runtime/secrets/users.json" "$PREVIOUS/private-runtime/secrets/users.json"; then CREDENTIAL_STATE_CHANGED=1; fi
fi
if [[ -e "$ROOT/private-runtime" || -L "$ROOT/private-runtime" ]]; then
  [[ -L "$ROOT/private-runtime" && $(readlink "$ROOT/private-runtime") == current/private-runtime ]] || fail 'Private runtime alias is not managed by this installer.'
fi
if [[ ! -L "$ROOT/private-runtime" ]]; then ln -s current/private-runtime "$ROOT/private-runtime"; fi

RELEASE="$(date -u +%Y%m%dT%H%M%SZ)-$(openssl rand -hex 6)"
RELEASE_DIR="$ROOT/releases/$RELEASE"
SERVICE="$RELEASE_DIR/service"
RUNTIME="$RELEASE_DIR/private-runtime"
install -d -m 0700 "$RELEASE_DIR" "$SERVICE" "$RUNTIME" "$RUNTIME/secrets" "$RUNTIME/receipts" "$RUNTIME/ingress"
cp -a --no-preserve=ownership -- "$BUNDLE/service/." "$SERVICE/"
cp -a --no-preserve=ownership -- "$BUNDLE/private-runtime/content" "$RUNTIME/content"
install -m 0400 -o 10001 -g 10001 "$BUNDLE/private-runtime/secrets/users.json" "$RUNTIME/secrets/users.json"
chown -R 0:0 "$SERVICE"
chown -R 10001:10001 "$RUNTIME/content"
find "$RUNTIME/content" -type d -exec chmod 0500 {} +
find "$RUNTIME/content" -type f -exec chmod 0400 {} +

# The edge key persists across normal releases. Rotate it only with the ingress.
EDGE="$ROOT/shared-secrets/edge-key"
if [[ ! -e "$EDGE" ]]; then
  openssl rand -base64 48 | tr '+/' '-_' | tr -d '\n' > "$EDGE"
  printf '\n' >> "$EDGE"
fi
[[ -f "$EDGE" && ! -L "$EDGE" ]] || fail 'The shared ingress key must be a regular file.'
edge_value=$(<"$EDGE")
[[ "$edge_value" =~ ^[A-Za-z0-9_-]{64}$ ]] || fail 'Ingress key has an invalid format.'
unset edge_value
chmod 0400 "$EDGE"
if [[ -n "$PREVIOUS" ]] && ! cmp -s "$EDGE" "$PREVIOUS/private-runtime/secrets/edge-key"; then CREDENTIAL_STATE_CHANGED=1; fi
install -m 0400 -o 10001 -g 10001 "$EDGE" "$RUNTIME/secrets/edge-key"
for pair in 'nginx-uc-factual-record.conf.in:nginx-uc-factual-record.conf' 'caddy-uc-factual-record.caddy.in:caddy-uc-factual-record.caddy'; do
  template=${pair%%:*}; generated=${pair#*:}
  [[ -f "$SERVICE/ingress/$template" ]] || fail 'An ingress template is missing.'
  # The secret is read from a file, never put into a command-line argument.
  awk 'FNR == NR { key=$0; next } { gsub(/@@EDGE_KEY@@/, key); print }' "$EDGE" "$SERVICE/ingress/$template" > "$RUNTIME/ingress/$generated"
  chmod 0600 "$RUNTIME/ingress/$generated"
done

cat > "$RELEASE_DIR/deploy.env" <<EOF
PUBLIC_ORIGIN=https://goldlevel.co.uk
PRIVATE_RUNTIME_DIR=$RUNTIME
PORTAL_RELEASE_ID=$RELEASE
EOF
chmod 0600 "$RELEASE_DIR/deploy.env"

compose_release() {
  docker compose --project-name goldlevel-uc-private-portal --env-file "$1/deploy.env" -f "$1/service/compose.yaml" "${@:2}"
}
if [[ -n "$PREVIOUS" && "$CREDENTIAL_STATE_CHANGED" == 1 ]]; then
  printf '%s\n' 'Credential state changed. Stopping the prior portal before build; recovery will not restore its older credential snapshot automatically.'
  compose_release "$PREVIOUS" stop portal
fi

# Pull the exact reviewed base digest. Builds perform no network operations.
docker pull "$NODE_IMAGE"
docker image inspect --format '{{json .RepoDigests}}' "$NODE_IMAGE" > "$RUNTIME/receipts/runtime-image-digests.json"
docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges:true --user 10001:10001 "$NODE_IMAGE" node -p 'JSON.stringify({node:process.version,versions:process.versions,platform:process.platform,arch:process.arch})' > "$RUNTIME/receipts/runtime-versions.json"
docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges:true --user 10001:10001 --entrypoint sh "$NODE_IMAGE" -c 'if command -v dpkg-query >/dev/null 2>&1; then dpkg-query -W; elif command -v apk >/dev/null 2>&1; then apk info -v; else printf "%s\n" "PACKAGE_INVENTORY_TOOL_UNAVAILABLE"; fi' > "$RUNTIME/receipts/os-package-inventory.txt"
printf '%s\n' '{"schema":"portal.inventory-scope.v1","status":"PARTIAL_RUNTIME_AND_OS_PACKAGE_INVENTORY","fullSbom":"NOT_GENERATED","cveScan":"NOT_RUN","zeroVulnerabilityClaim":false}' > "$RUNTIME/receipts/inventory-scope.json"
docker build --pull=false --network=none --build-arg "NODE_IMAGE=$NODE_IMAGE" --tag "goldlevel-uc-factual-record:$RELEASE" "$SERVICE"
docker image inspect --format '{{json .Id}}' "goldlevel-uc-factual-record:$RELEASE" > "$RUNTIME/receipts/application-image-id.json"
sha256sum "$RUNTIME/content/manifest.json" > "$RUNTIME/receipts/content-manifest.sha256"

TRANSITION_STARTED=0
POINTER_COMMITTED=0
rollback_pending() {
  [[ "$TRANSITION_STARTED" == 1 && "$POINTER_COMMITTED" == 0 ]] || return 0
  TRANSITION_STARTED=0
  trap - ERR
  if [[ -n "$PREVIOUS" && "$CREDENTIAL_STATE_CHANGED" == 0 ]]; then
    if ! compose_release "$PREVIOUS" up -d --no-build --wait --wait-timeout 60; then
      printf '%s\n' 'Previous-release restart failed; inspect restricted host state before exposing ingress.' >&2
    fi
  else
    compose_release "$RELEASE_DIR" stop >/dev/null 2>&1 || true
    if [[ "$CREDENTIAL_STATE_CHANGED" == 1 ]]; then
      printf '%s\n' 'Credential state changed. Automatic rollback is disabled to avoid restoring old accounts or an old ingress key. Service remains stopped; carry forward the latest approved credential state before recovery.' >&2
    fi
  fi
}
trap 'transition_status=$?; rollback_pending; exit "$transition_status"' ERR
TRANSITION_STARTED=1
if ! compose_release "$RELEASE_DIR" up -d --no-build --wait --wait-timeout 60; then
  rollback_pending
  fail 'New release failed health checks. Its private files are retained for restricted diagnosis; the current pointer was not changed.'
fi
if ! host_health=$(curl --silent --show-error --noproxy '*' --proto '=http' --connect-timeout 2 --max-time 5 --output /dev/null --write-out '%{http_code}' http://127.0.0.1:8787/_health); then
  rollback_pending
  fail 'Host-loopback health request failed; the release pointer was not changed.'
fi
if [[ "$host_health" != 204 ]]; then
  rollback_pending
  fail 'Host-loopback health did not return HTTP 204; the release pointer was not changed.'
fi
printf '{"schema":"portal.host-install.v1","release":"%s","observedAt":"%s","containerHealth":"PASS_LOCAL","httpsIngress":"MANUAL_INTEGRATION_REQUIRED","dwpAccess":"UNCONFIRMED","independentAssurance":"NOT_ESTABLISHED","globalSecurityPass":false}\n' "$RELEASE" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$RUNTIME/receipts/host-install.json"
ln -s "$RELEASE_DIR" "$ROOT/.current-$RELEASE"
mv -Tf -- "$ROOT/.current-$RELEASE" "$ROOT/current"
POINTER_COMMITTED=1
trap - ERR
printf '%s\n' 'Container installed and locally healthy on 127.0.0.1:8787.'
printf '%s\n' 'Existing HTTPS ingress was not changed. Review the generated private ingress fragments, merge one into the existing site, validate its configuration, and reload through the host operating procedure.'
printf '%s\n' 'Then check the public login, denied unauthenticated document routes, authorised access, logout, and the actual DWP access path. Until then live routing remains unconfirmed.'
