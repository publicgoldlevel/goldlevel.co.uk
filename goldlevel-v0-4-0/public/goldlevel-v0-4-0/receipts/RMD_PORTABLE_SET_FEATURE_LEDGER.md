```text
CANON_HEADER v1.0.0
TITLE=RMD Portable Set Feature Ledger
TYPE=RECEIPT
STATUS=PUBLIC_PROVISIONAL
VERSION=0.4.0
DATE=2026-05-12
AUTHOR=TOMS, JANSONS
SCOPE=RMD portable set and sidecar integration record.
CLAIM_LEVEL=RECEIPT_BACKED
PUBLIC_BOUNDARY=Public-safe; no private-source disclosure; no state promotion without receipts.
```

# RMD Portable Set Feature Ledger

## 1. What this is

Python-generated ledger for the unzipped RMD portable set. Files inventoried: 1196. Sidecar files inventoried: 2.

## 2. What it is not

It is not a claim that every script was executed. Destructive or mutation-capable scripts are inventory-checked but not run.

## 3. Core idea

Archive informs. Sidecar translates. Python/local scripts scan when explicitly run. Receipts decide.

## 4. Diagram / artefact

See RMD_FULL_LOAD_RECEIPT.json for full file-level inventory.

## 5. Use case

Used to enforce detection, calibration, confidence, false-signal handling, pattern-strength measurement, uncertainty and receipt discipline.

## 6. Evidence status

RMD archive enumerated by Python with SHA256 for every file. Interface loaded: False. Error if any: AttributeError("'NoneType' object has no attribute '__dict__'")

## 7. Next proof needed

Only execute additional RMD mutation or shell scripts with separate explicit approval.

## 8. Version note

v0.4.0: added as v0.4 website build receipt.
