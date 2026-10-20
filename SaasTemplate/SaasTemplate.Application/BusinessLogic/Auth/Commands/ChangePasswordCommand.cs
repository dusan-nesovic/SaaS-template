using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Auth;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class ChangePasswordCommand : BaseCommand
    {
        private ChangePasswordDto ChangePassword { get; set; }

        public ChangePasswordCommand(ChangePasswordDto changePassword)
        {
            ChangePassword = changePassword;
        }

        public class Validator : AbstractValidator<ChangePasswordCommand>
        {
            public Validator()
            {
                RuleFor(x => x.ChangePassword.Password)
                    .NotEmpty()
                    .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").WithMessage("Password doesn't meet the requirments.");
                RuleFor(x => x.ChangePassword.ConfirmPassword)
                    .NotEmpty().WithMessage("Confirmation password is required.")
                    .Must((command, confirmPassword) => confirmPassword == command.ChangePassword.Password)
                    .WithMessage("Password and Confirmation Password do not match.");
            }
        }

        public class Handler : BaseHandler<ChangePasswordCommand>
        {
            private readonly IIdentityService _identityService;

            public Handler(IIdentityService identityService)
            {
                _identityService = identityService;
            }

            public override async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
            {
                // Getting User from database.
                var user = await _identityService.FindByEmailAsync(request.ChangePassword.Email);
                if (user != null)
                {
                    if (await _identityService.ResetPasswordAsync(user, request.ChangePassword.Token, request.ChangePassword.Password))
                        return;
                    else
                        throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                }
                throw new NotFoundException(nameof(User), request.ChangePassword.Email);
            }
        }
    }
}
