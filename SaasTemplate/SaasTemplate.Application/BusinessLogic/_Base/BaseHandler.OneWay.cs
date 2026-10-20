using MediatR;
using SaasTemplate.Application.Interfaces;

namespace SaasTemplate.Application.BusinessLogic._Base
{
    public abstract class BaseHandler<TRequest> : IRequestHandler<TRequest>
        where TRequest : IRequest
    {
        protected IApplicationDbContext _dbContext;

        public BaseHandler() { }

        public BaseHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public abstract Task Handle(TRequest request, CancellationToken cancellationToken);
    }
}
