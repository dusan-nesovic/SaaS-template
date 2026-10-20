using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaasTemplate.Application.BusinessLogic.Users.Queries;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Web.ReinforcedTypings.Generator;
using SaasTemplate.Application.BusinessLogic.Users.Commands;

namespace SaasTemplate.Web.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class UserController : BaseController
    {
        [HttpGet]
        [Method(typeof(List<UserInfoDto>))]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await Mediator.Send(new GetAdminUsersQuery() { }));
        }

        [HttpGet]
        [Method(typeof(UserInfoDto))]
        public async Task<IActionResult> GetUserById(Guid Id)
        {
            return Ok(await Mediator.Send(new GetAdminUserByIdQuery(Id)));
        }

        [HttpPost]
        [Method(typeof(List<UserInfoDto>))]
        public async Task<IActionResult> UpdateUserRoles([FromBody] UserInfoDto userInfo)
        {
            return Ok(await Mediator.Send(new UpdateUserRolesCommand(userInfo)));
        }
    }
}
