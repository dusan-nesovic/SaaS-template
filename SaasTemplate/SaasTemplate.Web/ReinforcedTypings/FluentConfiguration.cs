using System.Reflection;
using Reinforced.Typings.Attributes;
using Reinforced.Typings.Fluent;
using ConfigurationBuilder = Reinforced.Typings.Fluent.ConfigurationBuilder;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Domain.Entities;
using SaasTemplate.Web.ReinforcedTypings.Generator;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Application.Dtos.Auth;
using SaasTemplate.Common.Models;

[assembly: TsGlobal(AutoOptionalProperties = true)]
namespace SaasTemplate.Web.ReinforcedTypings
{
    public static class FluentConfiguration
    {
        public const string SOLUTION_NAMESPACE = "SaasTemplate";

        private static TBuilder BaseConfiguration<TBuilder>(this TBuilder conf) 
            where TBuilder : ClassOrInterfaceExportBuilder 
        {
            conf
                .WithPublicProperties(i => i.CamelCase())
                .WithProperties(i => i.PropertyType == typeof(DateTime) || i.PropertyType == typeof(DateTime?), i => i.Type("Date"))
                .WithProperties(i => i.PropertyType == typeof(Guid) || i.PropertyType == typeof(Guid?), i => i.Type("string"));

            return conf;
        }

        private static readonly Action<InterfaceExportBuilder> _interfaceConfiguration = conf => conf
                                .BaseConfiguration()
                                .ExportTo("interfaces.ts");

        private static readonly Action<ClassExportBuilder> _serviceConfiguration = conf => conf
                                .AddImport("{ Injectable }", "@angular/core")
                                .AddImport("{ HttpParams, HttpClient }", "@angular/common/http")
                                .AddImport("{ Observable }", "rxjs")
                                .AddImport("{ SettingsService }", "@Workspace/services")
                                .AddImport("{ map }", "rxjs/operators")
                                .ExportTo("services.ts")
                                .WithCodeGenerator<ControllersGenerator>();


        public static void Configure(ConfigurationBuilder builder)
        {
            builder.Global(i => i.UseModules());

            builder.ConfigureTypes();
        }

        private static void ConfigureTypes(this ConfigurationBuilder builder)
        {
            Func<Type, bool> predicate = p => !p.IsAbstract && !p.IsGenericTypeDefinition;

            builder.ExportAsInterfaces(
                Assembly.GetAssembly(typeof(UserDto))!.ExportedTypes.Where(predicate).Where(i => i.Namespace!.StartsWith("SaasTemplate.Application.Dtos")).ToArray(), _interfaceConfiguration
            );

            builder.ExportAsClasses(
                Assembly.GetAssembly(typeof(BaseController))!.ExportedTypes.Where(predicate).Where(i => i.Namespace!.StartsWith($"{SOLUTION_NAMESPACE}.Web.Controllers")).OrderBy(i => i.Name).OrderBy(i => i.Name != nameof(BaseController)).ToArray(), _serviceConfiguration
            );

            builder.ExportAsEnums(new Type[]
                {
                    typeof(UserRoleType)
                }, 
                conf => conf.ExportTo("enums.ts")
                //.WithCodeGenerator<EnumsGenerator>()
            );
        }
    }
}
