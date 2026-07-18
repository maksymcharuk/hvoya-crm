---
name: verify
description: How to build, launch, and drive Hvoya CRM locally to verify backend changes at the HTTP surface.
---

# Verifying Hvoya CRM locally

## Build & run (backend, compiled)

```bash
npm run build
NODE_ENV=test OPENAI_API_KEY=sk-dummy-local node dist/src/main.js
```

- `env/.env` does not exist locally; only `env/test.env` does — always run
  with `NODE_ENV=test` (DB `hvoya_crm_test` on local postgres, app port 3001).
- `OPENAI_API_KEY` (any non-empty value) is required or `NlqService` throws
  at DI time and the app never binds.
- Process env vars override `env/test.env` values (`PORT`, `DB_PORT`, …) —
  useful for running a second instance side by side.
- API surface: `http://127.0.0.1:3001/api/...`; `/api/health` is public
  (200 + `{status, version, uptime}`, 503 when DB unreachable).

## Gotchas

- Local port 5433 is already taken (second postgres cluster) — pick 5666+
  for proxies.
- To simulate "DB goes down" without touching the local postgres service:
  run a node TCP proxy to 5432, start the app with `DB_PORT=<proxy port>`,
  then kill the proxy:

  ```bash
  node -e "const net=require('net');net.createServer(c=>{const u=net.connect(5432,'127.0.0.1');c.pipe(u);u.pipe(c);c.on('error',()=>{});u.on('error',()=>{})}).listen(5666,'127.0.0.1')" &
  ```

- Unknown GET paths under `/api` fall through to the Angular `index.html`
  (ServeStatic) with HTTP 200 — don't mistake that for a working endpoint.
