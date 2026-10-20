using System.ComponentModel.DataAnnotations;

namespace SaasTemplate.Application.Dtos.Auth
{
    public class LoginUserDto
    {
        public string Email { get; set; }

        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
