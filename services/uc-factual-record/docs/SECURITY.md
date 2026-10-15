# Security design and reporting

This is a small read-only service behind a trusted HTTPS ingress. The repository and container image contain code only. Private evidence, account hashes and the ingress key are runtime files mounted outside Git and the image.

The application does not provide uploads, account administration, AI/model/tool execution, arbitrary redirects, remote URL retrieval or general filesystem access. Closed capability policy and a constrained container reduce exposed functionality. They do not establish that unknown vulnerabilities have been removed. This package makes no ISO conformity, certification, zero-day elimination or complete security assurance claim.

## Access boundary

- The ingress terminates TLS, preserves the public Host and requested path, overwrites `X-Forwarded-Proto`, `X-Portal-Client-IP` and `X-Portal-Edge-Key`, and sends requests only to the loopback-bound service. The application requires the configured Host, `https` forwarding value and secret edge key before handling portal routes.
- `/_health` is an empty liveness response. It contains no record, account or configuration information. All case HTML, source-document bytes, extracted text and reader assets require an authenticated session. The generic login page and its style contain no evidence.
- Named accounts use salted scrypt password hashes. The application has no signup or web-based reset route. Enabled state and expiry are checked for authenticated requests. Account changes belong in the operator-owned source runtime file, followed by redeployment to install a new protected snapshot and revoke sessions. Editing a source file or restarting an unchanged snapshot alone does not disable an account. A named account grants access to the whole included dossier; account names do not provide per-team or per-document isolation. Separately restricted financial originals are excluded from this package.
- Login uses a one-use expiring pre-authentication proof and same-origin checks. Successful login creates a new random server-side session. Logout requires a session-bound proof and invalidates the session.
- Cookies use `Secure`, `HttpOnly`, `SameSite=Strict` and the portal path. Sessions expire after 30 minutes of inactivity or eight hours in total. Sessions and rate counters are in memory: restart revokes every session and resets counters. Use one service instance; multi-replica deployment requires a separately reviewed shared session/rate design.
- Authentication attempts have per-IP, account and global limits, plus a bound on concurrent password hashing. Request size, header size, methods, paths, connection counts and timers are constrained. Rate limits can also delay legitimate reviewers; provide an access-help route through existing correspondence.

## Shared-origin release gate

`https://goldlevel.co.uk/uc_factual_record` shares a browser origin with the existing website. A path and an `HttpOnly` cookie do not create an isolated origin. XSS or compromised same-origin scripts elsewhere on the website could make authenticated requests and read responses while a recipient is signed in. A root-scoped service worker could intercept or persist portal content even when server responses say `no-store`.

Before launch, review the existing site's scripts, user-controlled content, CSP and dependencies. Inspect active service-worker registrations and deployment scripts; remove or restrict any scope that can control `/uc_factual_record`. The portal registers no service worker. The existing repository and browser registrations were not available for this package's local review, so these gates remain open. Do not treat cookie-path scoping, portal CSP or cache headers as resolving this risk. A separate hostname is the stronger future isolation option if the operator chooses to change the requested URL.

## Private bytes and transport

Keep the source-of-record and imported content outside the public webroot and outside the repository overlay. The importer writes a manifest-backed payload to a separate runtime directory; startup validates the files against that manifest. Original document bytes are preserved. Identity hashes show consistency with a selected source, not factual authenticity, benign PDF behavior or official receipt. Restore and rollback must preserve current account revocations; a historical release's old account snapshot is not an approved source of current access rights.

Authenticated responses carry restrictive cache, indexing, referrer and framing headers. The HTTPS ingress/CDN must not cache portal paths and must preserve those headers. Do not expose the container or upstream port publicly. Browser downloads and recipient copies cannot be revoked after delivery. A successful HTTP event does not establish that an official recipient reviewed, accepted or linked a document.

## Runtime and supply chain

Use the supported Node.js 24 runtime and an explicitly resolved image digest. There are no npm dependencies. The runtime, container base, operating system, Docker, reverse proxy and host still require security updates and vulnerability review. Rerun checks after a runtime/image/proxy/content-policy change. The production container runs with reduced privileges, a read-only filesystem, constrained resources and an internal network as defined in the deployment files. No outbound application feature is implemented.

Keep GitHub permissions and deployment credentials separate from recipient accounts. The workflow tests synthetic material and builds without private evidence; it does not deploy. Never add evidence or credentials to Actions artifacts, caches, release attachments or image layers. Administrative GitHub/host accounts should use phishing-resistant MFA where supported and a separately protected recovery route.

## Reporting and response

Security events use UTC timestamps and a private stable HMAC account pseudonym derived through a domain-separated key from the ingress key. Pseudonyms remain correlatable across restarts until that key rotates. Document-response events additionally contain an opaque document ID, source SHA-256, method, status and response-byte count. Protect these metadata logs as private operational records; do not publish the manifest mapping or treat pseudonyms as anonymous public data. See the runbook for exact event meanings and retention.

Report a suspected problem privately to the repository owner through the established private contact route. Do not open a public issue containing record excerpts, document links, personal details, passwords, account hashes or tokens. Record the affected release, UTC time, generic route and minimal reproduction with synthetic inputs where possible.

For suspected exposure, disable ingress access or stop the service, preserve bounded security logs, disable affected accounts in the operator-owned source and redeploy a new snapshot, rotate the edge key if needed and restore a reviewed release. Restart revokes sessions but does not disable accounts still enabled in the installed snapshot. Assess impact before restoring access. See [OPERATIONS.md](OPERATIONS.md) and the risk/release registries. Independent security review and live-host observations remain separate from local test evidence.
