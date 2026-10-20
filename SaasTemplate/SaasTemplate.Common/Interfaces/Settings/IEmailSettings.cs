namespace SaasTemplate.Common.Interfaces.Settings
{
    public interface IEmailSettings
    {
        public string From { get; }
        public string SmtpServer { get; }
        public int Port { get; }
        public string Username { get; }
        public string Password { get; }
    }
}
