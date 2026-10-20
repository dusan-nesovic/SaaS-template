using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class LoginUserGoogleCommand : BaseCommand<UserProfileDto>
    {
        private string Token { get; set; }

        public LoginUserGoogleCommand(string token)
        {
            Token = token;
        }

        public class Validator : AbstractValidator<LoginUserGoogleCommand>
        {
            public Validator()
            {
                RuleFor(x => x.Token).NotEmpty();
            }
        }

        public class Handler : BaseHandler<LoginUserGoogleCommand, UserProfileDto>
        {
            private const string GoogleProvider = "Google";

            private readonly IIdentityService _identityService;
            private readonly IGoogleAuthService _googleAuthService;
            private readonly ITokenService _tokenService;

            public Handler(IIdentityService identityService, IGoogleAuthService googleAuthService, ITokenService tokenService)
            {
                _identityService = identityService;
                _googleAuthService = googleAuthService;
                _tokenService = tokenService;
            }

            public override async Task<UserProfileDto> Handle(LoginUserGoogleCommand request, CancellationToken cancellationToken)
            {
                // Validate token using Google's API
                var googleUser = await _googleAuthService.ValidateIdTokenAsync(request.Token, cancellationToken);

                // Check if user exists in UserLogins (AspNetUserLogins)
                var user = await _identityService.FindByExternalLoginAsync(GoogleProvider, googleUser.Subject);

                if (user == null)
                {
                    // If user is not found by Google ID, check if they exist by email
                    user = await _identityService.FindByEmailAsync(googleUser.Email);

                    if (user == null)
                    {
                        // Create a new user
                        user = new User
                        {
                            FirstName = googleUser.GivenName ?? "",
                            LastName = googleUser.FamilyName ?? "",
                            UserName = googleUser.Email,
                            Email = googleUser.Email,
                        };
                        if (!await _identityService.CreateAsync(user))
                        {
                            throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                        }

                        await _identityService.AddToRoleAsync(user, UserRoleType.User);
                    }

                    // Link Google login to this user
                    if (!await _identityService.AddExternalLoginAsync(user, GoogleProvider, googleUser.Subject))
                    {
                        throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                    }
                }

                var currentUser = new UserProfileDto(user);
                currentUser.Picture = googleUser.Picture;
                currentUser.UserRoles = await _identityService.GetRolesAsync(user);

                var token = _tokenService.CreateToken(user, currentUser.UserRoles);

                currentUser.Token = token.Value;
                currentUser.ExpiresIn = token.ExpiresAt;

                return currentUser;
            }
        }
    }
}
