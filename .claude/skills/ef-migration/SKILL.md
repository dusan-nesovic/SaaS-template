---
name: ef-migration
description: Change the database schema - add or modify an entity, its EF Core configuration and create a migration. Use for any new table, column, index or relationship.
---

# EF Core migration

Paths are relative to `SaasTemplate/`.

1. **Entity** — `SaasTemplate.Domain/Entities/<Entity>.cs`.
2. **Configuration** — `SaasTemplate.Infrastructure/Persistence/Configurations/<Entity>Configuration.cs`. Reference: `UserConfiguration.cs`.
3. **New entity only** — add the `DbSet` to `Persistence/Contexts/ApplicationDbContext.DbSets.cs` and `SaasTemplate.Application/Interfaces/IApplicationDbContext.cs`.
4. **Start the database** — `./docker.ps1 dev up -d db`.
5. **Create** (from the repo root):
   ```bash
   dotnet ef migrations add <PascalCaseName> --project SaasTemplate/SaasTemplate.Infrastructure
   ```
6. **Review** the generated `Up` / `Down` in `Persistence/Migrations/`. Watch for unintended drops, or renames turned into drop + add.
7. **Apply** — restart the API; migrations run on startup.

Undo an unapplied migration: `dotnet ef migrations remove --project SaasTemplate/SaasTemplate.Infrastructure`.

Conventions: `.claude/rules/database.md`.
