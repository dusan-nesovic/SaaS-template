using MediatR;
using SaasTemplate.Application.Interfaces;

namespace SaasTemplate.Application.BusinessLogic._Base
{
    public abstract class BaseHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        protected IApplicationDbContext _dbContext;

        public BaseHandler() { }

        public BaseHandler(IApplicationDbContext dbContext)
            : this()
        {
            _dbContext = dbContext;
        }

        public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
    }
}
