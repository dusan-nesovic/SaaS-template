# SaaS Template

A SaaS app built from the SaaS template (`TEMPLATE.md` in the template repository): a public landing page and a signed-in area (CRM) on ASP.NET Core 9, Angular 18 and PostgreSQL 16, run with Docker Compose.

What is already there:

- **Landing page** — header with language and theme switch, hero, "how it works", features, closing call to action, footer.
- **Auth** — registration with email confirmation, login, password reset, Google sign-in, JWT.
- **Dashboard** — a user view and an admin view (users, registrations over 30 days, email verification, errors).
- **Admin panel** — users and their roles; new admin lists go in as tabs.
- **Error log** — unhandled exceptions are written to monthly JSON files in `Logs/` and shown on an admin page.
- **Preferences** — theme (light, dark) and language (en, sr, de, es, fr, it), kept in the browser.

## First run

1. Create `.env.development` in the repo root. Running `./docker.ps1 dev up` without it prints the list of keys.
2. Start the stack: `./docker.ps1 dev up --build` — the web app is on http://localhost:4200, the api on :8080, pgAdmin on :5050.
3. Register, confirm the email, then give your account the Admin role with `DBScripts/Add Admin Role.sql` (fill in your user id and the Admin role id).
4. Fill in the real texts: `MAIN_PAGE.*` in `ClientApp/src/assets/i18n/*.json`, the email sender in `appsettings.json`.

## Adding a feature

Start from the `.claude/skills` runbooks: `ef-migration` (entity and migration), `feature-slice` (endpoint, generated client, Angular page) and `i18n` (texts). A new page goes in `user-dashboard/pages`, its route in `dashboard-content-routing.module.ts` and its menu entry in `libs/models/menuItems.model.ts`.

Production deployment: `DEPLOYMENT.md`.
