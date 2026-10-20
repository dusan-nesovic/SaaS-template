using SaasTemplate.Common.Interfaces.Settings;

namespace SaasTemplate.Infrastructure.Settings
{
    public class DbSettings : IDbSettings
    {
        public string ConnectionString { get; set; }
    }
}
