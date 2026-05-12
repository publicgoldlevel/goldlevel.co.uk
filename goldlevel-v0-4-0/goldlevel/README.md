# GOLDLEVEL Website README

## 1. Site purpose
This site is a system-first public website for GOLDLEVEL.
It introduces the public system, shows what is live now, separates public artifacts from service routes, and preserves room for later multi-surface expansion.

## 2. Public positioning
Public-facing position:
GOLDLEVEL is a developing public system for turning pressure, complexity, decision-noise, and structural ambiguity into legible public briefs, bounded diagnostics, decision packets, and later multi-surface outputs.

System-first rule:
The site is system-first, not package-first.

Homepage rule:
The homepage introduces the system and the live entry points.
Packets are public proofs and library items, not the whole identity.

Boundary rule:
Internal commentary must never appear on public pages.
Public pages must be legible on first contact.

## 3. Information architecture

### Top-level routes
- `index.html` — Home
- `start-here.html` — Start Here
- `system.html` — System
- `library.html` — Library
- `services.html` — Services
- `whats-live.html` — What's Live
- `contact.html` — Contact

### Supporting routes
- `briefs-packets.html` — Briefs & Packets
- `diagnostic-read.html` — Diagnostic Reads
- `packages.html` — Packages
- `method.html` — Method
- `what-this-is.html` — What This Is
- `good-fit.html` — Good Fit
- `input-return.html` — Input & Return
- `boundary.html` — Boundary
- `relationship-packet-payment.html` — Relationship packet full text access page

### Backward compatibility routes
- `book-a-read.html` -> `contact.html`
- `scope.html` -> `input-return.html`
- `proof.html` -> `boundary.html`
- `textbook-packets-fixed-two-live.html` -> `briefs-packets.html`

## 4. Page-by-page purpose
- `index.html`: public front door, system overview, live-entry registry, route selector
- `start-here.html`: first-contact routing page
- `system.html`: public explanation of governance foundation, translation logic, execution modes, artifact families, delivery surfaces, and staged commercial ladder
- `library.html`: mixed public archive of live releases and visible in-preparation families
- `whats-live.html`: live registry of accessible routes and artifacts
- `services.html`: top-level services page; separates service route from library route
- `briefs-packets.html`: release shelf for briefs and packets
- `diagnostic-read.html`: canonical service route for bounded diagnostic reads
- `packages.html`: Bronze / Silver / Gold package ladder inside the wider system
- `method.html`: public four-step method page
- `what-this-is.html`: explains the service category
- `good-fit.html`: examples of where the diagnostic route fits and does not fit
- `input-return.html`: what can be sent and what comes back
- `boundary.html`: why the route stays bounded on purpose
- `contact.html`: business contact route
- `relationship-packet-payment.html`: access route for the longer relationship packet

## 5. Artifact classes
Current classes:
- Public briefs
- Decision briefs / decision packets
- Service route pages
- System pages
- Method pages

Future-ready classes:
- Visual maps
- Dashboards
- Slide decks
- Spreadsheet surfaces
- Interactive tools
- Software-facing objects

## 6. Delivery surfaces
Current:
- HTML pages
- PDF releases

Visible future surfaces:
- Infographic / map
- Slide deck
- Dashboard
- Spreadsheet
- Interactive tool
- Software / API surface

Rule:
The output is governed first.
The container is secondary.

## 7. Status taxonomy
Allowed public statuses:
- Live
- In preparation
- Archived
- Internal only

Definitions:
- Live = accessible now via working page, file, or route
- In preparation = intentionally visible, not yet released
- Archived = previously released, no longer current
- Internal only = not publicly listed unless a method page explicitly explains it

## 8. Publishing rules
1. Do not publish unclear promises.
2. Do not present in-preparation items as accessible.
3. Do not publish internal notes, operator doctrine, or development commentary on public pages.
4. Do not overstate software maturity.
5. Do not let the homepage drift away from current public meaning.
6. Live items must have a working route, file, or external link.
7. Mark outdated artifacts explicitly when they stop being current.

