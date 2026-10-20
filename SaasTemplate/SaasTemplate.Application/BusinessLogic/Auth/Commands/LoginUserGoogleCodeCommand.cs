using MediatR;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    // Sign-in from the site's own Google button. The button cannot obtain an ID token itself - Google
    // only gives one to their rendered button - so it asks for an authorization code instead and this
    // command trades it in on the server.
    public partial class LoginUserGoogleCodeCommand : BaseCommand<UserProfileDto>
    {
        private string Code { get; set; }

        public LoginUserGoogleCodeCommand(string code)
        {
            Code = code;
        }

        public class Validator : AbstractValidator<LoginUserGoogleCodeCommand>
        {
            public Validator()
            {
                RuleFor(x => x.Code).NotEmpty();
            }
        }

        public class Handler : BaseHandler<LoginUserGoogleCodeCommand, UserProfileDto>
        {
            private readonly IGoogleAuthService _googleAuthService;
            private readonly IMediator _mediator;

            public Handler(IGoogleAuthService googleAuthService, IMediator mediator)
            {
                _googleAuthService = googleAuthService;
                _mediator = mediator;
            }

            public override async Task<UserProfileDto> Handle(LoginUserGoogleCodeCommand request, CancellationToken cancellationToken)
            {
                var idToken = await _googleAuthService.ExchangeCodeForIdTokenAsync(request.Code, cancellationToken);

                // From here the sign-in is identical to the token flow - the user lookup, the account
                // linking and the JWT all stay in one place.
                return await _mediator.Send(new LoginUserGoogleCommand(idToken), cancellationToken);
            }
        }
    }
}
