---
paths:
  - "SaasTemplate/SaasTemplate.Web/ClientApp/**"
---

# Frontend (Angular 18)

Root: `SaasTemplate/SaasTemplate.Web/ClientApp/`.

## Layout
- `src/app/main-page` — public landing page (header, hero, steps, features, closing, footer). Brand text comes from `Constants.APP_NAME`.
- `src/app/user-dashboard` — lazy module under `/app`: `authentication-components/`, `pages/{dashboard,admin-panel,error-logs,preference}`.
- Sidebar menu: `libs/models/menuItems.model.ts`; an item with `requiresAdmin: true` is shown to admins only.
- `libs/` — shared code, imported via `@Workspace/<name>`: `common`, `directives`, `guards`, `interceptors`, `interfaces`, `models`, `pipes`, `services`, `shared`, `_generated/*`.
- `src/scss/_*.scss` — theme, colors, spacing, forms, mixins.
- `src/assets/i18n/{en,sr,de,es,fr,it}.json`.

## Rules
- NgModules, no standalone components. Declare components in `user-dashboard.module.ts` (or `app.module.ts`); routes in `pages/dashboard-content-routing.module.ts`.
- API calls only through generated controllers from `@Workspace/_generated/services`; register each controller in a module's `providers`.
- Never edit `libs/_generated` — it is rewritten by the backend build.
- Dashboard pages extend `BaseDashboardComponent` (`user`, `entityId`, `hasAdminPermission`); other routed components extend `BaseComponent`.
- Subscriptions use `takeUntil(this.unsubscribe$)`.
- Wrap requests with `.pipe(withSpinner(this.loadingSpinnerService))`; feedback via `ToastService.addToastKey(severity, titleKey, detailKey)`.
- Templates use `@if` / `@for`, not `*ngIf` / `*ngFor`.
- Every visible string goes through `translate`; add the key to all six i18n files.
- Preferences: `ThemeService` (light / dark) and `LanguageService` keep the choice in localStorage; nothing is stored on the account.
- Enums: `enumToOptions(Enum, 'PREFIX')` for selects, `enumName` pipe for display.
- Shared building blocks in `libs/shared/components`: `app-donut-chart` (categorical breakdowns; a category's color slot is fixed by the caller, never by rank), `app-modal`.
- Lists are `app-data-grid`: column definitions (`GridColumn`, with `sortValue` for every sortable column and a `mobile` slot for the phone card) plus one `<ng-template appGridCell="key" let-row>` per column. It sorts, paginates and turns rows into cards on a phone; the page only filters and must pass a stored array (`filteredX`), never a getter. References: `admin-panel/users`, `error-logs` (row opens its details in an `app-modal`).
- Filter rows use the studio's `.filter-bar`, `.mode-toggle` / `.mode-btn` and `.filter-search`. Names and e-mail addresses never wrap.
- The admin panel is one page with tabs as child routes (`admin/users`, ...); a new admin list becomes another tab, not another menu item.
- Dates from the API are UTC; convert with `convertToLocalDate`.
- Route guards: `AuthenticationGuard`, `AdminGuard`. Paths from `Constants.BASE_PATH` / `LOGIN_PATH`.
- Styling: reuse the partials and variables in `src/scss`; no hard-coded colors.

## Style
- Import order: Angular, third-party, project — each under its comment header.
- Prettier: 150 columns, 2 spaces, single quotes, no arrow parens.
- Class members: public methods first, then `// Private methods`.

## Commands
- `npm start` — dev server on :4200 (normally run by `./docker.ps1 dev up`).
- `npx tsc --noEmit -p tsconfig.app.json` — type-check.
- `npm run build:prod` — production build.
