using SaasTemplate.Common.Enumerators;
using SaasTemplate.Domain.Entities;

namespace SaasTemplate.Application.Interfaces
{
    // Accounts, passwords, roles and the one-time tokens around them. Methods that can be refused
    // (weak password, stale token, duplicate login) return false instead of throwing.
    public interface IIdentityService
    {
        // Lookup
        Task<User?> FindByIdAsync(Guid userId);
        Task<User?> FindByEmailAsync(string email);
        Task<User?> FindByExternalLoginAsync(string provider, string providerKey);
        Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default);

        // Accounts
        Task<bool> CreateAsync(User user, string? password = null);
        Task<bool> CheckPasswordAsync(User user, string password);

        // External logins
        Task<bool> HasExternalLoginAsync(User user);
        Task<bool> AddExternalLoginAsync(User user, string provider, string providerKey);

        // Roles
        Task<List<UserRoleType>> GetRolesAsync(User user);
        Task AddToRoleAsync(User user, UserRoleType role);
        Task SetRolesAsync(User user, IEnumerable<UserRoleType> roles);

        // Email confirmation and password reset
        Task<string> GenerateEmailConfirmationTokenAsync(User user);
        Task<bool> ConfirmEmailAsync(User user, string token);
        Task<string> GeneratePasswordResetTokenAsync(User user);
        Task<bool> ResetPasswordAsync(User user, string token, string newPassword);
    }
}
