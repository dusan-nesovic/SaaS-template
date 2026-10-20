using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SaasTemplate.Infrastructure.Persistence.Contexts
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        private const string EnvFileName = ".env.development";
        private const string ConnectionStringVariable = "SAASTEMPLATE_DB";
        private const string DefaultPort = "5432";

        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var connectionString =
                Environment.GetEnvironmentVariable(ConnectionStringVariable)
                ?? BuildConnectionStringFromEnvFile()
                ?? throw new InvalidOperationException(
                    $"Connection string not found. Either set the {ConnectionStringVariable} environment variable, " +
                    $"or place {EnvFileName} in the repository root with POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB.");

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            return new ApplicationDbContext(options);
        }

        private static string? BuildConnectionStringFromEnvFile()
        {
            var envFile = FindEnvFile();
            if (envFile is null) return null;

            var values = ReadEnvFile(envFile);

            if (!values.TryGetValue("POSTGRES_USER", out var user)
                || !values.TryGetValue("POSTGRES_PASSWORD", out var password)
                || !values.TryGetValue("POSTGRES_DB", out var database))
            {
                return null;
            }

            var port = values.TryGetValue("DB_PORT", out var configuredPort) ? configuredPort : DefaultPort;

            // Migrations run on the host, so the database is reached through the published port on
            // localhost, not through the compose service name "db".
            return $"Host=localhost;Port={port};Database={database};Username={user};Password={password};";
        }

        private static string? FindEnvFile()
        {
            var directory = new DirectoryInfo(AppContext.BaseDirectory);
            while (directory is not null)
            {
                var candidate = Path.Combine(directory.FullName, EnvFileName);
                if (File.Exists(candidate)) return candidate;

                directory = directory.Parent;
            }

            return null;
        }

        private static Dictionary<string, string> ReadEnvFile(string path)
        {
            var values = new Dictionary<string, string>(StringComparer.Ordinal);

            foreach (var line in File.ReadAllLines(path))
            {
                var trimmed = line.Trim();
                if (trimmed.Length == 0 || trimmed.StartsWith('#')) continue;

                var separator = trimmed.IndexOf('=');
                if (separator <= 0) continue;

                var key = trimmed[..separator].Trim();
                var value = trimmed[(separator + 1)..].Trim();
                if (value.Length > 0) values[key] = value;
            }

            return values;
        }
    }
}
