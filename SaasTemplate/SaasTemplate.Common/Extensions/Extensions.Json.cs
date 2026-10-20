using Newtonsoft.Json;
using Formatting = Newtonsoft.Json.Formatting;

namespace SaasTemplate.Common.Extensions
{
    public static partial class Extensions
    {
        public static string Serialize<T>(this T obj, bool indented = false)
        {
            return JsonConvert.SerializeObject(obj, indented ? Formatting.Indented : Formatting.None);
        }

        public static T? Deserialize<T>(this string? json)
        {
            return string.IsNullOrWhiteSpace(json)
                ? default
                : JsonConvert.DeserializeObject<T>(json);
        }

        public static string SerializeList<T>(this IEnumerable<T> collection, bool indented = false)
        {
            return JsonConvert.SerializeObject(collection, indented ? Formatting.Indented : Formatting.None);
        }

        public static List<T> DeserializeList<T>(this string json)
        {
            return string.IsNullOrWhiteSpace(json)
                ? default
                : JsonConvert.DeserializeObject<List<T>>(json);
        }
    }
}
