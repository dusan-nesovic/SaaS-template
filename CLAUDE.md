# SaaS Template

Starter for a SaaS app: public landing page plus a signed-in area (CRM) with registration and login (email + Google), dashboard (user and admin view), admin panel (users and roles), an error log viewer (unhandled exceptions) and user preferences (theme, language). The app's own features are added on top of it.

## Stack
- Backend: .NET 10, ASP.NET Core controllers, MediatR, FluentValidation, Identity + JWT + Google login, Serilog, SMTP email.
- Database: PostgreSQL 16, EF Core 10 (Npgsql).
- Frontend: Angular 18 (NgModules), PrimeNG, Angular Material, ngx-translate.
- Infra: Docker Compose; production on Hetzner: Caddy (TLS) → `web` (nginx :4200) → `/api/` → `api` (:8080) → `db`.

## Layout
```
docker.ps1, docker-compose*.yml, Caddyfile, DEPLOYMENT.md, global.json (SDK 10)
.template.config/              dotnet new template definition (usage: TEMPLATE.md)
DBScripts/                     manual SQL
SaasTemplate/
  SaasTemplate.slnx, Directory.Build.props (target framework), Directory.Packages.props (package versions)
  Dockerfile (api), Dockerfile.angular (web), nginx.conf
  SaasTemplate.Domain/          entities only
  SaasTemplate.Application/     BusinessLogic/<Feature>/{Commands,Queries}, Dtos/, Interfaces/
  SaasTemplate.Infrastructure/  Persistence/{Contexts,Configurations,Interceptors,Migrations}, Services/, Settings/
  SaasTemplate.Common/          Constants, Enumerators, Exceptions, Extensions, Interfaces/Settings, Models
  SaasTemplate.Web/             Controllers/, Extensions/AppConfig.*, Middlewares/, ReinforcedTypings/, ClientApp/
```

## Commands
| Task | Command |
|---|---|
| Dev stack (db, api watch, ng serve, pgadmin :5050) | `./docker.ps1 dev up --build` |
| Stop / logs | `./docker.ps1 dev down` · `./docker.ps1 dev logs -f api` |
| Build backend | `$env:CI='true'; dotnet build SaasTemplate/SaasTemplate.slnx` |
| Type-check frontend | `npx tsc --noEmit -p tsconfig.app.json` (in `ClientApp`) |
| Add migration | `dotnet ef migrations add <Name> --project SaasTemplate/SaasTemplate.Infrastructure` |

- Without `CI=true` the Web build runs `tsc --noEmit` and fails if `tsc` is not on PATH.
- No automated tests exist. Verify with the build, the type-check, and the running dev stack.

## Configuration
- All secrets live in untracked `.env.development` / `.env.production` (key list: `docker.ps1`). Never print or commit their values.
- Compose maps them to `Section__Key` env vars (`DbSettings__ConnectionString`, `JwtSettings__Secret`, `GoogleAuthSettings__ClientSecret`, `EmailSettings__Password`, `Cors__AllowedOrigins__0`, `Logging__LogLevel__Default`).
- `CORS_ALLOWED_ORIGIN` is the single source of the domain: CORS, email links (`CLIENT_URL`), Caddy site address.
- Admin role: assigned manually with SQL (`DBScripts/Add Admin Role.sql`, fill in the user and role ids), further admins on the admin panel.
- `appsettings.json` holds non-secret values only. Unhandled exceptions are written by `ErrorLogService` to `Logs/ExceptionErrors-yyyyMM.json` and read back by the admin error log page.
- `GoogleAuthSettings:ClientId` (appsettings) and `GOOGLE_CLIENT_ID` (`ClientApp/libs/common/constants.ts`) must be the same client: Google ID tokens are accepted only for that audience.
- The brand name is `Constants.APP_NAME` (backend `Common/Constants`, frontend `libs/common/constants.ts`) and the `<title>` in `index.html`.

## Rules and skills
- `.claude/rules/backend.md`, `frontend.md`, `database.md` — conventions per area.
- `.claude/skills/` — `feature-slice` (new endpoint), `ef-migration`, `i18n`, `deploy`.

## Known issues
- Some shared components still use `*ngIf` / `*ngFor` (the date/time pickers) and several component `.scss` files hard-code colors.

## Workflow
- Work directly on `main` in this checkout; the user commits.
