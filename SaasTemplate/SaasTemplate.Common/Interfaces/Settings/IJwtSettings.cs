namespace SaasTemplate.Common.Interfaces.Settings
{
    public interface IJwtSettings
    {
        string ValidIssuer { get; }
        string ValidAudience { get; }
        string Secret { get; }
    }
}
