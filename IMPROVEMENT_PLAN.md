# Improvement Plan

Constraints: single existing droplet (no new recurring costs), no test suite work
for now, no staging environment — "staging" mentions get cleaned up instead.

## Phase 0 — Quick wins (one evening) ✅ Done 2026-07-17

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

## Phase 1 — Build in CI, not on the droplet (one weekend) ✅ Done 2026-07-17

The droplet should never build again — the 2026-07-17 outage was an Angular
build eating all RAM on the production box.

Implemented: `.github/workflows/deploy.yml` (build + artifact deploy) and
`deploy/remote-artifact.sh` (no-build server script using
`migrations:run:prod` / `db:backup:prod` against compiled `dist/`).
Remaining manual steps (GitHub settings, see `deploy/README.md`):
add the `DEPLOY_SSH_KEY` repo secret, switch the default branch to `dev`,
add the `master` ruleset.

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

## Phase 2 — Config & code cleanup (one evening) ✅ Done 2026-07-18

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

All three items done (incl. the optional ones). The theme warning turned out
to be the `index.html` `<link>` to `assets/.../theme/hvoya/theme.css`, which
the esbuild builder can't resolve at build time — the css now loads via the
`styles` array in `angular.json` instead (the link and the never-rendered
theme-switcher it served are Sakai-template leftovers). The `production.env`
symlink has been removed from the droplet.

## Phase 3 — Framework upgrades (one PR at a time, spread over weeks)

Now safe to do because every deploy has a health check and auto-rollback.
Order matters; ship and verify each step in production before the next:

1. TypeScript 4.7 → 5.x (with Nest 9 still — supported) ✅ Done 2026-07-18
   (TS 5.9, `@typescript-eslint` 5 → 8 to support it; verified locally —
   pending production deploy + watch before step 2)
2. NestJS 9 → 10 (all `@nestjs/*` together, follow the official migration
   guide; includes `@nestjs/schedule`, `serve-static`, `typeorm` adapter)
   ✅ Done 2026-07-18 (Nest 10.4, config 3, axios 3, schedule 4,
   serve-static 4, event-emitter 2, mapped-types 2, nest-winston 1.10;
   zero code changes needed; verified locally incl. WebSocket handshake —
   pending production deploy + watch before step 3)
3. NestJS 10 → 11 ✅ Done 2026-07-18 (Nest 11.1 + Express 5, config 4,
   axios 4, schedule 6, serve-static 5, cache-manager 3/6, event-emitter 3,
   jwt/passport/typeorm adapters 11, reflect-metadata 0.2; prettier 2 → 3
   toolchain forced by @nestjs/schematics 11 — one-time ~78-file mechanical
   reformat; only code change: `forRoutes('*')` → `'{*splat}'`; verified
   locally incl. SPA fallback, cache interceptor, WS handshake, migrations
   CLI — pending production deploy + watch before step 4)
4. Remaining stragglers afterwards: `class-validator`/`class-transformer`,
   `socket.io` alignment, `helmet`, `typeorm` 0.3.15 → latest 0.3.x (kept
   back during the Nest 11 step to isolate risk), `newrelic` agent 10 →
   current (10.1.2 works on Node 22 but logs "not tested"), and remove
   `express-rate-limit` (unused in src — dead dependency)
   ✅ Done 2026-07-18 (class-validator 0.15, helmet 8, typeorm 0.3.31 —
   deliberately NOT the new 1.x line, newrelic 14, passport 0.7,
   client socket.io-client ^4.8 to match server 4.8; express-rate-limit
   removed; two `manager.create<T>()` call sites updated for typeorm's
   two-generic signature; verified locally: seed + migrations, validation
   pipe messages, all routes, WS, client build. Note: helmet only runs
   under isProduction() so its runtime path is first exercised in prod —
   the deploy health check + rollback covers it)
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

## Phase 5 — Manage env config from the GitHub UI (free, one evening)

Today changing a production env variable means SSH-ing into the droplet and
editing `shared/env/.env` by hand. Move the editing surface to GitHub:

1. Store the full contents of the server's `env/.env` as a single `ENV_FILE`
   secret (Settings → Secrets and variables → Actions). Editing config =
   pasting the updated file into the secret and re-running the deploy.
2. Add a step to `.github/workflows/deploy.yml` that writes the secret to
   `shared/env/.env` on the droplet before the release switch, so every
   deploy ships the current config.
3. Caveats to design around:
   - Actions secrets are **write-only** — the UI never shows the value again.
     The file on the droplet remains the readable source of truth; keep the
     secret and the droplet copy in sync by only ever editing via the secret
     once this lands.
   - Anyone with repo write access can exfiltrate secrets through a
     workflow — same trust boundary as the existing `DEPLOY_SSH_KEY`, fine
     for a solo repo.
   - The manual fallback (`deploy/deploy.sh`) must keep working without
     GitHub: it should leave `shared/env/.env` untouched, never require the
     secret.

## Explicit non-goals (decided, not forgotten)

- No test suite for now (revisit separately; API-level tests for orders,
  auth, balance would be the starting point).
- Single app instance stays; the in-memory WebSocket `userId → socket` map is
  an accepted constraint of that.
- No staging environment, no second droplet, no managed database, no
  Docker/Kubernetes/PaaS — nothing in this plan adds monthly cost.
