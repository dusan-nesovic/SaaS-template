using SaasTemplate.Common.Interfaces.Settings;

namespace SaasTemplate.Infrastructure.Settings
{
    public class EmailSettings : IEmailSettings
    {
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
