using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;

namespace SaasTemplate.Application.BusinessLogic.Users.Queries
{
    public class GetAdminUsersQuery : BaseQuery<List<UserInfoDto>>
    {
        public class Handler : BaseHandler<GetAdminUsersQuery, List<UserInfoDto>>
        {
            private readonly IIdentityService _identityService;

            public Handler(IIdentityService identityService)
            {
                _identityService = identityService;
            }

            public override async Task<List<UserInfoDto>> Handle(GetAdminUsersQuery request, CancellationToken cancellationToken)
            {
                var result = await _identityService.GetAllAsync(cancellationToken);

                var users = new List<UserInfoDto>();

                foreach (var dbUser in result)
                {
                    var user = new UserInfoDto()
                    {
                        Id = dbUser.Id,
                        FirstName = dbUser.FirstName,
                        LastName = dbUser.LastName,
                        UserName = dbUser.UserName!,
                        CreatedOn = dbUser.CreatedOn,
                        UserRoles = await _identityService.GetRolesAsync(dbUser),
                    };

                    users.Add(user);
                }

                var orderedListOfUsers = users.OrderBy(c => c.CreatedOn).ToList();

                return orderedListOfUsers;
            }
        }
    }
}