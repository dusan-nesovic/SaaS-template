using System.ComponentModel;

namespace SaasTemplate.Common.Extensions
{
    public static partial class Extensions
    {
        public static string GetDescription<T>(this T enumerator)
        {
            var fi = enumerator?.GetType().GetField(enumerator.ToString()!);
            var attributes = fi?.GetCustomAttributes(typeof(DescriptionAttribute), false).Cast<DescriptionAttribute>().ToArray();

            if (attributes != null && attributes.Length > 0)
            {
                return attributes.First().Description;
            }

            return enumerator?.ToString();
        }
    }
}
