namespace SaasTemplate.Web.Extensions
{
    public static partial class AppConfig
    {
        public static void AddServerConfiguration(IServiceCollection services, IConfiguration configuration)
        {
            ConfigureSettings(services, configuration);
            AddDbContext(services);
            AddIdentity(services);
            AddAuthentication(services, configuration);
            AddApplicationServices(services, configuration);
            AddCustomCors(services, configuration);
        }
    }
}
