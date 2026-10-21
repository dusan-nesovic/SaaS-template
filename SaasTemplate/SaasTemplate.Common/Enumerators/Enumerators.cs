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

    // The app's colour scheme; System follows the device's light or dark setting.
    public enum ThemeType
    {
        [Description("System")]
        System = 0,
        [Description("Light")]
        Light = 1,
        [Description("Dark")]
        Dark = 2
    }
}
