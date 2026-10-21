using SaasTemplate.Application.BusinessLogic.Preferences.Commands;
using SaasTemplate.Application.BusinessLogic.Preferences.Queries;
using SaasTemplate.Application.Dtos.Preferences;
using SaasTemplate.Web.Controllers.Base;
using SaasTemplate.Web.ReinforcedTypings.Generator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SaasTemplate.Web.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    [Authorize]
    public class PreferenceController : BaseController
    {
        [HttpGet]
        [Method(typeof(UserPreferenceDto))]
        public async Task<IActionResult> GetPreference()
        {
            return Ok(await Mediator.Send(new GetPreferenceQuery()));
        }

        [HttpPost]
        [Method(typeof(UserPreferenceDto))]
        public async Task<IActionResult> UpdatePreference([FromBody] UserPreferenceDto preference)
        {
            return Ok(await Mediator.Send(new UpdatePreferenceCommand(preference)));
        }
    }
}
