---
name: feature-slice
description: Add or change an API endpoint end to end - DTO, MediatR command/query, validator, controller action, generated TypeScript client, Angular usage. Use for any new backend endpoint or feature.
---

# Feature slice

Paths are relative to `SaasTemplate/`. Copy the shape of an existing file in the same feature before writing.

1. **DTO** — `SaasTemplate.Application/Dtos/<Feature>/<Name>Dto.cs` (request payloads: `<Name>RequestDto`).
2. **Command or query** — `SaasTemplate.Application/BusinessLogic/<Feature>/{Commands,Queries}/`. Reference: `Users/Commands/UpdateUserRolesCommand.cs`, `Users/Queries/GetAdminUsersQuery.cs`.
3. **Validator** — nested `Validator : AbstractValidator<TheCommand>` in the same file, above `Handler`. It runs automatically. Reference: `Auth/Commands/RegisterUserCommand.cs`.
4. **Controller action** — `SaasTemplate.Web/Controllers/<Feature>Controller.cs`:
   ```csharp
   [HttpPost]
   [Method(typeof(UserInfoDto))]
   public async Task<IActionResult> UpdateUserRoles([FromBody] UserInfoDto userInfo)
   {
       return Ok(await Mediator.Send(new UpdateUserRolesCommand(userInfo)));
   }
   ```
5. **New enum** — add it to `ExportAsEnums` in `SaasTemplate.Web/ReinforcedTypings/FluentConfiguration.cs`.
6. **New entity or column** — use the `ef-migration` skill.
7. **Regenerate the client** — `$env:CI='true'; dotnet build SaasTemplate/SaasTemplate.Web` (or let the running dev `api` container do it). Check the diff in `ClientApp/libs/_generated/`.
8. **New controller** — add it to `providers` in `app.module.ts` or `user-dashboard.module.ts`.
9. **Angular** — inject the generated controller, call it with `withSpinner`, add i18n keys (`i18n` skill).
10. **Verify** — backend build and `npx tsc --noEmit -p tsconfig.app.json` in `ClientApp`.

Conventions: `.claude/rules/backend.md`, `.claude/rules/frontend.md`.
