namespace SaasTemplate.Common.Interfaces.Settings
{
    public interface IClientSettings
    {
        // Origin of the Angular client, without a trailing slash. Base for the links sent in emails.
        string Url { get; }
    }
}
