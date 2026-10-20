using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Dtos.Auth;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Domain.Entities;
using SaasTemplate.Common.Constants;
using FluentValidation;
using ValidationException = SaasTemplate.Common.Exceptions.ValidationException;

namespace SaasTemplate.Application.BusinessLogic.Auth.Commands
{
    public partial class LoginUserCommand : BaseCommand<UserProfileDto>
    {
        private LoginUserDto LoginUser { get; set; }

        public LoginUserCommand(LoginUserDto loginUser)
        {
            LoginUser = loginUser;
        }

        public class Validator : AbstractValidator<LoginUserCommand>
        {
            public Validator()
            {
                RuleFor(x => x.LoginUser.Email)
                    .NotEmpty()
                    .Matches(@"^\S+@\S+\.\S+$").WithMessage("Email is in wrong format.");
                RuleFor(x => x.LoginUser.Password)
                    .NotEmpty()
                    .Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").WithMessage("Password doesn't meet the requirments.");
            }
        }

        public class Handler : BaseHandler<LoginUserCommand, UserProfileDto>
        {
            private readonly IIdentityService _identityService;
            private readonly ITokenService _tokenService;

            public Handler(IIdentityService identityService, ITokenService tokenService)
            {
                _identityService = identityService;
                _tokenService = tokenService;
            }

            public override async Task<UserProfileDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
            {
                // Getting User from database.
                var user = await _identityService.FindByEmailAsync(request.LoginUser.Email);

                if (user != null)
                {
                    // Checking Password of User.
                    if (await _identityService.CheckPasswordAsync(user, request.LoginUser.Password))
                    {
                        // Checking if Email is confirmed
                        if (user.EmailConfirmed == true)
                        {
                            var currentUser = new UserProfileDto(user);
                            currentUser.UserRoles = await _identityService.GetRolesAsync(user);

                            var token = _tokenService.CreateToken(user, currentUser.UserRoles);

                            currentUser.Token = token.Value;
                            currentUser.ExpiresIn = token.ExpiresAt;

                            return currentUser;
                        }
                        throw new ValidationException("Email Not Confirmed!");
                    }
                    else
                    {
                        if (await _identityService.HasExternalLoginAsync(user))
                        {
                            var userExternal = new UserProfileDto(user);
                            userExternal.RequiresExternalLogin = true;

                            return userExternal;
                        }
                        else
                        {
                            throw new InvalidRequestException(Constants.ERROR_OCCURRED);
                        }
                    }
                }
                throw new NotFoundException(nameof(User), request.LoginUser.Email);
            }
        }
    }
}
