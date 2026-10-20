using System.ComponentModel.DataAnnotations;

namespace SaasTemplate.Application.Dtos.Auth
{
    public class ChangePasswordDto
    {
        public string Token { get; set; }
        public string Email { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
