using SaasTemplate.Application.Dtos;

namespace SaasTemplate.Application.Interfaces
{
    // The log of unhandled exceptions that ExceptionMiddleware writes and the admin pages read back.
    public interface IErrorLogService
    {
        void Log(ErrorLogDto error);

        // Entries logged at or after the given UTC time, newest first.
        List<ErrorLogDto> GetSince(DateTime since);
    }
}
