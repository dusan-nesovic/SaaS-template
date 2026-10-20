using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SaasTemplate.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;

        public IdentityService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // Lookup

        public async Task<User?> FindByIdAsync(Guid userId)
        {
            return await _userManager.FindByIdAsync(userId.ToString());
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<User?> FindByExternalLoginAsync(string provider, string providerKey)
        {
            return await _userManager.FindByLoginAsync(provider, providerKey);
        }

        public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _userManager.Users.ToListAsync(cancellationToken);
        }

        // Accounts

        public async Task<bool> CreateAsync(User user, string? password = null)
        {
            var result = password == null
                ? await _userManager.CreateAsync(user)
                : await _userManager.CreateAsync(user, password);

            return result.Succeeded;
        }

        public async Task<bool> CheckPasswordAsync(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        // External logins

        public async Task<bool> HasExternalLoginAsync(User user)
        {
            var logins = await _userManager.GetLoginsAsync(user);

            return logins != null && logins.Any();
        }

        public async Task<bool> AddExternalLoginAsync(User user, string provider, string providerKey)
        {
            var result = await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerKey, provider));

            return result.Succeeded;
        }

        // Roles

        public async Task<List<UserRoleType>> GetRolesAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            return roles.Select(role => (UserRoleType)Enum.Parse(typeof(UserRoleType), role)).ToList();
        }

        public async Task AddToRoleAsync(User user, UserRoleType role)
        {
            await _userManager.AddToRoleAsync(user, role.ToString());
        }

        public async Task SetRolesAsync(User user, IEnumerable<UserRoleType> roles)
        {
            var wanted = roles.Select(role => role.ToString()).ToList();
            var current = await _userManager.GetRolesAsync(user);

            await _userManager.RemoveFromRolesAsync(user, current.Except(wanted).ToList());
            await _userManager.AddToRolesAsync(user, wanted.Except(current).ToList());
        }

        // Email confirmation and password reset

        public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<bool> ConfirmEmailAsync(User user, string token)
        {
            var result = await _userManager.ConfirmEmailAsync(user, token);

            return result.Succeeded;
        }

        public async Task<string> GeneratePasswordResetTokenAsync(User user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<bool> ResetPasswordAsync(User user, string token, string newPassword)
        {
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            return result.Succeeded;
        }
    }
}
