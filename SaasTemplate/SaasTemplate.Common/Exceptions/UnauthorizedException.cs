using SaasTemplate.Common.Enumerators;
using SaasTemplate.Common.Extensions;

namespace SaasTemplate.Common.Exceptions
{
    public class UnauthorizedException : BaseApplicationException
    {
        public UnauthorizedException() 
            : base("You don't have permission to this action!")
        {
        }

        public UnauthorizedException(string message)
            : base(message)
        {
        }

        public UnauthorizedException(IEnumerable<UserRoleType> requiredRoles)
            : base("You don't have permission to this action! Required permission(s) is: " + string.Join(",", requiredRoles.Select(r => r.GetDescription())))
        {
        }
    }
}
