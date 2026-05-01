#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
import json
import sys

STATUS = Path("_ops/release_control/release.status.json")

if len(sys.argv) != 3 or sys.argv[1] != "moment-matter":
    print("Usage:")
    print("  python _ops/release_control/gl_toggle_route_status.py moment-matter online")
    print("  python _ops/release_control/gl_toggle_route_status.py moment-matter offline")
    raise SystemExit(1)

value = sys.argv[2]
if value not in {"online", "offline"}:
    raise SystemExit("status must be online or offline")

if not STATUS.exists():
    raise SystemExit(f"missing {STATUS}; run bootstrap first")

data = json.loads(STATUS.read_text(encoding="utf-8"))
data["moment_matter_status"] = value
data["updated_utc"] = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

STATUS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"moment_matter_status={value}")
