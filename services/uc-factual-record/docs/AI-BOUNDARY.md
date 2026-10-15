# Closed capability boundary

This service implements a free, open-source, deterministic boundary for a private read-only record portal. It does not run a model. Its source is MIT licensed and uses Node.js built-in modules; the runtime does not need an inference provider, API key, model download, telemetry service or model guard.

`policy/ai-boundary.json` is a startup contract. Version 1 requires `mode: closed` and all four capability flags set to `false`: model calls, tools, uploads and server-initiated outbound requests. A policy that enables them must not start this service. `allowedRoutes` is the base-relative route inventory, mounted under the configured `BASE_PATH`, except the internal liveness path `/_health`. The separate route registry documents methods, authentication and CSRF conditions. Route templates accept only the implementation's restricted document identifiers; they are not arbitrary filesystem paths.

## Enforcement layers

- Fixed routes and strict path parsing reject unregistered paths, model/tool endpoints, upload endpoints and arbitrary fetch/proxy requests. Unknown routes are denied. Private content is served only after origin-side authentication and current-session checks.
- File and text routes resolve only identifiers already present in the private content manifest. Request values never select a free-form file or remote URL.
- The deployment design places the origin on an internal Docker network behind a fixed reverse-proxy ingress. Origin access additionally requires the configured ingress credential. The service has no published public application port. Deployment acceptance must verify these properties in the actual host.
- The response Content Security Policy restricts active browser resources, blocks cross-origin script connections while allowing authenticated same-origin document-text requests, and prevents uncontrolled framing and form destinations. It complements authentication and route authorization.
- Uploaded evidence data is mounted separately and read-only. It is excluded from the repository, build context, container image and CI artifacts. Credentials are supplied separately at deployment.

These controls are a closed AI capability firewall in the sense of denying AI/model/tool capabilities and minimizing reachable routes. They are not a learned attack detector or prompt-content filter. An HTTP web application firewall, optional future model guard and this authorization boundary cover different surfaces. None replaces the others or guarantees detection of unknown attacks.

## Deliberate external links

The server does not fetch external evidence links. A signed-in reader may deliberately follow a link in their own browser. Such top-level user navigation is distinct from server outbound requests and background browser connections. A link opening or download establishes neither official receipt nor acceptance. Third-party availability remains outside this service's control.

## Future AI changes are held

Adding an assistant, summarizer, OCR service, model, remote tool, upload feature or outbound fetch is outside the version-1 runtime boundary. Enabling it requires a new versioned architecture and threat review, data-flow and retention decisions, explicit permitted inputs, restricted network and tool permissions, tests and release approval. Merely changing a flag must not create a functioning AI endpoint.

Untrusted documents, retrieved text and model output must always remain data. They must not become instructions, authentication claims, deployment permissions, file selectors or executable code. Any future guard must fail closed within the guarded optional feature and leave deterministic document access independent of AI availability.

## What the boundary cannot establish

A closed policy reduces capability and attack surface. It cannot remove all zero-day vulnerabilities, prove the runtime or host is uncompromised, establish a recipient's identity beyond the configured credentials, establish an official submission, or confer ISO certification. Live network isolation, ingress binding, TLS, content exposure and secret handling must be tested after the actual hosting bridge is connected.
