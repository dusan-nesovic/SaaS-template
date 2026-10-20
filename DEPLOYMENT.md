# Deployment

Production runs on a Hetzner server with Docker Compose:
Caddy (TLS, 80/443) → `web` (nginx :4200) → `/api/` → `api` (:8080) → `db` (PostgreSQL 16, not published).

- Server: `<server address>` — the checkout lives in `/opt/saas-template`.
- Env file: `/opt/saas-template/.env.production` (keys: `docker.ps1`). It is the only file edited by hand on the server.
- Volumes that must survive every redeploy: `pgdata` (database), `caddy_data` (certificates), `api_logs` (error log files).

## `dc` alias

`docker.ps1 prod` without PowerShell. Add to `~/.bashrc` on the server:

```bash
alias dc='docker compose --project-name saas-template-production --env-file /opt/saas-template/.env.production -f /opt/saas-template/docker-compose.yml -f /opt/saas-template/docker-compose.production.yml'
```

## Release

Pre-flight and release steps are in `.claude/skills/deploy/SKILL.md`. On the server:

```bash
cd /opt/saas-template && git pull && dc up -d --build
```

Migrations run when the `api` container starts.

## Database

Back up before deploying a migration that drops or rewrites data:

```bash
dc exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' > ~/backup-$(date +%Y%m%d-%H%M).sql
```

Restore (stop the api first so nothing writes during the restore):

```bash
dc stop api
dc exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < ~/backup-YYYYMMDD-HHMM.sql
dc start api
```

psql shell:

```bash
dc exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Granting the first Admin role: run `DBScripts/Add Admin Role.sql` against the production database (see the psql command above) with the user and role ids filled in. Further admins are assigned on the admin panel.

## Diagnostics

| What | Command |
|---|---|
| Container state | `dc ps` |
| Logs | `dc logs -f --tail 200 api` (also `web`, `caddy`, `db`) |
| Error log files (also on the admin error log page) | `dc exec api ls Logs` · `dc exec api tail -n 50 Logs/ExceptionErrors-YYYYMM.json` |
| Restart one service | `dc restart api` |
| Certificate problems | `dc logs caddy` — the site address is `CORS_ALLOWED_ORIGIN` |

Never run `dc down -v` and never remove the `pgdata` or `caddy_data` volumes.
