# Improvement Plan

Constraints: single existing droplet (no new recurring costs), no test suite work
for now, no staging environment — "staging" mentions get cleaned up instead.

## Phase 0 — Quick wins (one evening)

1. **Real health endpoint.** Add `GET /api/health` (checks DB connectivity,
   returns version/uptime). Point `deploy/remote.sh`'s health check at it
   instead of `/`, which currently only proves static files are served.
2. **External uptime monitoring.** UptimeRobot free tier pinging
   `https://sales.hvoya.com/api/health` every 5 min with email alerts. This is
   the only thing that catches "the whole droplet is down" — New Relic dies
   with the box (as seen 2026-07-17).
3. **Backup frequency.** Change the backup cron from daily to every 6 hours
   and raise `backupsToKeep` from 15 to 28 (≈ 7 days of coverage). Cuts
   worst-case data loss from 24h to 6h with a two-line change, until Phase 4
   does it properly.
4. **Dependency hygiene (no majors).** Remove `pm2` from app dependencies
   (it runs globally on the server), drop deprecated stub types
   (`@types/axios`, `@types/winston`, `@types/joi`), bump `@types/node` to 22
   to match production Node, replace `rimraf` v3 usage.

## Phase 1 — Build in CI, not on the droplet (one weekend)

The droplet should never build again — the 2026-07-17 outage was an Angular
build eating all RAM on the production box.

0. **Branch model: `dev` (default) + `master` (releases).** Daily work goes
   to `dev`; `master` only receives deliberate merges from `dev`, and a push
   to `master` is what means "release". With `dev` as the GitHub default
   branch, fresh clones and PRs target it, so pushing to `master` by mistake
   becomes hard. If the repo plan allows, add a branch protection rule /
   ruleset on `master` (require PR, no force-push) as a hard guard.
1. **GitHub Actions workflow** (free tier): on push to `master` (plus manual
   `workflow_dispatch`), `npm ci` + build backend and client, bundle an
   artifact: `dist/`, `client/dist/`, `package.json`, `package-lock.json`,
   `ecosystem.config.js`, `newrelic.js`, `resources/`.
2. **Artifact deploy.** Workflow scps the bundle to the droplet and runs a
   slimmed `remote.sh`: extract into `releases/<ts>`, `npm ci --omit=dev`
   (runtime deps only — no webpack/@nestjs/cli/Angular, so it's fast and
   light), link shared config, DB backup, migrations, symlink switch, pm2
   reload, health check, auto-rollback. The release layout and rollback
   logic stay exactly as they are today.
3. **Access:** dedicated SSH keypair for Actions, public key added to
   `charuk`, private key in repo secrets.
4. Keep `deploy/deploy.sh` as a documented manual fallback (build-on-server
   still works if GitHub is down); the memory guard stays as its safety net.

## Phase 2 — Config & code cleanup (one evening)

1. **Remove "staging".** Delete the `staging` entry from `APP_ORIGIN`,
   `isStaging()`, and the `Staging` member of the `Env` enum; check client
   environment files for staging leftovers. Production is the only deployed
   environment and the code should say so.
2. **One env-loading convention.** Today `config.ts` (dotenv) loads
   `env/.env` while `ConfigModule` loads `env/production.env` under
   `NODE_ENV=production` — reconciled on the server by a symlink hack. Make
   `ConfigModule.envFilePath` use the same rule as `config.ts`
   (`env/.env` unless test), then delete the `production.env` symlink from
   the droplet and the mention in `deploy/setup.sh`.
3. **Optional, low priority:** convert the static-method `DatabaseService`
   to a normal injectable service; add the missing hvoya theme stylesheet or
   remove its reference (build warning).

## Phase 3 — Framework upgrades (one PR at a time, spread over weeks)

Now safe to do because every deploy has a health check and auto-rollback.
Order matters; ship and verify each step in production before the next:

1. TypeScript 4.7 → 5.x (with Nest 9 still — supported)
2. NestJS 9 → 10 (all `@nestjs/*` together, follow the official migration
   guide; includes `@nestjs/schedule`, `serve-static`, `typeorm` adapter)
3. NestJS 10 → 11
4. Remaining stragglers afterwards: `class-validator`/`class-transformer`,
   `socket.io` alignment, `helmet`, `express-rate-limit`
5. After each step: build, deploy, watch `/api/health` + New Relic errors,
   click through auth → orders → balance manually

Angular is already on 21 — nothing to do on the client side.

## Phase 4 — Real database durability (free, highest payoff)

Dumps every 6h still lose up to 6h of orders. WAL archiving fixes that at
zero cost using the existing S3 bucket:

1. Install **WAL-G** on the droplet; configure `archive_command` to ship WAL
   segments to S3 and a nightly base backup (cron). RPO drops to ~minutes and
   point-in-time recovery becomes possible.
2. Retention: keep 2 base backups + WAL between them; keep the existing
   `pg_dump`-before-deploy as a second, independent format.
3. **Write and actually rehearse the restore procedure** (restore to a
   scratch database on the droplet, verify row counts). An untested backup
   is a hope, not a backup. Document in `deploy/README.md`.
4. Once WAL archiving is trusted, drop the 6h dump cron back to daily.

## Explicit non-goals (decided, not forgotten)

- No test suite for now (revisit separately; API-level tests for orders,
  auth, balance would be the starting point).
- Single app instance stays; the in-memory WebSocket `userId → socket` map is
  an accepted constraint of that.
- No staging environment, no second droplet, no managed database, no
  Docker/Kubernetes/PaaS — nothing in this plan adds monthly cost.
