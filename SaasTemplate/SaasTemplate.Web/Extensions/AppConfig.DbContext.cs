using Microsoft.EntityFrameworkCore;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Infrastructure.Persistence.Contexts;
using SaasTemplate.Infrastructure.Persistence.Interceptors;

namespace SaasTemplate.Web.Extensions
{
    public static partial class AppConfig
    {
        public static void AddDbContext(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>((sp, options) =>
            {
                var dbSettings = sp.GetRequiredService<IDbSettings>();

                if (string.IsNullOrWhiteSpace(dbSettings.ConnectionString))
                {
                    throw new InvalidOperationException(
                        "DbSettings:ConnectionString is not configured. The api service gets it from the env file, " +
                        "so start the stack with ./docker.ps1 <dev|prod> up instead of running the project directly.");
                }

                options.UseNpgsql(dbSettings.ConnectionString)
                    .AddInterceptors(sp.GetRequiredService<AuditInterceptor>());
            });

            services.AddScoped<AuditInterceptor>();
            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        }
    }
}
