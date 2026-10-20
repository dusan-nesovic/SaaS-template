using System.ComponentModel;

namespace SaasTemplate.Common.Enumerators
{
    public enum UserRoleType
    {
        [Description("Not Set")]
        NotSet = 0,
        [Description("Admin")]
        Admin = 1,
        [Description("User")]
        User = 2
    }
}
