using System.Net;
using System.Net.Mail;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Common.Models;

namespace SaasTemplate.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IEmailSettings _emailSettings;

        public EmailService(IEmailSettings emailSettings)
        {
            _emailSettings = emailSettings;
        }

        public void SendEmail(EmailMessage message)
        {
            var emailMessage = CreateMailMessage(message);
            Send(emailMessage);
        }

        private MailMessage CreateMailMessage(EmailMessage message)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.From, Constants.APP_NAME),
                Subject = message.Subject,
                Body = message.Content,
                IsBodyHtml = true
            };

            foreach (var toAddress in message.To)
            {
                mailMessage.To.Add(toAddress.ToString());
            }

            return mailMessage;
        }

        private void Send(MailMessage mailMessage)
        {
            using (var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password);
                client.UseDefaultCredentials = false;

                try
                {
                    client.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to send email.", ex);
                }
            }
        }
    }
}
