# Reference-aligned control mapping

This is an engineering mapping derived from the supplied CSM/ISO-reference themes. It is not an ISO clause crosswalk, statement of conformity, certification or claim that unknown vulnerabilities have been eliminated. The source archive's historical PASS receipts concern that archive and are not results for this service.

Control evidence follows six distinct stages: design, implementation, configuration, test, observation and effectiveness. A design does not prove implementation; code does not prove correct deployment; a local test does not prove production behavior or continuing effectiveness. Machine-readable rows in `registries/control-registry.json` retain these states separately. The build owner updates local test evidence; the deployment owner updates live observations.

| Theme | Service control | Evidence boundary |
| --- | --- | --- |
| Scope and context | Read-only authenticated route; fixed route registry; code/runtime data separation; whole-dossier recipient access. | Source review and route tests; intended production audience/custody remains an operator gate. |
| Risk and uncertainty | Threat model, residual-risk register, explicit live-release gates. | Local findings are bounded; existing-origin security is unreviewed here. |
| Integrity and configuration | Exact hash-backed content manifest, closed-policy startup checks, private payload outside Git/image, immutable import versions. | Hash identity does not prove factual truth or benign PDF content. |
| Access and authority | Named salted-scrypt accounts; server-side sessions, expiry, CSRF checks, auth before every evidence byte; no web administration. | Tests use synthetic recipients. Account authorization covers all included documents, not separate teams. |
| Communication boundary | Trusted HTTPS ingress key, exact Host/protocol checks, loopback origin, no application outbound/AI/upload surface. | Live proxy/TLS/origin tests remain required; secret headers do not substitute for TLS or host controls. |
| Secure change | Zero npm packages; digest-pinned runtime image; read-only CI, explicit bridge modes, source checks and rollback pair. | Host/runtime/image/proxy updates still need review. A small dependency set is not a vulnerability-free claim. |
| Logging and traceability | UTC events; stable private domain-separated HMAC account pseudonyms; document response metadata on server `finish`; no intended content/token/filename logging. | Pseudonyms persist until edge-key rotation. Server response completion is not client receipt, reading, consideration, acceptance or official record linkage; host retention requires configuration. |
| Incident containment | Stop ingress/service, offline source-account changes followed by new snapshot deployment, session revocation, edge-key rotation and restore runbook. | Restart alone does not disable accounts still enabled in the installed snapshot. Operator exercises and target-host restore evidence remain pending until recorded. |
| Portability and continuity | Provider-neutral code/config/JSON registries; source-preserving import, backups and known-good rollback. | Actual export/restore exercise is a separate production gate. |
| Supplier/provider boundary | Runtime/host/proxy/CI inventory and licenses; no private runtime data in source or build layers. | Supplier capabilities and open-source licenses do not prove control effectiveness. |
| Control effectiveness | Separate six-stage status fields, bounded test receipts and target-host observations. | Continuing effectiveness is not claimed by this package. |
| Formal conformity/certification | Explicit non-certifying claims register and authoritative catalogue links. | No full normative assessment, accredited certification or invented clause mapping. |

Additional design checks preserve operator/source provenance, distinguish evidence rights from the new code's license, minimize private data exposure and require revalidation after a material provider/runtime/capability change. Security controls must preserve usable keyboard access, zoom, text alternatives and ordinary PDF access. No covert tracking or device fingerprinting is introduced.

## Official ISO catalogue metadata

The public catalogue identities and scope summaries below were checked on 15 October 2026. The full licensed normative texts and exact clause mapping were not obtained. These links support reference context only; they do not establish that this service or its operator meets the standards.

| Reference | Official source | Context used |
| --- | --- | --- |
| ISO/IEC 27001:2022 and Amd 1:2024 | [Catalogue](https://www.iso.org/standard/27001), [amendment](https://www.iso.org/standard/88435.html) | Scope, ownership and risk-based security management. |
| ISO/IEC 27002:2022 | [Catalogue](https://www.iso.org/standard/75652.html) | Selection and implementation of information-security controls. |
| ISO/IEC 27037:2012 | [Catalogue](https://www.iso.org/standard/44381.html) | Identity, collection and preservation of digital evidence. |
| ISO/IEC 27040:2024 | [Catalogue](https://www.iso.org/standard/80194.html) | Storage-security design and lifecycle. |
| ISO 22301:2019 and Amd 1:2024 | [Catalogue](https://www.iso.org/standard/75106.html), [amendment](https://www.iso.org/standard/88412.html) | Interruption, continuity and recovery. A replacement revision is under development and is not substituted for the published reference. |

## Independent critical-review orientation

Lee, S., Hwang, S., Kim, D. and Lee, K. (2025), *Conversational Agents as Catalysts for Critical Thinking: Challenging Social Influence in Group Decision-making*, CHI EA 2025, arXiv:2503.14263v1, informs the review process. [Author-supplied preprint record](https://arxiv.org/abs/2503.14263v1).

Its human-group experiment supports specific, appropriately timed challenges and preserving minority concerns; it does not validate this software's security. The reported change in psychological safety was not statistically significant, and its positive/negative-cycle diagram is explicitly theoretical. This project uses concurrent source, boundary and security reviews with a recorded counterargument and evidence-based resolution. Agent agreement and a paper citation are not proof, and no native execution of the supplied full frameworks is claimed.

The central challenger findings are retained as release gates: a password page does not protect a publicly served payload; code and private evidence must be separated; the requested URL shares origin trust with the existing site; existing XSS or a root-scoped service worker could bypass the intended confidentiality boundary. These require deployment evidence, not a stronger claim in the documentation.
