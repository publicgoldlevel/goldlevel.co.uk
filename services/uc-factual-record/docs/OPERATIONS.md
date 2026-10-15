# Operator runbook

The deployment target is one Linux Docker host behind the existing trusted HTTPS ingress. The public route is `/uc_factual_record`. The package prepares the service and bridge; it does not establish the existing repository, DNS, certificates, ingress, production credential custody or reviewer access by itself.

## Keep code and runtime separate

`repo-overlay/services/uc-factual-record` is the code that may be staged to the existing repository. `private-runtime` is a separate delivery directory for private content, account data and the ingress key. Keep it outside Git, the public webroot and container build context. Inspect the staged diff before a push. Never attach the private delivery directory to a GitHub issue, release, Pages deployment or Actions artifact.

The evidence route is claimant provided. It supplements official correspondence and upload arrangements. Operating it does not establish official submission, document acceptance, legal sufficiency or DWP receipt. All included evidence is shared by every enabled recipient account; there is no per-team access-control layer. Restricted financial originals are excluded and require a separately agreed secure route.

## Local verification

From the service directory:

```sh
node scripts/check-source.mjs
npm test
```

The source check rejects common private-material markers and unexpected npm dependencies and checks JavaScript syntax. It is a bounded check, not a general secrets or vulnerability proof. Tests use synthetic records. Keep the generated command/runtime/result receipts with the release. Tests, target-host observations and long-term effectiveness have separate registry states.

Use the account and import helpers' `--help` before making changes:

```sh
node scripts/account.mjs --help
node scripts/import-bundle.mjs --help
```

Import revised evidence into a new empty private directory. Review the selected source and preserve an immutable original and manifest. Verify the new payload, then change the runtime mount and restart. Retain the preceding reviewed version for rollback. Do not edit a live content directory in place or bypass an integrity failure.

## Required runtime settings

| Setting | Deployment value or rule |
| --- | --- |
| `PUBLIC_ORIGIN` | Exact HTTPS origin, without a trailing slash; default target `https://goldlevel.co.uk`. |
| `BASE_PATH` | `/uc_factual_record`; proxy must preserve the prefix. |
| `CONTENT_DIR` | Private manifest-backed content mount, `/content` in the container. |
| `USERS_FILE` | Private account file, `/run/secrets/users.json`. |
| `EDGE_KEY_FILE` | Private random ingress key, `/run/secrets/edge-key`. |
| `PORT` | `8080` in the container. |
| `HOST` | Container bind may be `0.0.0.0`; host publication is loopback only. |

Provision distinct strong credentials for named reviewers and a short operational account expiry. Convey credentials through an agreed private channel; keep them out of repository history and this runbook. Account hashes remain sensitive. Confirm the reviewer can use the sign-in page and PDFs with their permitted device and network. Do not infer official identity solely from knowledge of the credentials.

## PowerShell / GitHub / SSH bridge

Read the bridge help before use:

```powershell
Get-Help ./scripts/Bridge-Goldlevel.ps1 -Full
```

The bridge requires PowerShell 7. Its modes are separate:

1. `-Mode Account -RuntimePath <private-runtime-directory> -Username <reviewer-name> -AccountAction add|rotate|revoke|list` changes the operator-owned source account file. Add/rotate use secure prompts and raw stdin to the offline helper; no password is a command-line argument. `-AccountDays` accepts 1-90 days and defaults to 30. For `list`, a username is unnecessary. Account changes are not live until a new snapshot is deployed.
2. `-Mode Stage -RepoPath <existing-clone>` copies the code overlay to the selected checkout. It does not change branches or push. Review the diff; an intentional existing-service update requires `-ReplaceExistingService` after review/backup.
3. `-Mode Push -RepoPath <existing-clone> [-Branch <branch-name>]` additionally requires `-ConfirmPush`; it selects the target branch before source checks/tests and never force-pushes. This action writes to the selected GitHub repository. It does not transfer evidence or deploy.
4. `-Mode Deploy -SshTarget <user@host> -SshIdentityFile <private-key> -KnownHostsFile <preverified-known-hosts> -RuntimePath <private-runtime-directory> -NodeImage <digest-pinned-image>` transfers code and private runtime files directly over SSH and invokes the host deployment helper. Do not bypass SSH host-key verification. The approved remote roots are `/opt/goldlevel-uc-private-portal` and `/srv/goldlevel-uc-private-portal`.

The Linux helper accepts `--bundle`, `--root` and `--node-image`. It builds the code image and starts the service with host binding `127.0.0.1:8787`. Generated Nginx/Caddy ingress fragments reside in the private runtime ingress directory because they contain the edge key. Review and merge the selected fragment into the existing HTTPS site's configuration; never replace the site's entire configuration. Validate and reload the actual ingress using its native tooling. This merge/reload is an explicit deployment gate.

Resolve and review the Node 24 base image digest before deployment; do not invent a digest or use a floating tag for the release. Record the tested digest in the deployment receipt. Rebuild and retest deliberately when it changes.

## Pre-launch gates

