using MediatR;

namespace SaasTemplate.Application.BusinessLogic._Base
{
    public abstract class BaseQuery<TResponse> : IRequest<TResponse>
    {
        public BaseQuery() { }
    }

    public abstract class BaseQuery : IRequest
    {
        public BaseQuery() { }
    }
}
