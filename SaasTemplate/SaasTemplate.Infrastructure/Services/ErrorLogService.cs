using SaasTemplate.Application.Dtos;
using SaasTemplate.Application.Interfaces;
using Newtonsoft.Json;
using Serilog;

namespace SaasTemplate.Infrastructure.Services
{
    // One JSON document per line in a file per month (Logs/ExceptionErrors-yyyyMM.json). The folder is
    // the api_logs volume in docker-compose.yml, so the log outlives the container.
    public class ErrorLogService : IErrorLogService
    {
        private const string LogFolder = "Logs";
        private const string FilePrefix = "ExceptionErrors-";

        private readonly ILogger _logger = new LoggerConfiguration()
            .WriteTo.File(
                path: Path.Combine(LogFolder, $"{FilePrefix}.json"),
                rollingInterval: RollingInterval.Month,
                outputTemplate: "{Message}{NewLine}",
                shared: true)
            .CreateLogger();

        public void Log(ErrorLogDto error)
        {
            _logger.Error(JsonConvert.SerializeObject(error));
        }

        public List<ErrorLogDto> GetSince(DateTime since)
        {
            var entries = new List<ErrorLogDto>();

            for (var month = new DateTime(since.Year, since.Month, 1); month <= DateTime.UtcNow; month = month.AddMonths(1))
            {
                entries.AddRange(ReadFile(Path.Combine(LogFolder, $"{FilePrefix}{month:yyyyMM}.json")));
            }

            return entries
                .Where(entry => entry.Time.HasValue && entry.Time.Value.UtcDateTime >= since)
                .OrderByDescending(entry => entry.Time)
                .ToList();
        }

        private static IEnumerable<ErrorLogDto> ReadFile(string path)
        {
            if (!File.Exists(path))
            {
                yield break;
            }

            // The logger keeps the current month's file open, so it is read with shared access.
            using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(stream);

            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                ErrorLogDto? entry;
                try
                {
                    entry = JsonConvert.DeserializeObject<ErrorLogDto>(line);
                }
                catch (JsonException)
                {
                    // A line cut short by a crash must not hide the rest of the log.
                    continue;
                }

                if (entry != null)
                {
                    yield return entry;
                }
            }
        }
    }
}
