using FluentValidation;
using SaasTemplate.Application.Extensions;
using MediatR;

namespace SaasTemplate.Application.BusinessLogic._Base
{
    // Runs the nested Validator of a command or query before its handler. A request without a
    // validator goes straight through.
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            foreach (var validator in _validators)
            {
                var result = await validator.ValidateAsync(request, cancellationToken);
                result.ThrowIfInvalid();
            }

            return await next();
        }
    }
}
