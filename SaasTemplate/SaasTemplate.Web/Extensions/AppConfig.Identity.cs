using Microsoft.AspNetCore.Identity;
using SaasTemplate.Domain.Entities;
using SaasTemplate.Infrastructure.Persistence.Contexts;

namespace SaasTemplate.Web.Extensions
{
    public static partial class AppConfig
    {
        public static void AddIdentity(IServiceCollection services)
        {
            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;

                // Same policy as the password validators of RegisterUserCommand and ChangePasswordCommand.
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
            });
        }
    }
}
