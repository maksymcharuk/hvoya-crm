#!/usr/bin/env bash
#
# Runs ON THE SERVER (piped over ssh by .github/workflows/deploy.yml).
#
# Deploys a prebuilt bundle — the CI counterpart of remote.sh. The server
# never builds: the tarball already contains dist/, client/dist and the
# compiled typeorm config, so only production dependencies are installed
# (no webpack/@nestjs/cli/Angular). Release layout, health check and
# rollback are identical to remote.sh.
#
# Input (env): RELEASE_TARBALL — path to the uploaded release.tar.gz
#
# Directory layout (created by deploy/setup.sh):
#   /var/www/sales.hvoya.com/
#     releases/   one directory per deployed release
#     current ->  releases/<timestamp>        (the live release)
#     html    ->  current/client/dist         (nginx docroot)
#     shared/env, shared/secrets              (config shared across releases)
set -euo pipefail

BASE=/var/www/sales.hvoya.com
TARBALL=${RELEASE_TARBALL:?RELEASE_TARBALL is required (path to release.tar.gz)}
KEEP_RELEASES=5
TS=$(date +%Y%m%d%H%M%S)
RELEASE=$BASE/releases/$TS

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

# Non-interactive ssh sessions skip the parts of .bashrc that set up nvm —
# load it explicitly so we get the same Node an interactive shell would.
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Runtime floor (package.json engines): Node >= 20.19
NODE_OK=$(node -p '
  const [major, minor] = process.versions.node.split(".").map(Number);
  major > 20 || (major === 20 && minor >= 19) ? "ok" : "old"
' 2>/dev/null || echo old)
if [ "$NODE_OK" != ok ]; then
  echo "!!! Node >=20.19 is required to run this app, found: $(node -v 2>/dev/null || echo 'none')" >&2
  echo "    Upgrade Node on the server (see 'Server prerequisites' in deploy/README.md)" >&2
  exit 1
fi

[ -f "$TARBALL" ] || { echo "!!! Release tarball not found: $TARBALL" >&2; exit 1; }

log "Creating release $TS from $(basename "$TARBALL")"
mkdir -p "$RELEASE"
tar -xzf "$TARBALL" -C "$RELEASE"
rm -f "$TARBALL"

log "Linking shared config (env, secrets)"
rm -rf "$RELEASE/env" "$RELEASE/secrets"
ln -s "$BASE/shared/env" "$RELEASE/env"
ln -s "$BASE/shared/secrets" "$RELEASE/secrets"

log "Installing production dependencies"
cd "$RELEASE"
npm ci --omit=dev --legacy-peer-deps --no-audit --no-fund

log "Backing up database to S3"
npm run db:backup:prod

log "Running migrations"
npm run migrations:run:prod

log "Activating release $TS"
PREV=$(readlink "$BASE/current" 2>/dev/null || true)
ln -sfn "$RELEASE" "$BASE/current.tmp"
mv -Tf "$BASE/current.tmp" "$BASE/current"

log "Reloading app (pm2 graceful reload)"
pm2 startOrReload "$BASE/current/ecosystem.config.js" --update-env

log "Health check"
PORT=$(grep -E '^PORT=' "$BASE/shared/env/.env" | head -1 | cut -d= -f2 | tr -d "'\"" || true)
PORT=${PORT:-3000}
healthy=0
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null "http://127.0.0.1:$PORT/api/health"; then
    healthy=1
    break
  fi
  sleep 2
done

if [ "$healthy" != 1 ]; then
  echo "!!! Health check FAILED for release $TS" >&2
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then
    echo "Rolling back to $PREV" >&2
    ln -sfn "$PREV" "$BASE/current.tmp"
    mv -Tf "$BASE/current.tmp" "$BASE/current"
    pm2 startOrReload "$BASE/current/ecosystem.config.js" --update-env
    echo "NOTE: migrations from the failed release were NOT reverted." >&2
    echo "If the new schema breaks the old code, run 'npm run migrations:revert:prod' in $RELEASE" >&2
  fi
  exit 1
fi

log "Pruning old releases (keeping last $KEEP_RELEASES)"
cd "$BASE/releases"
ls -1 | sort -r | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf --

pm2 save

log "Deployed release $TS successfully"
