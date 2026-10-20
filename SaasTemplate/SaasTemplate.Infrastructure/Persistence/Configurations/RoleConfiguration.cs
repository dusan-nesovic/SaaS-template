using SaasTemplate.Domain.Entities;
using SaasTemplate.Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SaasTemplate.Infrastructure.Persistence.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        // The date of the initial migration, when the two roles were first seeded.
        private static readonly DateTime SeededOn = new DateTime(2026, 5, 30, 0, 0, 0, DateTimeKind.Utc);

        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Roles");

            builder.HasData(
                new Role
                {
                    Id = Guid.Parse("ee9a5336-9dcf-4c90-abd8-a57ca37fb362"),
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "1",
                    CreatedOn = SeededOn,
                    CreatedBy = AuditInterceptor.AnonymousUserId
                },
                new Role
                {
                    Id = Guid.Parse("00c1beb9-df3d-4bf1-b353-93b566921d14"),
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = "2",
                    CreatedOn = SeededOn,
                    CreatedBy = AuditInterceptor.AnonymousUserId
                }
            );
        }
    }
}
