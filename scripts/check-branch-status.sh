#!/bin/sh

# Fetch latest changes (suppress output for cleaner hook execution)
git fetch origin main 2>/dev/null || {
    echo "Warning: Could not fetch from origin/main"
    exit 0
}

# Get behind and ahead counts
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

echo "Branch status compared to main:"
echo "\033[33mBehind: $BEHIND commits"
echo "Ahead: $AHEAD commits\033[0m"
