using System.Net.Mail;

namespace SaasTemplate.Common.Models
{
    public class EmailMessage
    {
        public List<MailAddress> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public EmailMessage(IEnumerable<string> to, string subject, string content)
        {
            To = new List<MailAddress>();
            To.AddRange(to.Select(x => new MailAddress(x)));
            Subject = subject;
            Content = content;
        }
    }
}
