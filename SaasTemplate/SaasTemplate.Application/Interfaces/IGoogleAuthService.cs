using SaasTemplate.Common.Models;

namespace SaasTemplate.Application.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<string> ExchangeCodeForIdTokenAsync(string code, CancellationToken cancellationToken = default);
        Task<GoogleUser> ValidateIdTokenAsync(string idToken, CancellationToken cancellationToken = default);
    }
}
