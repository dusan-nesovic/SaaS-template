using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;

namespace SaasTemplate.Application.BusinessLogic.ErrorLogs.Queries
{
    // Admin only: the unhandled exceptions logged this month, newest first.
    public class GetAllErrorsQuery : BaseQuery<List<ErrorLogDto>>
    {
        public class Handler : BaseHandler<GetAllErrorsQuery, List<ErrorLogDto>>
        {
            private readonly IErrorLogService _errorLogService;

            public Handler(IErrorLogService errorLogService)
            {
                _errorLogService = errorLogService;
            }

            public override Task<List<ErrorLogDto>> Handle(GetAllErrorsQuery request, CancellationToken cancellationToken)
            {
                var now = DateTime.UtcNow;
                var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

                return Task.FromResult(_errorLogService.GetSince(startOfMonth));
            }
        }
    }
}
