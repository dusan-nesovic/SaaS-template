---
paths:
  - "SaasTemplate/**/*.cs"
  - "SaasTemplate/**/*.csproj"
---

# Backend

## Layers
- `Domain` — entities only.
- `Application` — commands, queries, validators, DTOs, service interfaces.
- `Infrastructure` — EF Core, service implementations, settings.
- `Common` — constants, enums, exceptions, extensions, models, settings contracts.
- `Web` — controllers, DI registration (`Extensions/AppConfig.*`), `ExceptionMiddleware`, Reinforced.Typings config.

## Controllers
- Thin: `Mediator.Send(...)` and return. Derive from `BaseController`, route `/api/[controller]/[action]`.
- Every action needs `[HttpGet|HttpPost]` and `[Method(typeof(TResponse))]` (`typeof(void)` for none) — the TypeScript client is generated from them.
- `[HttpGet]` binds from the query string; `[HttpPost]` takes one `[FromBody]` argument.
- Auth per controller/action: `[Authorize]`, `[Authorize(Roles = "Admin")]`, `[AllowAnonymous]`.
- Admin access to other users' data is read-only and goes through separate `GetAdmin*` queries behind `[Authorize(Roles = "Admin")]`; the owner's handlers keep their `ICurrentUser` filter and never get an admin bypass. Admin DTOs carry what the admin needs, not other users' private content.

## Commands and queries
- `Create|Update|Delete<Entity>Command : BaseCommand<T>`, `Get<Entity>[ById]Query : BaseQuery<T>`.
- Private input properties, set in the constructor.
- Nested `Handler : BaseHandler<TRequest, TResponse>` with `Handler(IApplicationDbContext dbContext) : base(dbContext)`.
- Input rules go in a nested `Validator : AbstractValidator<TheCommand>` next to `Handler`; it reaches the private properties directly (`RuleFor(x => x.RegisterUser.Email)`). No validation code and no regions in the handler body.
- Return the DTO directly. No result wrapper.
- The signed-in user comes from `ICurrentUser.UserId` (JWT `NameIdentifier` claim), never from the request. Every query or write on user-owned data filters by it; a row owned by someone else is a `NotFoundException`.

## Validation and errors
- `ValidationBehavior` (MediatR pipeline, `_Base/`) runs every nested `Validator` before its handler and throws `ValidationException` through `ValidationResult.ThrowIfInvalid()`. Validators are registered by assembly scan; nothing to wire per command.
- Error keys are the payload property names (`Email`, not `LoginUser.Email`) - `ValidationExtensions.UseRequestPropertyNames()`.
- Rules shared by several commands live in `<Feature>/Validators/`. A rule that depends on loaded data stays in the handler and ends with `ThrowIfInvalid()`.
- A file that imports `FluentValidation` and throws the project's `ValidationException` needs the `using ValidationException = SaasTemplate.Common.Exceptions.ValidationException;` alias.
- Throw `ValidationException`, `NotFoundException`, `InvalidRequestException`, `UnauthorizedException`; `ExceptionMiddleware` maps them to 400 / 404 / 400 / 401. Anything else is logged and returned as 500.

## DTOs and generated client
- Everything in `Application/Dtos` is exported to `ClientApp/libs/_generated/interfaces.ts`; controllers to `services.ts`; enums to `enums.ts`.
- New enums must be listed in `ReinforcedTypings/FluentConfiguration.cs`.
- Renaming a DTO property or action renames it on the client — grep `ClientApp/src` and `ClientApp/libs`.
- Every DTO class ends with `Dto` (`LoginUserDto`); request-only payloads may use `RequestDto`.

## Services
- Interface in `Application/Interfaces`, implementation in `Infrastructure/Services`, registered in `Web/Extensions/AppConfig.Services.cs`.
- `Application` references only MediatR, EF Core, FluentValidation and Newtonsoft. No ASP.NET, Identity (`UserManager`), JWT, Google or hosting types in handlers - go through `IIdentityService`, `ITokenService`, `IGoogleAuthService`, `ICurrentUser`, `IClientSettings`. No file system either: the error log is read through `IErrorLogService`.
- `IApplicationDbContext` is the only view of EF in handlers; never cast it to `DbContext`. Update a loaded entity by assigning its properties.
- New setting: class in `Infrastructure/Settings`, bound in `AppConfig.Settings.cs`, env mapping in `docker-compose.yml`.

## Style
- Classic constructors, block-scoped namespaces, `_camelCase` fields, `I` prefix on interfaces.
- Booleans: `Is` / `Has` / `Can`. Dates end with `On` (`CreatedOn`, `ModifiedOn`, `SentOn`, `RespondedOn`), in entities, DTOs and the client; only the event itself keeps `EventDate`.
- Namespaces mirror folders (`BusinessLogic.Users.Commands`).
