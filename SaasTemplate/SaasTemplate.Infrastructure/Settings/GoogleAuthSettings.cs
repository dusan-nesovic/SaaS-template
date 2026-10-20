using SaasTemplate.Common.Interfaces.Settings;

namespace SaasTemplate.Infrastructure.Settings
{
    public class GoogleAuthSettings : IGoogleAuthSettings
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
