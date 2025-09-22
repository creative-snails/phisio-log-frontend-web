#!/usr/bin/env sh
set -eu

# Always use npmjs registry
npm config set registry https://registry.npmjs.org/ >/dev/null 2>&1 || true

# 1) Ensure dependencies are installed in the container volume using npm ci (never modifies lockfile)
if [ ! -d /app/node_modules ] || [ -z "$(ls -A /app/node_modules 2>/dev/null || true)" ]; then
  echo "[entrypoint] node_modules missing; installing dependencies with npm ci"
  npm ci
else
  echo "[entrypoint] node_modules already present"
fi

# 2) Ensure Rollup native optional package exists for this platform. If lockfile omitted it, add it without touching package.json.
ensure_rollup_native() {
  if ls -d /app/node_modules/@rollup/rollup-linux-* 2>/dev/null | grep -q rollup-linux; then
    echo "[entrypoint] Rollup native binary present"
    return 0
  fi

  UNAME_S=$(uname -s | tr '[:upper:]' '[:lower:]')
  UNAME_M=$(uname -m)
  case "$UNAME_M" in
    x86_64) ARCH=x64 ;;
    aarch64) ARCH=arm64 ;;
    arm64) ARCH=arm64 ;;
    *) ARCH=$UNAME_M ;;
  esac

  if [ "$UNAME_S" = "linux" ]; then
    PKG="@rollup/rollup-linux-${ARCH}-gnu"
  else
    # Only linux containers are expected here; skip otherwise
    echo "[entrypoint] Non-linux platform detected ($UNAME_S), skipping rollup native check"
    return 0
  fi

  echo "[entrypoint] Installing Rollup native optional package: $PKG (no-save, no-package-lock)"
  if npm i --no-save --no-package-lock "$PKG"; then
    echo "[entrypoint] Installed $PKG"
  else
    echo "[entrypoint] Failed to install $PKG; trying musl variant just in case"
    npm i --no-save --no-package-lock "@rollup/rollup-linux-${ARCH}-musl" || true
  fi
}

ensure_rollup_native

# 3) Start Vite dev server
exec npm run dev -- --host 0.0.0.0
