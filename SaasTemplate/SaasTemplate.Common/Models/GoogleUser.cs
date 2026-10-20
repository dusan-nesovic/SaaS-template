namespace SaasTemplate.Common.Models
{
    public class GoogleUser
    {
        public string Subject { get; set; }
        public string Email { get; set; }
        public string? GivenName { get; set; }
        public string? FamilyName { get; set; }
        public string? Picture { get; set; }
    }
}
