# Deployment

Release-based, near-zero-downtime deploy to the DigitalOcean VPS.

## How it works

Each deploy creates a fresh directory under `releases/`, builds it **while the
old version keeps serving traffic**, and only switches over once everything is
built and migrated:

```text
/var/www/sales.hvoya.com/
  repo/                    # bare git mirror (fetch source for releases)
  releases/
    20260717143000/        # one directory per release (last 5 kept)
  current -> releases/...  # the live release (atomic symlink switch)
  html    -> current/client/dist   # nginx docroot follows the live release
  shared/
    env/                   # .env, production.env — shared across releases
    secrets/               # TLS certs etc.
```

Deploy steps (`remote.sh`): fetch → checkout release → link shared config →
`npm install` + build backend & client → **DB backup to S3** → migrations →
switch `current` symlink → `pm2 startOrReload` → health check → prune old
releases. If the health check fails, the symlink is switched back to the
previous release automatically.

Downtime is eliminated by two things:

- Builds happen in a separate directory; the running app and the nginx
  docroot are untouched until the atomic symlink switch.
- pm2 runs the app in cluster mode (1 instance) with `wait_ready`: on reload
  it starts the new process, waits for the `ready` signal from `main.ts`,
  then gracefully stops the old one. The listening port is shared, so no
  request is ever refused.

## Server prerequisites

The build requires **Node ≥ 20.19** (Angular 21's minimum) available to the
`charuk` user — `remote.sh` refuses to deploy on anything older. To upgrade
system-wide to Node 22 LTS (as root):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2        # reinstall pm2 under the new Node
```

Then, as charuk, refresh the pm2 daemon and boot script:

```bash
pm2 update
pm2 unstartup && pm2 startup   # run the sudo command it prints, then: pm2 save
```

(If you prefer nvm under the charuk user instead, that works too —
`remote.sh` loads `~/.nvm` explicitly, since non-interactive ssh sessions
skip it.)

## One-time server setup

```bash
# as root on the VPS (once):
chown -R charuk:charuk /var/www/sales.hvoya.com

# make sure charuk can fetch from GitHub (deploy key / ssh agent),
# then from your machine:
scp deploy/setup.sh charuk@164.90.184.112:/tmp/
ssh charuk@164.90.184.112 bash /tmp/setup.sh
```

`setup.sh` creates the layout above, mirrors the repo, copies `env/` and
`secrets/` from the old `api/` dir into `shared/`, and configures
pm2-logrotate. It prints the remaining follow-ups (pm2 startup on boot,
removing the old `api/` dir).

After the first deploy, `/var/www/sales.hvoya.com/html` becomes a symlink
(the old directory is kept as `html.legacy.<timestamp>`). nginx needs no
config change — it follows symlinks by default.

## Deploying

```bash
./deploy/deploy.sh                     # deploys origin/master
DEPLOY_BRANCH=fix-x ./deploy/deploy.sh # deploys another branch
```

(`./run_deploy` still works — it forwards here.)

Deploys run as `charuk`, never root.

### Rollback

Automatic if the post-deploy health check fails. Manual:

```bash
ssh charuk@164.90.184.112
cd /var/www/sales.hvoya.com
ln -sfn releases/<previous> current.tmp && mv -Tf current.tmp current
pm2 startOrReload current/ecosystem.config.js
```

Migrations are **not** reverted automatically. To keep rollbacks safe, prefer
backward-compatible migrations (add columns/tables first, remove in a later
release) — during the reload window the old code briefly runs against the new
schema.

## DB backups

- Nightly cron inside the app + before every deploy, uploaded to S3.
- Retention: the **15 newest** `backup-*.dump` objects are kept; older ones
  are deleted after each successful upload
  (`DatabaseService.cleanupOldBackups`, `backupsToKeep` in
  `src/modules/database/services/database.service.ts`).
- Restore: `npm run db:restore` (downloads the newest dump).

## Monitoring & logs

**New Relic** (free tier: 100 GB/month ingest, APM + log management + alerts)
is the recommended option and stays. The previous integration had two bugs
that are now fixed:

1. `agent_enabled: process.env.NEW_RELIC_ENABLED` — the string `'false'` is
   truthy, so the toggle never worked. Now compared against `'true'`.
2. `newrelic` was imported *after* express/http in `main.ts`, so nothing got
   instrumented. It is now preloaded via `node_args: '-r newrelic'` in
   `ecosystem.config.js`, before any other module loads.

The deprecated `@newrelic/winston-enricher` was removed — the agent forwards
winston logs by itself (`application_logging.forwarding` in `newrelic.js`).

To enable, set in `shared/env/.env`:

```bash
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=<key>
```

On-server logs: `pm2 logs hvoya-crm` (rotated by pm2-logrotate: 20 MB/file,
14 files, compressed — configured by `setup.sh`).

Free alternatives, if New Relic ever stops fitting: Grafana Cloud free tier
(50 GB logs, 14-day retention) or self-hosted Uptime Kuma for uptime checks.