## 9. Naming rules
- Public navigation should use broad, readable labels.
- Use `Library` rather than making an old narrow label carry the entire shelf.
- Keep filenames stable where possible.
- When changing canonical routes, keep intentional redirects for older routes.

## 10. Link and asset rules
- Internal links must remain coherent across the page set.
- External links should open deliberately with `target="_blank"` and `rel="noopener noreferrer"` when appropriate.
- Downloadable artifacts should have:
  - filename
  - title
  - short description
  - version/date
  - status
  - storage path or route

Current live artifact routes:
- Relationship brief download: `relationship_packet_public_facing_3page.pdf`
- Relationship full text route: `relationship-packet-payment.html`
- SDG brief download: external Proton link
- SDG full text: external Proton link

## 11. Homepage doctrine
The homepage must function as:
- public front door
- system overview
- live-entry registry
- route selector

The homepage must not function mainly as:
- single-offer sales page
- package pricing page
- packet-only page

The homepage should answer clearly:
- What is GOLDLEVEL?
- What is live right now?
- What can I do here?
- Where do I go for a public brief?
- Where do I go for a diagnostic read?
- Is this a system or just a service page?
- What stage is this in?

## 12. Library doctrine
The library must:
- list live artifacts first
- show summaries clearly
- separate live and in-preparation states
- support mixed artifact classes over time
- feel like the public archive of current releases

## 13. Service doctrine
Services must:
- explain diagnostic reads clearly
- state what can be sent
- state what comes back
- distinguish the service route from the public library route
- avoid sounding like the whole system is only service work

## 14. Public boundary rules
- No internal governance commentary in raw form on public pages
- No developer notes on public pages
- No site-builder instructions on public pages
- No private reasoning structures in public copy
- No overclaiming maturity
- No placeholders presented as public releases
- No blurred line between public route and paid route

## 15. Release / update procedure
1. Update the route or asset
2. Update cross-links
3. Update `whats-live.html` if public availability changed
4. Update `library.html` / `briefs-packets.html` if release shelf changed
5. Update homepage if public system meaning changed
6. Update this README
7. Test redirects and internal links
8. Archive release bundle with date and release identifier

## 16. What counts as live
Something counts as live only if at least one of the following is true:
- Working local page exists
- Working local file exists
- Working external release link exists

Draft claims, planned routes, and unuploaded files do not count as live.

## 17. Backward compatibility / route continuity notes
Legacy filenames are preserved through redirect pages so older references do not dead-end.
Current redirects:
- `book-a-read.html` -> `contact.html`
- `scope.html` -> `input-return.html`
- `proof.html` -> `boundary.html`
- `textbook-packets-fixed-two-live.html` -> `briefs-packets.html`

## 18. Changelog scaffold
- Release ID:
- Date:
- Changed files:
- Changed routes:
- New assets:
- Deprecated routes:
- Rollback note:

## Release notes for this bundle
- Release ID: GL-SITE-2026-04-22-CMODE
- Date: 2026-04-22
- Changed files: full site rebuild around system-first architecture
- Changed routes: canonical top-level routes introduced; legacy routes redirected
- Rollback note: restore prior HTML set if required

## Design system notes
- Dark background
- Gold accent
- Serif + sans pairing
- Rounded cards
- Readable first
- Quiet premium tone
- Shared stylesheet: `assets/css/site.css`
- Shared script: `assets/js/site.js`

## Known bundle note
A local file named `relationship_packet_public_facing_3page.pdf` is included only so the download route resolves in this source bundle.
Replace it with the production PDF asset before public deployment.


## GOLDLEVEL Seed-State Gateway v0.3.0

Added `seed-state-read.html` as the live Relational Attractor Cartography intake route. The route captures a front-door Seed Packet instead of asking for private internal files. It maps visible form, field layer, selection layer, operator layer, invariant channels, radar/calibration, basin topology, governance/constraints, consequence/cost, and proof/state promotion into one public-safe intake pathway.

RMD portable set and CHATRMD sidecar are referenced as internal evidence/cartography discipline only; they are not exposed as public proof or site authority.
