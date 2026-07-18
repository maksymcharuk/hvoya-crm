# Deployment

Release-based, near-zero-downtime deploy to the DigitalOcean VPS.

There are two deploy paths sharing the same release layout and rollback logic:

- **CI deploy (primary):** a push to `master` triggers
  `.github/workflows/deploy.yml`, which builds backend + client on GitHub's
  runners, ships a prebuilt bundle to the droplet, and runs
  `deploy/remote-artifact.sh` there. **The droplet never builds** — it only
  installs production dependencies (the 2026-07-17 outage was an Angular
  build eating all RAM on the production box).
- **Manual fallback:** `./deploy/deploy.sh` builds on the server via
  `deploy/remote.sh` — still works if GitHub is down. The memory guard in
  `remote.sh` stays as its safety net.

## Branch model

`dev` is the default branch — daily work goes there, and fresh clones and PRs
target it. `master` only receives deliberate merges from `dev`; **a push to
`master` means "release"** (it triggers the deploy workflow). One-time GitHub
setup (manual, in repo settings):

1. Settings → General → Default branch → `dev`.
2. Settings → Rules → Rulesets → add a ruleset for `master`: require a pull
   request, block force pushes (if the repo plan allows it).

## How it works

Each deploy creates a fresh directory under `releases/`, prepares it **while
the old version keeps serving traffic**, and only switches over once
everything is built and migrated:

```text
/var/www/sales.hvoya.com/
  repo/                    # bare git mirror (fetch source for releases)
  releases/
    20260717143000/        # one directory per release (last 5 kept)
  current -> releases/...  # the live release (atomic symlink switch)
  html    -> current/client/dist   # nginx docroot follows the live release
  shared/
    env/                   # .env — shared across releases
    secrets/               # TLS certs etc.
```

CI deploy steps (`.github/workflows/deploy.yml` + `remote-artifact.sh`):
`npm ci` + build backend & client on the runner → bundle `dist/`,
`client/dist/`, `package.json`, `package-lock.json`, `ecosystem.config.js`,
`newrelic.js`, `resources/` into a tarball → scp to the droplet → extract
into `releases/<ts>` → `npm ci --omit=dev` (runtime deps only — no
webpack/@nestjs/cli/Angular) → link shared config → **DB backup to S3** →
migrations → switch `current` symlink → `pm2 startOrReload` → health check →
prune old releases.

Manual deploy steps (`remote.sh`): the same, except the release is checked
out from the git mirror and built on the server (full `npm install`
including dev deps).

On the server, migrations and the backup run from the compiled output — no
ts-node needed: `npm run migrations:run:prod` and `npm run db:backup:prod`
use `dist/typeorm.config.js` and `dist/src/.../scripts/backup.js`.

The health check polls `GET /api/health`, which verifies DB connectivity
(not just static file serving). If it fails, the symlink is switched back to
the previous release automatically.

Downtime is eliminated by two things:

- Builds happen in a separate directory; the running app and the nginx
  docroot are untouched until the atomic symlink switch.
- pm2 runs the app in cluster mode (1 instance) with `wait_ready`: on reload
  it starts the new process, waits for the `ready` signal from `main.ts`,
  then gracefully stops the old one. The listening port is shared, so no
  request is ever refused.

## GitHub Actions access (one-time)

The workflow ssh-es into the droplet as `charuk` with a dedicated keypair:

```bash
# on your machine:
ssh-keygen -t ed25519 -N '' -C 'github-actions-deploy' -f hvoya-deploy-key
ssh charuk@164.90.184.112 'cat >> ~/.ssh/authorized_keys' < hvoya-deploy-key.pub

# add the PRIVATE key as a repo secret, then delete both local files:
# GitHub repo → Settings → Secrets and variables → Actions →
#   New repository secret → name: DEPLOY_SSH_KEY, value: contents of hvoya-deploy-key
rm hvoya-deploy-key hvoya-deploy-key.pub
```

## Server prerequisites

The app requires **Node ≥ 20.19** available to the `charuk` user — both
deploy scripts refuse to run on anything older. To upgrade system-wide to
Node 22 LTS (as root):

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

The remaining prerequisites in this section only matter for the **manual
build-on-server fallback** — CI deploys never build on the droplet.

The droplet needs **swap** — the Angular build can spike past the 2 GB
of RAM and, without swap, that hard-locks the whole machine (this happened).
As root, once:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
sysctl vm.swappiness=10
echo 'vm.swappiness=10' >> /etc/sysctl.d/99-swap.conf
```

`remote.sh` additionally caps the build's JS heap, runs builds at lowest
CPU/IO priority so the live app stays responsive, and refuses to start a
build with less than ~1.2 GB of RAM+swap available.

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

**Normal release:** merge `dev` into `master` and push — the `Deploy`
workflow does the rest. It can also be re-run manually from the Actions tab
(`workflow_dispatch`). The built bundle is kept as a workflow artifact for
14 days.

**Manual fallback (build on server):**

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

- Cron inside the app every **6 hours** + before every deploy, uploaded to S3.
- Retention: the **28 newest** `backup-*.dump` objects are kept (≈ 7 days of
  scheduled dumps); older ones
  are deleted after each successful upload
  (`DatabaseService.cleanupOldBackups`, `backupsToKeep` in
  `src/modules/database/services/database.service.ts`).
- Restore: `npm run db:restore` (downloads the newest dump).

## Monitoring & logs

### Uptime (external)

New Relic runs on the droplet, so it dies with the box — it cannot alert on
"the whole droplet is down" (as seen 2026-07-17). External uptime monitoring
covers that gap. **UptimeRobot free tier** (manual, one-time setup):

1. Create a free account at <https://uptimerobot.com>.
2. Add an HTTP(s) monitor for `https://sales.hvoya.com/api/health`,
   interval 5 minutes.
3. Add an email alert contact. The endpoint returns 503 when the DB is
   unreachable, so DB outages alert too, not just full-box outages.

### APM & logs

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
