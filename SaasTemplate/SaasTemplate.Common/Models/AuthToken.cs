namespace SaasTemplate.Common.Models
{
    public class AuthToken
    {
        public string Value { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
