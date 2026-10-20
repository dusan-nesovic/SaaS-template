using Microsoft.EntityFrameworkCore;
using SaasTemplate.Domain.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace SaasTemplate.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DatabaseFacade Database { get; }

        // DbSets
        DbSet<User> Users { get; }

        // Methods
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
