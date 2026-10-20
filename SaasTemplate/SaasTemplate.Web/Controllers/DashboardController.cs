using SaasTemplate.Application.BusinessLogic.Dashboard.Queries;
using SaasTemplate.Application.Dtos.Dashboard;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Web.ReinforcedTypings.Generator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SaasTemplate.Web.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    [Authorize]
    public class DashboardController : BaseController
    {
        [HttpGet]
        [Method(typeof(UserDashboardDto))]
        public async Task<IActionResult> GetUserDashboard()
        {
            return Ok(await Mediator.Send(new GetUserDashboardQuery()));
        }

        [HttpGet]
        [Method(typeof(AdminDashboardDto))]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            return Ok(await Mediator.Send(new GetAdminDashboardQuery()));
        }
    }
}
