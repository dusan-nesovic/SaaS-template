using SaasTemplate.Common.Enumerators;

namespace SaasTemplate.Application.Dtos.Preferences
{
    // How the app looks and speaks for the signed-in user.
    public class UserPreferenceDto
    {
        public ThemeType Theme { get; set; }
        // Null until the user picks a language; the client then keeps the one it already uses.
        public string? Language { get; set; }
    }
}
