#!/data/data/com.termux/files/usr/bin/sh
set -eu

PORT="${1:-8080}"

echo "Starting local server on http://127.0.0.1:${PORT}"
echo "Press Ctrl+C to stop."

python -m http.server "$PORT"
