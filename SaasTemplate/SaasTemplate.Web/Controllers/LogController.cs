using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaasTemplate.Application.BusinessLogic.ErrorLogs.Queries;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Web.ReinforcedTypings.Generator;

namespace SaasTemplate.Web.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class LogController : BaseController
    {
        [HttpGet]
        [Method(typeof(List<ErrorLogDto>))]
        public async Task<IActionResult> GetAllErrors()
        {
            return Ok(await Mediator.Send(new GetAllErrorsQuery() { }));
        }
    }
}
