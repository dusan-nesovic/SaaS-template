using Reinforced.Typings.Attributes;

namespace SaasTemplate.Web.ReinforcedTypings.Generator
{
    public class MethodAttribute : TsFunctionAttribute
    {
        public MethodAttribute(Type returnType)
        {
            StrongType = returnType;

            CodeGeneratorType = typeof(ActionsGenerator);
        }

        public bool IsResponseAsArrayBuffer { get; set; }

        public bool IsFileUploadMethod { get; set; }
    }
}
