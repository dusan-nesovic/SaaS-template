using SaasTemplate.Common.Enumerators;
using SaasTemplate.Domain.Entities;

namespace SaasTemplate.Application.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public List<UserRoleType> UserRoles { get; set; } = new List<UserRoleType>();
    }

    public class UserInfoDto : UserDto
    {
        public DateTime CreatedOn { get; set; }
    }

    public class UserProfileDto : UserDto
    {
        public UserProfileDto(User user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            UserName = user.UserName!;
        }

        public string? Picture { get; set; }
        public string Token { get; set; }
        public bool RequiresExternalLogin { get; set; } = false;
        public DateTime ExpiresIn { get; set; }
    }
}
