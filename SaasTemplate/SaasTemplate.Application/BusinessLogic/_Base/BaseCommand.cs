using MediatR;

namespace SaasTemplate.Application.BusinessLogic._Base
{
    public abstract class BaseCommand<TResponse> : IRequest<TResponse>
    {
        public BaseCommand() { }
    }

    public abstract class BaseCommand : IRequest
    {
        public BaseCommand() { }
    }
}
