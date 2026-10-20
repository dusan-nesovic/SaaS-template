using FluentValidation;
using FluentValidation.Internal;
using FluentValidation.Results;
using MediatR;
using ValidationException = SaasTemplate.Common.Exceptions.ValidationException;

namespace SaasTemplate.Application.Extensions
{
    public static class ValidationExtensions
    {
        // The one place a FluentValidation result becomes the ValidationException that
        // ExceptionMiddleware turns into a 400 with messages grouped by property.
        public static void ThrowIfInvalid(this ValidationResult result)
        {
            if (result.IsValid)
            {
                return;
            }

            var errors = result.Errors
                .GroupBy(failure => failure.PropertyName)
                .ToDictionary(group => group.Key, group => group.Select(failure => failure.ErrorMessage).ToList());

            throw new ValidationException(errors);
        }

        // A validator nested in a command reaches the payload through the command's own property
        // (x => x.RegisterUser.Email). That wrapper is an implementation detail, so it is dropped
        // and the client keeps seeing "Email", not "RegisterUser.Email".
        public static void UseRequestPropertyNames()
        {
            ValidatorOptions.Global.PropertyNameResolver = (type, member, expression) =>
            {
                var name = expression != null ? PropertyChain.FromExpression(expression).ToString() : null;

                if (string.IsNullOrEmpty(name))
                {
                    return member?.Name;
                }

                var separator = name.IndexOf('.');

                return separator >= 0 && typeof(IBaseRequest).IsAssignableFrom(type) ? name[(separator + 1)..] : name;
            };
        }
    }
}