- Verify the exact repository/branch, visibility, deployment host, private-path permissions and backup custodian.
- Confirm DNS, certificate issuance/renewal, TLS settings and a trusted loopback upstream. Configure the ingress to overwrite the edge key and client-IP headers, preserve Host/path, forward `https`, and avoid caching. Do not forward arbitrary client-supplied trusted headers.
- Review the whole existing origin for XSS and compromised scripts. Inspect and remove or constrain service workers covering this path. The requested path shares origin security with the rest of the website; a portal-only test cannot close this gate.
- Check anonymous access to every case/download/text route fails, direct origin access cannot bypass the edge, wrong Host/edge/proto requests fail, and authenticated source bytes match their manifest.
- Verify logout, expiry, account disable/restart and service restart invalidate access. Check the login and record with keyboard, screen reader, mobile zoom and the intended PDF/browser environment. Keep an accessible alternative and an access-help contact.
- Confirm logs exclude private content and secrets, retention is configured and a clean restore succeeds. Record actual observations in the release registry; do not replace an open gate with an assumption.

## Revocation, rotation and interruption

To revoke one reviewer, disable or expire that account in the operator-owned source `private-runtime/secrets/users.json` using the offline account helper, then redeploy that source runtime through the bridge. The installer creates a new protected account snapshot and recreates the service, which revokes all active sessions. Do not run the account helper against an installed release snapshot: that file is owned by the container account and is read-only. Editing the source file and restarting the old installed release does not copy the changed accounts and does not revoke the account.

For urgent revocation, stop the service or disable the ingress route first, then update the source and redeploy. A plain restart invalidates existing sessions, but an account still enabled in the installed snapshot can sign in again. Expect all reviewers to sign in again after deployment or restart.

To rotate the ingress key, stop access in a controlled maintenance window and update the protected installation's `shared-secrets/edge-key` source, not only a release copy. Regenerate the private release key and ingress fragments through the installer, then reload the reviewed ingress configuration. The application and ingress must agree on the key; mismatch fails closed. The installer compares approved incoming account and ingress-key state with the previous release. If either differs, it stops the prior service before the build and disables automatic fallback to the old credentials/key. Failure leaves the service stopped; manual recovery must carry forward both latest approved states. Test direct-origin rejection and legitimate login after rotation. Key rotation also changes the audit-pseudonym key, so account pseudonyms cannot be assumed to match across that boundary.

Sessions and rate counters are memory-only. A restart resets counters and revokes sessions; it does not erase the evidence or revoke already downloaded copies. Do not add replicas without a new shared-state design and tests.

## Logs and retention

The application emits UTC security-event records with a short private HMAC account pseudonym. The audit key is derived with a separate domain label from the ingress key. Pseudonyms persist across service restarts while that key is unchanged and change on ingress-key rotation. They are a limited operational correlation aid, not proof of a recipient's identity. Treat them and document metadata as private, linkable operational data. The application does not intentionally log passwords, tokens, full IPs, filenames, document content or private URL fragments.

`RECORD_REQUESTED` means an authenticated request reached the HTML response path; it is not proof that delivery finished. `DOCUMENT_RESPONSE_SENT` is emitted on the server response's `finish` event and records the opaque document ID, whole-source SHA-256, HTTP method/status and response-body byte count. `HEAD` records zero body bytes; a byte-range response records only that range's byte count. A PDF viewer can create several events for the same document. These events mean the server finished handing the response to its transport; they do not prove client receipt, a complete download, opening/reading, DWP receipt, consideration, acceptance or official record linkage.

Configure bounded Docker/host log rotation and limited filesystem access. Default operator policy: retain portal security logs for no more than 30 days unless a documented active incident requires a specific extension, then review and delete when no longer needed. Record the effective host/proxy/Docker retention settings; the application does not enforce host retention. Inspect reverse-proxy logs separately so request bodies, secrets and private URLs are not logged or forwarded to analytics. Do not enable session replay, fingerprinting or third-party telemetry.

## Backup, restore and rollback

Maintain an encrypted offline or otherwise isolated backup of the reviewed content, manifests, account file, edge key and deployment configuration, under a named custodian. Keep recovery material separate from the live host. Record version, date, hash and retention; do not treat a backup's existence as proof of recovery.

Before launch, restore to a clean private location, validate content hashes, reconcile the account file with the latest approved disabled/expiry state, create a synthetic login exercise, verify protected routes and revoke the test session. Restoring a historical account file must not reactivate revoked credentials. Do not expose real evidence during a restore test. Record the result. The actual target-host backup/restore exercise is pending until performed by its operator.

Rollback uses the preceding reviewed code image digest and matching private content manifest, while retaining the latest approved account disabled/expiry state and current ingress key. Stop the service, select the reviewed pair, reconcile both credentials and key before startup and rerun boundary/access checks. Never blindly start an older account snapshot that would re-enable revoked access or restore an obsolete ingress key. Automatic fallback is disabled when account or edge-key state changes. Any rollback resets sessions. An interrupted or killed deployment can leave the release pointer and actual container state different; reconcile both before recovery. Preserve the failed release and bounded incident evidence for diagnosis without publicly publishing private material.

## Periodic review

Review account expiry, enabled recipients, host/proxy/runtime advisories, image updates, logs, certificates and restore readiness. Revalidate after content, origin, ingress, runtime, dependency or AI-capability changes. A future AI component or uploads endpoint requires a new threat model and release gate; closed capability policy must not be silently relaxed.
