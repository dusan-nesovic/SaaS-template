using System.Reflection;
using System.Text;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace SaasTemplate.Web.ReinforcedTypings.Generator
{
    public class ActionsGenerator : MethodCodeGenerator
    {
        public override RtFunction GenerateNode(MethodInfo element, RtFunction result, TypeResolver resolver)
        {
            result = base.GenerateNode(element, result, resolver);

            if (result == null)
            {
                return null;
            }

            foreach(var type in result.Arguments)
            {
                if (type.Type.ToString() == "any")
                {
                    type.Type = new RtSimpleTypeName("string");
                }
            }

            var returnType = result.ReturnType;
            if (returnType is RtSimpleTypeName && ((RtSimpleTypeName)returnType).TypeName == "void")
            {
                returnType = resolver.ResolveTypeName(typeof(object));
            }

            result.ReturnType = new RtSimpleTypeName("Observable", new[] { returnType });

            var parameters = element.GetParameters().Select(c => c.Name).ToList();
            var parameterTypes = element.GetParameters().Select(c => c.ParameterType).ToList();

            var controller = element.DeclaringType?.Name.Replace("Controller", string.Empty);
            var path = $"{controller}/{element.Name}";

            var angularAttribute = (MethodAttribute)Attribute.GetCustomAttribute(element, typeof(MethodAttribute))!;
            var httpPostAttribute = Attribute.GetCustomAttribute(element, typeof(HttpPostAttribute));
            var httpGetAttribute = Attribute.GetCustomAttribute(element, typeof(HttpGetAttribute));
            var allowAnonymousAttribute = Attribute.GetCustomAttribute(element, typeof(AllowAnonymousAttribute));

            var code = new StringBuilder();

            // Parameters
            if (!angularAttribute.IsFileUploadMethod)
            {
                if (parameters.Count == 1 && httpPostAttribute != null)
                {
                    code.AppendLine($"const body = <any>{parameters.Single()};");
                }
                else if (parameters.Any())
                {
                    var joinedParameters = string.Join(",", parameters.Select(p => $"'{p}': {p}"));
                    code.AppendLine($"const body = <any>{{ {joinedParameters} }};");
                }
            }

            // Post
            if(httpPostAttribute != null && !angularAttribute.IsFileUploadMethod)
            {
                code.AppendLine($"return this.httpClient.post<{returnType}>(");
                code.AppendLine($"this.settingsService.createApiUrl('{path}'),");
                code.AppendLine("body,");
                code.AppendLine("{");
                code.AppendLine($"\tresponseType: '{(angularAttribute?.IsResponseAsArrayBuffer == true ? "arraybuffer" : "json")}',");
                code.AppendLine("\tobserve: 'response',");
                code.AppendLine($"\twithCredentials: {(allowAnonymousAttribute == null).ToString().ToLower()},");
                code.AppendLine("})");
                code.AppendLine(".pipe(map(response => response.body));");
            }
            // Post + File
            else if (httpPostAttribute != null && angularAttribute.IsFileUploadMethod)
            {
                code.AppendLine($"return this.httpClient.post<{returnType}>(");
                code.AppendLine($"this.settingsService.createApiUrl('{path}'),");
                code.AppendLine("formData,");
                code.AppendLine("{");
                code.AppendLine($"\tresponseType: '{(angularAttribute?.IsResponseAsArrayBuffer == true ? "arraybuffer" : "json")}',");
                code.AppendLine("\tobserve: 'response',");
                code.AppendLine($"\twithCredentials: {(allowAnonymousAttribute == null).ToString().ToLower()},");
                code.AppendLine("})");
                code.AppendLine(".pipe(map(response => response.body));");
            }
            // Get
            else if (httpGetAttribute != null)
            {
                code.AppendLine($"return this.httpClient.get{(angularAttribute?.IsResponseAsArrayBuffer == true ? "" : $"<{returnType}>")}(");
                code.AppendLine($"this.settingsService.createApiUrl('{path}'),");
                code.AppendLine("{");
                code.AppendLine($"\tresponseType: '{(angularAttribute?.IsResponseAsArrayBuffer == true ? "arraybuffer" : "json")}',");
                code.AppendLine("\tobserve: 'response',");

                if (!parameters.Any())
                {
                    code.AppendLine($"\twithCredentials: {(allowAnonymousAttribute == null).ToString().ToLower()},");
                }
                else
                {
                    code.AppendLine($"\twithCredentials: {(allowAnonymousAttribute == null).ToString().ToLower()},");
                    code.AppendLine("\tparams: new HttpParams({ fromObject: body})");
                }

                code.AppendLine("})");
                code.AppendLine(".pipe(map(response => response.body));");
            }

            result.Body = new RtRaw(code.ToString());

            return result;
        }
    }
}
