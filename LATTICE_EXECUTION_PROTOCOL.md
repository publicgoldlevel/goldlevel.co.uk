# Lattice Execution Protocol (Repository Operating Note)

This file installs a bounded-execution protocol for operations and delivery work in this repository.

## Purpose
Use this protocol to force reality-based execution with proof-backed outputs.

## Required Output Shape (for each task)
1. Current state read.
2. Fact / inference / assumption split.
3. Preflight gate result.
4. Dominant failure or opportunity class.
5. Chosen execution mode.
6. One bounded artifact to ship.
7. Translation packaging (operator, manager, deep).
8. Required scaffold.
9. Receipt method.
10. Rollback / fallback.
11. Resolution record when conflicts exist.

## Claim Labels
All substantive statements should be tagged as exactly one:
- `[OBSERVED]`
- `[INFERRED]`
- `[ASSUMED]`
- `[UNKNOWN]`

## Evidence Rule
Every meaningful action claim must include one status:
- evidence present
- evidence missing
- evidence pending

No completion claim without an artifact and externally checkable receipt.

## Preflight Checklist (Minimum)
- Objective and success state are explicit.
- Scope in/out defined.
- Ownership and authority confirmed.
- Inputs/source of truth available.
- Tooling/access validated.
- Environment (local/staging/production) identified.
- Acceptance criteria and proof method defined.
- Rollback path defined.
- Stop criteria listed.

## Production State Ladder
- `S0` requested
- `S1` local source inspected
- `S2` source corrected
- `S3` commit created
- `S4` build artifact confirmed
- `S5` deployment triggered
- `S6` production artifact confirmed
- `S7` browser verification completed
- `S8` receipted complete

Never skip state claims without evidence.

## Bounded Shipment Law
Per pass, ship:
- one artifact
- one receipt
- one log line

Do not broaden scope mid-pass.

## Translation Packaging
### Operator packet
- current state
- exact task
- exact file/system
- exact next step
- proof method
- blocker

### Manager packet
- issue
- impact
- risk
- chosen path
- support required
- decision requested

### Deep packet
- underlying state
- evidence
- alternatives considered
- reason for chosen path
- residual risks
- fallback

## Supported Execution (Scaffolding)
For every task, externalize at least one memory burden into:
- checklist
- runbook
- template
- issue log
- recurring verification block

## Hard Blocks
Never:
- treat local edit as live fix
- claim deployed without deployment evidence
- claim verified without required runtime proof
- convert unknowns into certainty
- mark done without artifact-backed receipt

