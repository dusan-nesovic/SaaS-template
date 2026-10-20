using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Users.Queries
{
    public class GetAdminUserByIdQuery : BaseQuery<UserInfoDto>
    {
        private Guid Id { get; set; }

        public GetAdminUserByIdQuery(Guid id)
        {
            Id = id;
        }

        public class Validator : AbstractValidator<GetAdminUserByIdQuery>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : BaseHandler<GetAdminUserByIdQuery, UserInfoDto>
        {
            private readonly IIdentityService _identityService;

            public Handler(IIdentityService identityService)
            {
                _identityService = identityService;
            }

            public override async Task<UserInfoDto> Handle(GetAdminUserByIdQuery request, CancellationToken cancellationToken)
            {
                var dbUser = await _identityService.FindByIdAsync(request.Id);

                if (dbUser != null)
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

                    return user;
                }

                throw new NotFoundException(nameof(User), request.Id);
            }
        }
    }
}
