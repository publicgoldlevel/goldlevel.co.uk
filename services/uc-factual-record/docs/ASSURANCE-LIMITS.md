# Assurance limits and release conditions

This package is a candidate implementation for a private, password-protected route. Source review and local automated checks provide bounded evidence for the tested code and inputs. They do not establish production security, official receipt, a zero-day-free system or ISO certification.

## Observed environment

The implementation environment provides Node.js 24.19.0 for local native execution. Docker, PowerShell and an interactive browser were not available for end-to-end acceptance in this build environment. No live repository, hosting account, DNS configuration, TLS endpoint or deployed portal was connected or inspected as part of this candidate preparation. The acceptance registry and test receipts must distinguish actual local results from pending checks.

A local Node.js test does not exercise the Docker image, reverse-proxy topology, internal-network enforcement, production filesystem permissions or PowerShell-to-GitHub bridge. A syntax check does not show browser rendering, assistive-technology behavior, PDF-viewer behavior or successful login through the live TLS endpoint.

## Required before deployment acceptance

1. Review the repository integration against the existing hosting stack; bind the exact repository, branch, commit, host and route. Keep the private evidence mount outside Git and all build/publish outputs. Confirm no static host or legacy route exposes a historical copy.
2. Supply unique recipient credentials and ingress secrets through the deployment secret mechanism. Test creation, expiry, revocation, failed-login limits, CSRF and idle/absolute session expiry. Confirm cookies are secure at the actual HTTPS origin.
3. Build the pinned runtime image on the deployment platform. Review dependency, base-image, license and vulnerability results for the actual release digest. Patch/rebuild when supported security fixes become available. A scan with no reported findings does not prove absence of vulnerabilities.
4. Exercise the reverse proxy and origin together: only the intended path is forwarded; application port is not public; forged ingress headers are rejected; the origin cannot initiate unintended external connections; liveness reveals no content.
5. Test unauthenticated, expired and revoked sessions against HTML, document, text, asset, HEAD and Range routes. Test path normalization, encoded separators, traversal, unsupported methods and direct URLs. Check private content never appears in unauthenticated bodies, shared caches, redirects, logs or error pages.
6. Confirm TLS, host validation, security headers, caching behavior, robots exclusion and absence from public navigation/sitemaps/search indexes. Robots and noindex are discovery controls, not confidentiality controls; authorization must protect every private byte.
7. Complete browser, keyboard, mobile, screen-reader, document-viewing and download checks with the deployed service. Provide a practical access-assistance path and a separately confirmed official submission route where required.
8. Run the PowerShell deployment workflow in the target environment with least-privilege repository/environment permissions. Inspect the staged changes and artifact contents before push; keep secrets and evidence out of Git, workflow artifacts and command logs.
9. Record the accepted commit/image/content digests and retain a tested rollback to a prior known version. Confirm backup custody, restore behavior, retention and incident access revocation.

## Evidence and authority

The supplied harnesses and orientation texts are identified by filename and SHA-256 in `registries/source-registry.json`. Historical receipts, native harness test results, static readings, derived architectural controls and current service tests are separate evidence classes. Repeated analysis of one source is not independent corroboration. A source-authored oracle or checklist does not certify its own production acceptance.

The paper on group decision-making supports a limited review-process analogy: retain dissent, ask for specific counterarguments, adapt review roles and avoid repetitive cognitive load. Its human-subject study did not validate an AI security firewall or this service. Psychological-safety improvement in the reported experiment was not statistically significant.

Standards mappings are design and evidence-management aids. No ISO certification, accredited audit, legal compliance opinion, external penetration test or independent production-security evaluation is represented by this package.

## Residual risks

Credential sharing or compromise, recipient devices, browser extensions, screen capture, downloaded copies, privileged-host compromise, undiscovered runtime flaws, hosting mistakes, dependencies, denial of service, mistaken content inclusion and third-party availability remain relevant risks. Controls aim to reduce exposure and blast radius and preserve correction and recovery. They cannot guarantee zero-day removal or prevent an authorized recipient from retaining a copy.

The private portal is an additional claimant-provided reference route. Authentication and server audit events do not prove that a particular official received, accessed, considered or accepted evidence. Record official delivery, acknowledgment and procedural decisions separately.

## Reopening conditions

Hold or reopen acceptance when the input manifest, source content, route set, authentication policy, runtime/image, hosting network, secrets, recipient list or legal purpose changes; when a security finding or unexpected access event appears; or when a previously pending live check fails. Bind new tests to the changed version rather than inheriting an earlier PASS.
