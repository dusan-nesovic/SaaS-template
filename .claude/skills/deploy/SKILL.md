---
name: deploy
description: Deploy to production or change how the site is served (nginx, Caddy, compose, env keys). Runbook for the Hetzner server.
disable-model-invocation: true
---

# Deploy

Full runbook: `DEPLOYMENT.md` (server setup, `dc` alias, backups, diagnostics).

## Pre-flight (local)
1. `$env:CI='true'; dotnet build SaasTemplate/SaasTemplate.slnx`
2. `npx tsc --noEmit -p tsconfig.app.json` in `ClientApp`
3. `git status` — `libs/_generated` and migrations committed, no `.env*` or logs staged.
4. New migration that drops or rewrites data → tell the user to back up first (`DEPLOYMENT.md` → Database).

## Release
The user pushes to `main` and runs on the server:
```bash
cd /opt/saas-template && git pull && dc up -d --build
```
Migrations run on API startup. Do not SSH or run production commands without an explicit request.

## Where changes belong
| Change | File |
|---|---|
| Headers, redirects, SPA fallback, `/api/` proxy | `SaasTemplate/nginx.conf` |
| Domain, TLS | `Caddyfile` (address comes from `CORS_ALLOWED_ORIGIN`) |
| Services, volumes, restart, logging | `docker-compose.yml`, `docker-compose.production.yml` |
| New setting or secret | `docker-compose.yml` (`Section__Key`), key list in `docker.ps1`, value in `.env.*` on each machine |
| API / web image | `SaasTemplate/Dockerfile`, `Dockerfile.angular` |

Never hand-edit files on the server except `.env.production`; never remove the `caddy_data` or `pgdata` volumes.
