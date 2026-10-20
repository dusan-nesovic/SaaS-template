using SaasTemplate.Application.Interfaces;
using SaasTemplate.Domain.Entities;
using SaasTemplate.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace SaasTemplate.Infrastructure.Persistence.Interceptors
{
    // Stamps CreatedOn/CreatedBy on new rows and ModifiedOn/ModifiedBy on changed rows of every
    // IAuditableEntity, right before EF writes them.
    public class AuditInterceptor : SaveChangesInterceptor
    {
        // CreatedBy for a row written without a signed-in user: a registration, a seeded role.
        public static readonly Guid AnonymousUserId = Guid.Empty;

        private readonly ICurrentUser _currentUser;

        public AuditInterceptor(ICurrentUser currentUser)
        {
            _currentUser = currentUser;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            Stamp(eventData.Context);

            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            Stamp(eventData.Context);

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void Stamp(DbContext? context)
        {
            if (context == null)
            {
                return;
            }

            var now = DateTime.UtcNow;
            Guid? userId = _currentUser.IsAuthenticated ? _currentUser.UserId : null;

            foreach (var entry in context.ChangeTracker.Entries<IAuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedOn = now;
                        // A new account has nobody signed in behind it (registration, first Google sign-in),
                        // so the account is recorded as its own creator.
                        entry.Entity.CreatedBy = userId ?? (entry.Entity is User user ? user.Id : AnonymousUserId);
                        break;

                    case EntityState.Modified:
                        // Creation data is written once. A handler that copies a whole object over the entity
                        // (SetValues) would otherwise overwrite it.
                        KeepOriginal(entry.Property(x => x.CreatedOn));
                        KeepOriginal(entry.Property(x => x.CreatedBy));

                        entry.Entity.ModifiedOn = now;
                        entry.Entity.ModifiedBy = userId;
                        break;
                }
            }
        }

        private static void KeepOriginal<T>(PropertyEntry<IAuditableEntity, T> property)
        {
            property.CurrentValue = property.OriginalValue;
            property.IsModified = false;
        }
    }
}
