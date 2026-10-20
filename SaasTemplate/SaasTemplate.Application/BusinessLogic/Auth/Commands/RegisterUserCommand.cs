using System.Net;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Auth;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Common.Models;
using SaasTemplate.Domain.Entities;
using FluentValidation;
using ValidationException = SaasTemplate.Common.Exceptions.ValidationException;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class RegisterUserCommand : BaseCommand<RegisterUserDto>
    {
        private RegisterUserDto RegisterUser { get; set; }

        public RegisterUserCommand(RegisterUserDto registerUser)
        {
            RegisterUser = registerUser;
        }

        public class Validator : AbstractValidator<RegisterUserCommand>
        {
            public Validator()
            {
                RuleFor(x => x.RegisterUser.FirstName)
                    .NotEmpty()
                    .Matches(@"^[A-Za-z]{1,15}$").WithMessage("First Name is in wrong format.");
                RuleFor(x => x.RegisterUser.LastName)
                    .NotEmpty()
                    .Matches(@"^[A-Za-z]{1,15}$").WithMessage("Last Name is in wrong format.");
                RuleFor(x => x.RegisterUser.Email)
                    .NotEmpty()
                    .Matches(@"^\S+@\S+\.\S+$").WithMessage("Email is in wrong format.");
                RuleFor(x => x.RegisterUser.Password)
                    .NotEmpty()
                    .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").WithMessage("Password doesn't meet the requirments.");
                RuleFor(x => x.RegisterUser.ConfirmPassword)
                    .NotEmpty().WithMessage("Confirmation password is required.")
                    .Must((command, confirmPassword) => confirmPassword == command.RegisterUser.Password)
                    .WithMessage("Password and Confirmation Password do not match.");
            }
        }

        public class Handler : BaseHandler<RegisterUserCommand, RegisterUserDto>
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

            public override async Task<RegisterUserDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
            {
                // Checking if User exist in database.
                var userExist = await _identityService.FindByEmailAsync(request.RegisterUser.Email);
                if (userExist != null)
                {
                    throw new ValidationException("User already exists!");
                }

                // Setting new User into an User object.
                User user = new()
                {
                    Id = Guid.NewGuid(),
                    FirstName = request.RegisterUser.FirstName,
                    LastName = request.RegisterUser.LastName,
                    Email = request.RegisterUser.Email,
                    UserName = request.RegisterUser.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                // Creating new User.
                if (!await _identityService.CreateAsync(user, request.RegisterUser.Password))
                {
                    throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                }

                // Self-registration always creates a plain user; Admin is granted only through UpdateUserRoles.
                await _identityService.AddToRoleAsync(user, UserRoleType.User);

                // Adding Token to Verify email.
                var token = await _identityService.GenerateEmailConfirmationTokenAsync(user);

                var angularAppLink = _clientSettings.Url;

                var confirmationLink = $"{angularAppLink}/api/auth/confirmEmail?token={WebUtility.UrlEncode(token)}&email={WebUtility.UrlEncode(user.Email)}";

                var redirectLink = $"{angularAppLink}/app/email-confirmed?confirmationLink={Uri.EscapeDataString(confirmationLink)}";

                var emailMessage = new EmailMessage
                (
                    new string[] { user.Email! },
                    "Confirm Your Email",
                    $@"
                    <html>
                        <body>
                            <h2>Welcome to {Constants.APP_NAME}!</h2>
                            <p>Hello, {user.FirstName}</p>
                            <p>Thank you for registering with us.</p>
                            <p>To get started, please confirm your email address by clicking the link below:</p>
                            <p><a href='{redirectLink}' style='color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Confirm Your Email</a></p>
                            <p>Once your email is confirmed, you can sign in and start using the application.</p>
                            <p>Best regards,<br>{Constants.APP_NAME} Team</p>
                        </body>
                    </html>"
                );
                _emailService.SendEmail(emailMessage);

                return request.RegisterUser;
            }
        }
    }
}
