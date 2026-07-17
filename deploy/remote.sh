#!/usr/bin/env bash
#
# Runs ON THE SERVER (piped over ssh by deploy/deploy.sh).
#
# Release-based deploy with minimal downtime:
#   1. Check out the target branch into a fresh releases/<timestamp> dir
#   2. Install deps and build backend + frontend while the old app keeps serving
#   3. Back up the DB, run migrations
#   4. Atomically switch the `current` symlink and gracefully reload pm2
#   5. Health-check the new release; roll back the symlink if it fails
#
# Directory layout (created by deploy/setup.sh):
#   /var/www/sales.hvoya.com/
#     repo/       bare git mirror used to create releases
#     releases/   one directory per deployed release
#     current ->  releases/<timestamp>        (the live release)
#     html    ->  current/client/dist         (nginx docroot)
#     shared/env, shared/secrets              (config shared across releases)
set -euo pipefail

BASE=/var/www/sales.hvoya.com
REPO=$BASE/repo
BRANCH=${DEPLOY_BRANCH:-master}
KEEP_RELEASES=5
TS=$(date +%Y%m%d%H%M%S)
RELEASE=$BASE/releases/$TS

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

# Non-interactive ssh sessions skip the parts of .bashrc that set up nvm —
# load it explicitly so we get the same Node an interactive shell would.
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Angular 21 requires Node ^20.19 || >=22.12
NODE_OK=$(node -p '
  const [major, minor] = process.versions.node.split(".").map(Number);
  major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19) ? "ok" : "old"
' 2>/dev/null || echo old)
if [ "$NODE_OK" != ok ]; then
  echo "!!! Node ^20.19 or >=22.12 is required to build this project, found: $(node -v 2>/dev/null || echo 'none')" >&2
  echo "    Upgrade Node on the server (see 'Server prerequisites' in deploy/README.md)" >&2
  exit 1
fi

log "Fetching latest '$BRANCH'"
git -C "$REPO" fetch --prune origin

log "Creating release $TS"
mkdir -p "$RELEASE"
git -C "$REPO" archive "$BRANCH" | tar -x -C "$RELEASE"

log "Linking shared config (env, secrets)"
rm -rf "$RELEASE/env" "$RELEASE/secrets"
ln -s "$BASE/shared/env" "$RELEASE/env"
ln -s "$BASE/shared/secrets" "$RELEASE/secrets"

# Reuse node_modules from the previous release so npm install only applies the diff.
if [ -d "$BASE/current/node_modules" ]; then
  log "Reusing node_modules from previous release"
  cp -a "$BASE/current/node_modules" "$RELEASE/node_modules"
  if [ -d "$BASE/current/client/node_modules" ]; then
    cp -a "$BASE/current/client/node_modules" "$RELEASE/client/node_modules"
  fi
fi

log "Installing backend dependencies"
cd "$RELEASE"
npm install --legacy-peer-deps --no-audit --no-fund

log "Building backend"
npm run build

log "Installing client dependencies"
cd "$RELEASE/client"
npm install --legacy-peer-deps --no-audit --no-fund

log "Building client"
npm run build

log "Backing up database to S3"
cd "$RELEASE"
npm run db:backup

log "Running migrations"
npm run migrations:run

log "Activating release $TS"
PREV=$(readlink "$BASE/current" 2>/dev/null || true)
ln -sfn "$RELEASE" "$BASE/current.tmp"
mv -Tf "$BASE/current.tmp" "$BASE/current"

# First deploy only: the legacy pm2 app (from the old api/ layout) holds the
# port — remove anything that is not "hvoya-crm" so the new app can bind.
LEGACY_APPS=$(pm2 jlist 2>/dev/null | node -e '
  let d = "";
  process.stdin.on("data", (c) => (d += c)).on("end", () => {
    try {
      const apps = JSON.parse(d.slice(d.indexOf("[")));
      console.log(apps.map((a) => a.name).filter((n) => n !== "hvoya-crm").join(" "));
    } catch {}
  });
')
if [ -n "$LEGACY_APPS" ]; then
  log "Removing legacy pm2 apps: $LEGACY_APPS"
  # shellcheck disable=SC2086
  pm2 delete $LEGACY_APPS
fi

log "Reloading app (pm2 graceful reload)"
pm2 startOrReload "$BASE/current/ecosystem.config.js" --update-env

log "Health check"
PORT=$(grep -E '^PORT=' "$BASE/shared/env/.env" | head -1 | cut -d= -f2 | tr -d "'\"" || true)
PORT=${PORT:-3000}
healthy=0
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null "http://127.0.0.1:$PORT/"; then
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
    echo "If the new schema breaks the old code, run 'npm run migrations:revert' in $RELEASE" >&2
  fi
  exit 1
fi

# First deploy only: point nginx docroot at the release's client build.
if [ ! -L "$BASE/html" ]; then
  log "Replacing $BASE/html directory with symlink to client build"
  [ -e "$BASE/html" ] && mv "$BASE/html" "$BASE/html.legacy.$TS"
  ln -s "$BASE/current/client/dist" "$BASE/html"
fi

log "Pruning old releases (keeping last $KEEP_RELEASES)"
cd "$BASE/releases"
ls -1 | sort -r | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf --

pm2 save

log "Deployed release $TS successfully"
