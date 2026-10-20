namespace SaasTemplate.Application.Dtos.Dashboard
{
    // Starting point for the signed-in user's home screen; extend it with the app's own statistics.
    public class UserDashboardDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime MemberSince { get; set; }
        public int DaysSinceRegistration { get; set; }
    }
}
