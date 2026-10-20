using System.Security.Claims;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using Microsoft.AspNetCore.Http;

namespace SaasTemplate.Infrastructure.Services
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId
        {
            get
            {
                if (!TryGetUserId(out var userId))
                {
                    throw new UnauthorizedException("Your session is no longer valid. Please sign in again.");
                }

                return userId;
            }
        }

        public bool IsAuthenticated => TryGetUserId(out _);

        private bool TryGetUserId(out Guid userId)
        {
            var value = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Guid.TryParse(value, out userId);
        }
    }
}
