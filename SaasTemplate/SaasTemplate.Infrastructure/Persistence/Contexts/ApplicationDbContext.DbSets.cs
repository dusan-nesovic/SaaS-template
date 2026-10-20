using Microsoft.EntityFrameworkCore;
using SaasTemplate.Domain.Entities;

namespace SaasTemplate.Infrastructure.Persistence.Contexts
{
    // The app's own tables. Users and Roles come from IdentityDbContext; declare every new DbSet here and in
    // IApplicationDbContext, e.g. public DbSet<Project> Projects { get; set; }
    public partial class ApplicationDbContext
    {
    }
}
