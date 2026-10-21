using Microsoft.EntityFrameworkCore;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Preferences;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Enumerators;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;

namespace SaasTemplate.Application.BusinessLogic.Preferences.Queries
{
    public class GetPreferenceQuery : BaseQuery<UserPreferenceDto>
    {
        public class Handler : BaseHandler<GetPreferenceQuery, UserPreferenceDto>
        {
            private readonly ICurrentUser _currentUser;

            public Handler(IApplicationDbContext dbContext, ICurrentUser currentUser) : base(dbContext)
            {
                _currentUser = currentUser;
            }

            public override async Task<UserPreferenceDto> Handle(GetPreferenceQuery request, CancellationToken cancellationToken)
            {
                var userId = _currentUser.UserId;

                var preference = await _dbContext.Users
                    .Where(x => x.Id == userId)
                    .Select(x => new UserPreferenceDto
                    {
                        Theme = (ThemeType)x.Theme,
                        Language = x.Language,
                    })
                    .SingleOrDefaultAsync(cancellationToken);

                if (preference == null)
                {
                    throw new NotFoundException(nameof(User), userId);
                }

                return preference;
            }
        }
    }
}
