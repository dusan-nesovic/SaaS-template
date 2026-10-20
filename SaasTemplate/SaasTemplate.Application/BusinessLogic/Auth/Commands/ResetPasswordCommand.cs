using System.Net;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Common.Models;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class ResetPasswordCommand : BaseCommand
    {
        private string Email { get; set; }

        public ResetPasswordCommand(string email)
        {
            Email = email;
        }

        public class Validator : AbstractValidator<ResetPasswordCommand>
        {
            public Validator()
            {
                RuleFor(x => x.Email).NotEmpty();
            }
        }

        public class Handler : BaseHandler<ResetPasswordCommand>
        {
            private readonly IIdentityService _identityService;
            private readonly IEmailService _emailService;
            private readonly IClientSettings _clientSettings;

            public Handler(IIdentityService identityService, IEmailService emailService, IClientSettings clientSettings)
            {
                _identityService = identityService;
                _emailService = emailService;
                _clientSettings = clientSettings;
            }

            public override async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
            {
                // Getting User from database and set email to confirmed.
                var user = await _identityService.FindByEmailAsync(request.Email);
                if (user != null)
                {
                    // Adding Token to Verify email.
                    var token = await _identityService.GeneratePasswordResetTokenAsync(user);

                    var angularAppLink = _clientSettings.Url;

                    var redirectLink = $"{angularAppLink}/app/change-password?token={WebUtility.UrlEncode(token)}&email={WebUtility.UrlEncode(user.Email)}";

                    var emailMessage = new EmailMessage
                    (
                        new string[] { user.Email! },
                        "Reset Your Password",
                        $@"
                        <html>
                            <body>
                                <h2>Reset Your Password!</h2>
                                <p>Hello, {user.FirstName}</p>
                                <p>To reset your password, please click the link below:</p>
                                <p><a href='{redirectLink}' style='color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Your Password</a></p>
                                <p>Best regards,<br>{Constants.APP_NAME} Team</p>
                            </body>
                        </html>"
                    );
                    _emailService.SendEmail(emailMessage);

                    return;
                }
                throw new NotFoundException(nameof(User), request.Email);
            }
        }
    }
}
