using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace SaasTemplate.Web.Controllers.Base
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class BaseController : Controller
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>()!);
    }
}
