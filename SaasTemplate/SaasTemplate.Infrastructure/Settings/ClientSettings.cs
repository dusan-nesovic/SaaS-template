using SaasTemplate.Common.Interfaces.Settings;

namespace SaasTemplate.Infrastructure.Settings
{
    public class ClientSettings : IClientSettings
    {
        public string Url { get; set; }
    }
}
