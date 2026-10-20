using SaasTemplate.Common.Models;

namespace SaasTemplate.Application.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(EmailMessage message);
    }
}
