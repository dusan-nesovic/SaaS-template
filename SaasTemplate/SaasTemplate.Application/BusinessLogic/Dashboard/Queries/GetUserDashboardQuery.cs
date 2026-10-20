using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Dashboard;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace SaasTemplate.Application.BusinessLogic.Dashboard.Queries
{
    public class GetUserDashboardQuery : BaseQuery<UserDashboardDto>
    {
        public class Handler : BaseHandler<GetUserDashboardQuery, UserDashboardDto>
        {
            private readonly ICurrentUser _currentUser;

            public Handler(IApplicationDbContext dbContext, ICurrentUser currentUser) : base(dbContext)
            {
                _currentUser = currentUser;
            }

            public override async Task<UserDashboardDto> Handle(GetUserDashboardQuery request, CancellationToken cancellationToken)
            {
                var userId = _currentUser.UserId;

                var user = await _dbContext.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new { u.FirstName, u.LastName, u.Email, u.EmailConfirmed, u.CreatedOn })
                    .FirstOrDefaultAsync(cancellationToken)
                    ?? throw new NotFoundException(nameof(Domain.Entities.User), userId);

                var dto = new UserDashboardDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed,
                    MemberSince = user.CreatedOn,
                    DaysSinceRegistration = (int)(DateTime.UtcNow - user.CreatedOn).TotalDays,
                };

                return dto;
            }
        }
    }
}
