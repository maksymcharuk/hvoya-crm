#!/usr/bin/env bash
#
# ONE-TIME server preparation for the release-based deploy.
# Run on the VPS as user "charuk":
#
#   scp deploy/setup.sh charuk@164.90.184.112:/tmp/ && ssh charuk@164.90.184.112 bash /tmp/setup.sh
#
# Prerequisites (run once as root before this script):
#   chown -R charuk:charuk /var/www/sales.hvoya.com
#
# Migrates from the old single-directory layout (/var/www/sales.hvoya.com/api)
# to the release layout used by deploy/remote.sh. The old api/ dir and the
# running pm2 process are left untouched until the first new deploy succeeds.
set -euo pipefail

BASE=/var/www/sales.hvoya.com
OLD_APP=$BASE/api

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

log "Creating directory layout"
mkdir -p "$BASE/releases" "$BASE/shared/env" "$BASE/shared/secrets"

if [ ! -d "$BASE/repo" ]; then
  if [ -d "$OLD_APP/.git" ]; then
    ORIGIN=$(git -C "$OLD_APP" remote get-url origin)
  else
    ORIGIN=${REPO_URL:?No existing clone found — set REPO_URL=<git url> and re-run}
  fi
  log "Creating bare mirror of $ORIGIN"
  git clone --mirror "$ORIGIN" "$BASE/repo"
else
  log "Repo mirror already exists, skipping"
fi

log "Copying config from old app dir into shared/"
if [ -d "$OLD_APP/env" ]; then
  cp -n "$OLD_APP/env/"*.env "$BASE/shared/env/" 2>/dev/null || true
  [ -f "$OLD_APP/env/.env" ] && cp -n "$OLD_APP/env/.env" "$BASE/shared/env/.env" || true
fi
if [ -d "$OLD_APP/secrets" ]; then
  cp -n "$OLD_APP/secrets/"* "$BASE/shared/secrets/" 2>/dev/null || true
fi

if [ ! -f "$BASE/shared/env/.env" ]; then
  echo "!!! $BASE/shared/env/.env is missing — create it before deploying" >&2
fi

log "Configuring pm2 log rotation"
command -v pm2 >/dev/null || { echo "pm2 not found — install it: npm install -g pm2" >&2; exit 1; }
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 20M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true

cat <<'EOF'

Setup complete. Next steps:

1. From your machine run:                          ./deploy/deploy.sh
   (the first deploy automatically replaces the old pm2 process after the
   build finishes — expect a few seconds of downtime, later deploys are
   zero-downtime)

2. After the first successful deploy:
   - nginx docroot /var/www/sales.hvoya.com/html is now a symlink into the
     release; the old dir was kept as html.legacy.<timestamp>
   - make pm2 start on boot:                       pm2 startup
     (run the sudo command it prints, then:        pm2 save)
   - once happy, remove the old app dir:           rm -rf /var/www/sales.hvoya.com/api

EOF
