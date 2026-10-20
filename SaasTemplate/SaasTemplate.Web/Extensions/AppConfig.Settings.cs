using Microsoft.Extensions.Options;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Infrastructure.Settings;

namespace SaasTemplate.Web.Extensions
{
    public static partial class AppConfig
    {
        public static void ConfigureSettings(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<DbSettings>(configuration.GetSection("DbSettings"));
            services.AddSingleton<IDbSettings>(sp =>
                sp.GetRequiredService<IOptions<DbSettings>>().Value);

            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
            services.AddSingleton<IJwtSettings>(sp =>
                sp.GetRequiredService<IOptions<JwtSettings>>().Value);

            services.Configure<GoogleAuthSettings>(configuration.GetSection("GoogleAuthSettings"));
            services.AddSingleton<IGoogleAuthSettings>(sp =>
                sp.GetRequiredService<IOptions<GoogleAuthSettings>>().Value);

            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
            services.AddSingleton<IEmailSettings>(sp =>
                sp.GetRequiredService<IOptions<EmailSettings>>().Value);

            // CLIENT_URL is set by docker-compose from CORS_ALLOWED_ORIGIN; the fallback is the local dev server.
            services.AddSingleton<IClientSettings>(new ClientSettings
            {
                Url = (configuration["CLIENT_URL"] ?? Constants.ANGULAR_URL).TrimEnd('/')
            });
        }
    }
}
