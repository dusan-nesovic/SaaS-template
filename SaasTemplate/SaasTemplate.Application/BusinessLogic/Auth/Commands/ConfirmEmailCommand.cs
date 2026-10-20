using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;
using SaasTemplate.Common.Constants;
using FluentValidation;
using ValidationException = SaasTemplate.Common.Exceptions.ValidationException;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class ConfirmEmailCommand : BaseCommand
    {
        private string Token { get; set; }
        private string Email { get; set; }

        public ConfirmEmailCommand(string token, string email)
        {
            Token = token;
            Email = email;
        }

        public class Validator : AbstractValidator<ConfirmEmailCommand>
        {
            public Validator()
            {
                RuleFor(x => x.Token).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
            }
        }

        public class Handler : BaseHandler<ConfirmEmailCommand>
        {
            private readonly IIdentityService _identityService;

            public Handler(IIdentityService identityService)
            {
                _identityService = identityService;
            }

            public override async Task Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
            {
                // Getting User from database and set email to confirmed.
                var user = await _identityService.FindByEmailAsync(request.Email);
                if (user != null)
                {
                    if (!user.EmailConfirmed)
                    {
                        if (await _identityService.ConfirmEmailAsync(user, request.Token))
                            return;
                        else
                            throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                    }
                    throw new ValidationException("Email already verified!");
                }
                throw new NotFoundException(nameof(User), request.Email);
            }
        }
    }
}
