# Technical reference register

Primary sources checked 15 October 2026. These inform design choices; they do not verify the deployment, certify the service or establish that unknown vulnerabilities are absent.

| Source | Application in this implementation |
| --- | --- |
| [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Generic failed-login responses and bounded login attempts; enabled, unknown and expired accounts do not receive identifying error text. |
| [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | Fixed scrypt cost N=131072, r=8, p=1; a native runtime primitive avoids adding a password-package dependency. |
| [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Random opaque session tokens, secure cookie attributes, server expiry and logout invalidation. |
| [Node.js 24 HTTP documentation](https://nodejs.org/docs/latest-v24.x/api/http.html) | Explicit request/header size and time limits. The local test runtime was 24.19.0; deployment must resolve and record a reviewed current Node 24 image. |
| [Caddy reverse_proxy documentation](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) | Explicit upstream Host and trusted headers. The actual proxy chain remains a deployment review item. |
| [Docker Compose services](https://docs.docker.com/reference/compose-file/services/) | Explicit secret target filenames. File-backed secrets preserve host ownership, so the installer assigns the container UID on its read-only snapshots. |
| [Docker port publishing](https://docs.docker.com/engine/network/port-publishing/) | Loopback host publication and a dedicated internal bridge. Internal networking is not a guarantee against access to host-bridge services after a compromise. |
| [Docker Compose networking](https://docs.docker.com/compose/how-tos/networking/) | Private runtime network; host reachability and egress behaviour must be observed on the actual Docker engine. |
| [actions/checkout v6.1.0 commit](https://github.com/actions/checkout/commit/d23441a48e516b6c34aea4fa41551a30e30af803) | CI action pinned to a checked full commit, with repository-read permissions and persisted credentials disabled. |

No private case links appear in this source register. Supplied process and orientation references have separate hashes and evidence ceilings in `registries/source-registry.json`.
