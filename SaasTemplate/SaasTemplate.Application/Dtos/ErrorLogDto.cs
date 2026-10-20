using System.Net;

namespace SaasTemplate.Application.Dtos
{
    public class ErrorLogDto
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public DateTimeOffset? Time {  get; set; }
        public string? Email { get; set; }
        public string StackTrace { get; set; }
        public string Source { get; set; }
        public string[]? InnerException { get; set; }
        public IDictionary<string, List<string>> Errors { get; set; }

        public ErrorLogDto() { }

        public ErrorLogDto(Exception ex)
        {
            StatusCode = (int)HttpStatusCode.InternalServerError;
            Message = ex.Message;
            Time = DateTimeOffset.UtcNow;
            StackTrace = ex.StackTrace!;
            Source = ex.Source!;
            InnerException = GetExceptionMessages(ex);
            Errors = new Dictionary<string, List<string>>();
        }

        private static string[] GetExceptionMessages(Exception ex)
        {
            List<string> exceptionMessages = new List<string>();

            // Add the message of the current exception
            exceptionMessages.Add(ex.Message);

            // Check if the current exception has inner exceptions
            if (ex.InnerException != null)
            {
                // Recursively collect messages from inner exceptions
                exceptionMessages.AddRange(GetExceptionMessages(ex.InnerException));
            }

            return exceptionMessages.ToArray();
        }
    }
}
