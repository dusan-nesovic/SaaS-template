using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Common.Models;
using SaasTemplate.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace SaasTemplate.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IJwtSettings _jwtSettings;

        public TokenService(IJwtSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
        }

        public AuthToken CreateToken(User user, IEnumerable<UserRoleType> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.ValidIssuer,
                audience: _jwtSettings.ValidAudience,
                expires: DateTime.UtcNow.AddDays(1),
                claims: claims,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                );

            return new AuthToken
            {
                Value = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = token.ValidTo,
            };
        }
    }
}
