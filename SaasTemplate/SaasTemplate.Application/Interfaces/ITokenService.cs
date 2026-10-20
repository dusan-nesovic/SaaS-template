using SaasTemplate.Common.Enumerators;
using SaasTemplate.Common.Models;
using SaasTemplate.Domain.Entities;

namespace SaasTemplate.Application.Interfaces
{
    public interface ITokenService
    {
        AuthToken CreateToken(User user, IEnumerable<UserRoleType> roles);
    }
}
