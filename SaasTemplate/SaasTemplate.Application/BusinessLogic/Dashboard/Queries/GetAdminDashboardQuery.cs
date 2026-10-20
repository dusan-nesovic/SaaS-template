using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Dashboard;
using SaasTemplate.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SaasTemplate.Application.BusinessLogic.Dashboard.Queries
{
    public class GetAdminDashboardQuery : BaseQuery<AdminDashboardDto>
    {
        public class Handler : BaseHandler<GetAdminDashboardQuery, AdminDashboardDto>
        {
            private const int TimeSeriesDays = 30;
            private const int RecentUsersLimit = 10;

            private readonly IErrorLogService _errorLogService;

            public Handler(IApplicationDbContext dbContext, IErrorLogService errorLogService) : base(dbContext)
            {
                _errorLogService = errorLogService;
            }

            public override async Task<AdminDashboardDto> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
            {
                var now = DateTime.UtcNow;
                var since30 = now.AddDays(-TimeSeriesDays);

                var users = await _dbContext.Users
                    .Select(u => new { u.Id, u.CreatedOn, u.Email, u.FirstName, u.LastName, u.EmailConfirmed })
                    .ToListAsync(cancellationToken);

                var kpi = new AdminKpiDto
                {
                    TotalUsers = users.Count,
                    NewUsers30Days = users.Count(u => u.CreatedOn >= since30),
                    ConfirmedUsers = users.Count(u => u.EmailConfirmed),
                    UnconfirmedUsers = users.Count(u => !u.EmailConfirmed),
                };

                var registrationsByDay = BuildDailySeries(users.Select(u => u.CreatedOn), since30, TimeSeriesDays);

                var recentUsers = users
                    .OrderByDescending(u => u.CreatedOn)
                    .Take(RecentUsersLimit)
                    .Select(u => new RecentUserDto
                    {
                        UserId = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        EmailConfirmed = u.EmailConfirmed,
                        CreatedOn = u.CreatedOn,
                    })
                    .ToList();

                var errorTimes = _errorLogService.GetSince(since30)
                    .Select(e => e.Time!.Value.UtcDateTime)
                    .ToList();

                var errors = new AdminErrorsDto
                {
                    ErrorsLast30Days = errorTimes.Count,
                    ErrorsLast7Days = errorTimes.Count(t => t >= now.AddDays(-7)),
                };

                var dto = new AdminDashboardDto
                {
                    Kpi = kpi,
                    RegistrationsByDay = registrationsByDay,
                    RecentUsers = recentUsers,
                    Errors = errors,
                };

                return dto;
            }

            private static List<DailyCountDto> BuildDailySeries(IEnumerable<DateTime> timestamps, DateTime since, int days)
            {
                var startDate = since.Date;
                var buckets = Enumerable.Range(0, days)
                    .ToDictionary(i => startDate.AddDays(i), _ => 0);

                foreach (var t in timestamps)
                {
                    var day = t.Date;
                    if (buckets.ContainsKey(day))
                    {
                        buckets[day]++;
                    }
                }

                return buckets
                    .OrderBy(kv => kv.Key)
                    .Select(kv => new DailyCountDto { Date = kv.Key, Count = kv.Value })
                    .ToList();
            }
        }
    }
}
