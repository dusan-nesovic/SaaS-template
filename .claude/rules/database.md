---
paths:
  - "SaasTemplate/SaasTemplate.Domain/**"
  - "SaasTemplate/SaasTemplate.Infrastructure/Persistence/**"
  - "SaasTemplate/SaasTemplate.Application/Interfaces/IApplicationDbContext.cs"
  - "DBScripts/**"
---

# Database (PostgreSQL 16, EF Core 10)

## Model
- `User`, `Role` (+ Identity's `IdentityUserRole<Guid>`, `IdentityUserLogin<Guid>`) — ASP.NET Core Identity types, `Guid` keys.
- `User.Theme` is stored as `int` (`ThemeType`: 0 System, 1 Light, 2 Dark); `User.Language` is a language code (`Constants.LANGUAGES`) or null until the user picks one. Both are written only by `UpdatePreferenceCommand` and returned on sign-in in `UserProfileDto`.
- The app's own entities go next to them; see the `ef-migration` skill.

## Entities
- Entities are plain property classes: public setters, no methods, no rules. Logic lives in handlers, shared logic in services.
- Every entity implements `IAuditableEntity` (`Domain/Interfaces`): `CreatedOn`, `CreatedBy` required, `ModifiedOn`, `ModifiedBy` nullable, user ids not emails. `AuditInterceptor` (`Infrastructure/Persistence/Interceptors`) fills them on save from `ICurrentUser`; handlers never set them and cannot overwrite the creation pair. Without a signed-in user `CreatedBy` is the account itself for a new `User`, otherwise `AuditInterceptor.AnonymousUserId` (`Guid.Empty`).
- A new mandatory column needs a backfill for existing rows in the migration (`migrationBuilder.Sql`).
- Review every generated rename: EF pairs renamed columns of the same type by guessing and can swap them (it did with `UpdatedAt`/`SentAt`).
- New entities get `Id = Guid.NewGuid()` in the handler and are added through their `DbSet` (`_dbContext.Projects.Add(...)`), never through a parent's collection: EF treats a keyed entity it only discovers through a navigation as an existing row and issues an UPDATE.

## Rules
- Access only through `IApplicationDbContext`. No repositories, no raw SQL in handlers.
- Entities: singular name, `Guid Id`; `DbSet` plural, declared in both `ApplicationDbContext.DbSets.cs` and `IApplicationDbContext`.
- Mapping in `Persistence/Configurations/<Entity>Configuration.cs` (`IEntityTypeConfiguration<T>`): table name, required, max length, indexes, delete behaviour. Keep `OnModelCreating` minimal.
- `DateTime` is always UTC (`DateTime.UtcNow`).
- Queries: project to DTOs with `.Select(...)`, pass `cancellationToken`, filter user-owned data by `ICurrentUser.UserId`.
- Multi-step writes use `_dbContext.Database.BeginTransactionAsync`.

## Migrations
- Never edit or delete an existing migration; add a new one.
- `dotnet ef migrations add <Name> --project SaasTemplate/SaasTemplate.Infrastructure` — `ApplicationDbContextFactory` reads `.env.development` (`localhost:${DB_PORT}`) or `SAASTEMPLATE_DB`; the dev `db` container must be running.
- Applied automatically on API startup, in dev and in production. Flag data-destructive migrations before finishing.

## Access
- Dev: pgAdmin on `http://localhost:5050`, db on `localhost:5432`.
- Production: db port is not published; backup / restore / psql commands are in `DEPLOYMENT.md`.
- `DBScripts/` — manual one-off SQL. `Add Admin Role.sql` grants the first admin (fill in the user and role ids).
