using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;
using SaasTemplate.Web.Controllers.Base;

namespace SaasTemplate.Web.ReinforcedTypings.Generator
{
    public class ControllersGenerator : ClassCodeGenerator
    {
        public override RtClass GenerateNode(Type element, RtClass result, TypeResolver resolver)
        {
            result = base.GenerateNode(element, result, resolver);

            if (result == null)
            {
                return null;
            }

            result.Decorators.Add(new RtDecorator(@"Injectable()"));

            var httpServiceType = new RtSimpleTypeName("HttpClient");
            var settingsService = new RtSimpleTypeName("SettingsService");

            var constructor = new RtConstructor();

            if(element.BaseType == typeof(BaseController))
            {
                constructor.Arguments.Add(new RtArgument() { Type = httpServiceType, Identifier = new RtIdentifier("httpClient") });
                constructor.Arguments.Add(new RtArgument() { Type = settingsService, Identifier = new RtIdentifier("settingsService") });

                constructor.NeedsSuperCall = true;

                constructor.SuperCallParameters.Add("httpClient");
                constructor.SuperCallParameters.Add("settingsService");
            }
            else
            {
                constructor.Arguments.Add(new RtArgument() { Type = httpServiceType, Identifier = new RtIdentifier("protected httpClient") });
                constructor.Arguments.Add(new RtArgument() { Type = settingsService, Identifier = new RtIdentifier("protected settingsService") });
            }
            result.Members.Add(constructor);

            return result;
        }
    }
}
