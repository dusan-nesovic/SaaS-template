using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Users.Commands
{
    public class UpdateUserRolesCommand : BaseCommand<List<UserInfoDto>>
    {
        private UserInfoDto UserInfo { get; set; }

        public UpdateUserRolesCommand(UserInfoDto userInfo)
        {
            UserInfo = userInfo;
        }

        public class Validator : AbstractValidator<UpdateUserRolesCommand>
        {
            public Validator()
            {
                RuleFor(x => x.UserInfo).NotNull();
            }
        }

        public class Handler : BaseHandler<UpdateUserRolesCommand, List<UserInfoDto>>
        {
            private readonly IIdentityService _identityService;

            public Handler(IIdentityService identityService)
            {
                _identityService = identityService;
            }

            public override async Task<List<UserInfoDto>> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
            {
                var user = await _identityService.FindByIdAsync(request.UserInfo.Id);

                if (user == null)
                {
                    throw new NotFoundException(nameof(User), request.UserInfo.Id);
                }

                await _identityService.SetRolesAsync(user, request.UserInfo.UserRoles);

                var result = await _identityService.GetAllAsync(cancellationToken);

                var users = new List<UserInfoDto>();

                foreach (var dbUser in result)
                {
                    var userResult = new UserInfoDto()
                    {
                        Id = dbUser.Id,
                        FirstName = dbUser.FirstName,
                        LastName = dbUser.LastName,
                        UserName = dbUser.UserName!,
                        CreatedOn = dbUser.CreatedOn,
                        UserRoles = await _identityService.GetRolesAsync(dbUser),
                    };

                    users.Add(userResult);
                }

                return users;
            }
        }
    }
}
