using FluentValidation;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Extensions;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Infrastructure.Services;

namespace SaasTemplate.Web.Extensions
{
    public static partial class AppConfig
    {
        public static void AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient();
            services.AddHttpContextAccessor();

            services.AddScoped<ICurrentUser, CurrentUser>();
            services.AddScoped<IIdentityService, IdentityService>();

            services.AddSingleton<IEmailService, EmailService>();
            services.AddSingleton<ITokenService, TokenService>();
            services.AddSingleton<IErrorLogService, ErrorLogService>();
            services.AddSingleton<IGoogleAuthService, GoogleAuthService>();

            var applicationAssembly = typeof(ValidationBehavior<,>).Assembly;

            ValidationExtensions.UseRequestPropertyNames();
            services.AddValidatorsFromAssembly(applicationAssembly);

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(applicationAssembly);
                cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });
        }
    }
}
