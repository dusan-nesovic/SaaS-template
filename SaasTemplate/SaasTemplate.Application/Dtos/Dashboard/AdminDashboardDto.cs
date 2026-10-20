namespace SaasTemplate.Application.Dtos.Dashboard
{
    public class AdminDashboardDto
    {
        public AdminKpiDto Kpi { get; set; } = new();
        public List<DailyCountDto> RegistrationsByDay { get; set; } = new();
        public List<RecentUserDto> RecentUsers { get; set; } = new();
        public AdminErrorsDto Errors { get; set; } = new();
    }

    public class AdminKpiDto
    {
        public int TotalUsers { get; set; }
        public int NewUsers30Days { get; set; }
        public int ConfirmedUsers { get; set; }
        public int UnconfirmedUsers { get; set; }
    }

    public class DailyCountDto
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }

    public class RecentUserDto
    {
        public Guid UserId { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class AdminErrorsDto
    {
        public int ErrorsLast7Days { get; set; }
        public int ErrorsLast30Days { get; set; }
    }
}
