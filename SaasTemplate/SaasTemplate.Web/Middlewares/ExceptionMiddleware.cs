using System.Net;
using Newtonsoft.Json;
using System.Security.Claims;
using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;

namespace SaasTemplate.Web.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IErrorLogService _errorLogService;

        public ExceptionMiddleware(RequestDelegate next, IErrorLogService errorLogService)
        {
            _next = next;
            _errorLogService = errorLogService;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int statusCode;
            string message;
            IDictionary<string, List<string>> errors = new Dictionary<string, List<string>>();

            switch (exception)
            {
                case ValidationException validationException:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = validationException.Message;
                    errors = validationException.Failures;
                    break;
                case NotFoundException:
                    statusCode = (int)HttpStatusCode.NotFound;
                    message = exception.Message;
                    break;
                case InvalidRequestException:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = exception.Message;
                    break;
                case UnauthorizedException:
                    statusCode = (int)HttpStatusCode.Unauthorized;
                    message = exception.Message;
                    break;
                default:
                    statusCode = (int)HttpStatusCode.InternalServerError;
                    message = "Internal Server Error, please contact your administrator.";
                    LogUnhandledException(context, exception);
                    break;
            }

            var payload = new
            {
                statusCode,
                message,
                errors,
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(payload));
        }

        private void LogUnhandledException(HttpContext context, Exception exception)
        {
            var error = new ErrorLogDto(exception)
            {
                Email = context.User.FindFirst(ClaimTypes.Email)?.Value,
            };

            _errorLogService.Log(error);
        }
    }
}
