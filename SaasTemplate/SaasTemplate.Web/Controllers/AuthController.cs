using Microsoft.AspNetCore.Mvc;
using SaasTemplate.Application.BusinessLogic.Auth.Commands;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Web.ReinforcedTypings.Generator;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Dtos.Auth;

namespace SaasTemplate.Web.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class AuthController : BaseController
    {
        [HttpPost]
        [Method(typeof(RegisterUserDto))]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUser)
        {
            return Ok(await Mediator.Send(new RegisterUserCommand(registerUser)));
        }

        [HttpGet]
        [Method(typeof(void))]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            await Mediator.Send(new ConfirmEmailCommand(token, email));
            return Ok();
        }

        [HttpGet]
        [Method(typeof(void))]
        public async Task<IActionResult> ResetPassword(string email)
        {
            await Mediator.Send(new ResetPasswordCommand(email));
            return Ok();
        }

        [HttpPost]
        [Method(typeof(void))]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePassword)
        {
            await Mediator.Send(new ChangePasswordCommand(changePassword));
            return Ok();
        }

        [HttpPost]
        [Method(typeof(UserProfileDto))]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUser)
        {
            return Ok(await Mediator.Send(new LoginUserCommand(loginUser)));
        }

        [HttpPost]
        [Method(typeof(UserProfileDto))]
        public async Task<IActionResult> GoogleLogin([FromBody] string token)
        {
            return Ok(await Mediator.Send(new LoginUserGoogleCommand(token)));
        }

        [HttpPost]
        [Method(typeof(UserProfileDto))]
        public async Task<IActionResult> GoogleCodeLogin([FromBody] string code)
        {
            return Ok(await Mediator.Send(new LoginUserGoogleCodeCommand(code)));
        }
    }
}
