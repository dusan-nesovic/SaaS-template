# syntax=docker/dockerfile:1.7
# Multi-stage build for SaasTemplate.Web (ASP.NET Core 9).
# Build context must be the `SaasTemplate/` folder (parent of this Dockerfile).

# ---------- Stage 1: restore + build + publish .NET ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
WORKDIR /src

# Copy csproj files first for better layer caching (restore step only re-runs when project deps change)
COPY SaasTemplate.sln ./
COPY SaasTemplate.Web/SaasTemplate.Web.csproj                       SaasTemplate.Web/
COPY SaasTemplate.Application/SaasTemplate.Application.csproj       SaasTemplate.Application/
COPY SaasTemplate.Domain/SaasTemplate.Domain.csproj                 SaasTemplate.Domain/
COPY SaasTemplate.Infrastructure/SaasTemplate.Infrastructure.csproj SaasTemplate.Infrastructure/
COPY SaasTemplate.Common/SaasTemplate.Common.csproj                 SaasTemplate.Common/

RUN dotnet restore SaasTemplate.Web/SaasTemplate.Web.csproj

# Copy the rest of the sources
COPY . .

# Build and publish
RUN dotnet publish SaasTemplate.Web/SaasTemplate.Web.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false \
    /p:CI=true

# ---------- Stage 2: development image (hot reload) ----------
# No sources are copied - docker-compose.development.yml bind mounts them over /src so that
# dotnet watch sees host edits, and Reinforced.Typings writes libs/_generated back to the host.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /src

# procps gives the container `ps`, which Visual Studio's Attach to Process picker runs to list
# processes; unzip is what it uses to unpack the debugger it pushes in.
RUN apt-get update \
    && apt-get install -y --no-install-recommends procps unzip \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_USE_POLLING_FILE_WATCHER=1 \
    CI=true \
    ArtifactsPath=/artifacts \
    WATCH=1

# WATCH=0 runs without the file watcher, so the process survives edits and a debugger stays
# attached. --no-launch-profile: launchSettings.json comes in with the mount and would bind
# Kestrel to localhost inside the container, making the published port unreachable.
ENTRYPOINT ["sh", "-c", \
  "PROJECT=SaasTemplate.Web/SaasTemplate.Web.csproj; \
   if [ \"$WATCH\" = \"0\" ]; then \
     exec dotnet run --project \"$PROJECT\" --no-launch-profile; \
   else \
     exec dotnet watch --project \"$PROJECT\" --non-interactive run --no-launch-profile; \
   fi"]

# ---------- Stage 3: runtime image ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=dotnet-build /app/publish .
ENTRYPOINT ["dotnet", "SaasTemplate.Web.dll"]
