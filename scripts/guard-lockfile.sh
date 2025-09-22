#!/usr/bin/env bash
set -euo pipefail

# Get list of staged files
STAGED=$(git diff --cached --name-only)

if echo "$STAGED" | grep -qx "package-lock.json"; then
  if ! echo "$STAGED" | grep -qx "package.json"; then
    echo "\nError: package-lock.json is staged without a matching package.json change." >&2
    echo "Use 'npm ci' for installs; only commit lockfile when intentionally updating dependencies." >&2
    exit 1
  fi
fi

exit 0
