using SaasTemplate.Common.Interfaces.Settings;

namespace SaasTemplate.Infrastructure.Settings
{
    public class JwtSettings : IJwtSettings
    {
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public string Secret { get; set; }
    }
}
