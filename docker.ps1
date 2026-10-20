#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Runs docker compose against one environment.

.DESCRIPTION
    Layers docker-compose.<environment>.yml over docker-compose.yml, points compose at
    .env.<environment>, and isolates each environment under its own compose project so
    dev and prod never share containers or volumes.

.EXAMPLE
    ./docker.ps1 dev up --build
.EXAMPLE
    ./docker.ps1 dev down
.EXAMPLE
    ./docker.ps1 prod up --build -d
.EXAMPLE
    ./docker.ps1 dev logs -f api
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('dev', 'prod')]
    [string] $Environment,

    [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
    [string[]] $ComposeArgs
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$environmentNames = @{ dev = 'development'; prod = 'production' }
$projectNames     = @{ dev = 'saas-template'; prod = 'saas-template-production' }
$name = $environmentNames[$Environment]

$envFile     = ".env.$name"
$overrideFile = "docker-compose.$name.yml"
$projectName  = $projectNames[$Environment]

if (-not $ComposeArgs -or $ComposeArgs.Count -eq 0) {
    Write-Host "Usage: ./docker.ps1 <dev|prod> <docker compose command>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ./docker.ps1 dev up --build       start development"
    Write-Host "  ./docker.ps1 dev down             stop development"
    Write-Host "  ./docker.ps1 dev logs -f api      follow api logs"
    Write-Host "  ./docker.ps1 prod up --build -d   start production detached"
    exit 1
}

if (-not (Test-Path $envFile)) {
    Write-Host "Missing $envFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Create it with these keys (no env file is tracked in git):" -ForegroundColor Yellow
    @(
        'ASPNETCORE_ENVIRONMENT   Development or Production',
        'LOG_LEVEL                Debug | Information | Warning | Error',
        'POSTGRES_USER            database user',
        'POSTGRES_PASSWORD        database password',
        'POSTGRES_DB              database name',
        'JWT_SECRET               signing key, different per environment',
        'GOOGLE_CLIENT_SECRET     Google OAuth client secret',
        'EMAIL_PASSWORD           SMTP password',
        'JWT_VALID_ISSUER         api origin, e.g. http://localhost:8080',
        'JWT_VALID_AUDIENCE       client origin, e.g. http://localhost:4200',
        'CORS_ALLOWED_ORIGIN      client origin, e.g. http://localhost:4200',
        'NPM_BUILD_SCRIPT         build:dev or build:prod',
        'DB_PORT / API_PORT / WEB_PORT   host ports (optional, have defaults)'
    ) | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "Generate a signing key:  docker run --rm alpine sh -c ""head -c 32 /dev/urandom | base64""" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $overrideFile)) {
    Write-Host "Missing $overrideFile" -ForegroundColor Red
    exit 1
}

Write-Host "environment : $name" -ForegroundColor Cyan
Write-Host "env file    : $envFile" -ForegroundColor Cyan
Write-Host "compose     : docker-compose.yml + $overrideFile" -ForegroundColor Cyan
Write-Host "project     : $projectName" -ForegroundColor Cyan
Write-Host ""

& docker compose `
    --project-name $projectName `
    --env-file $envFile `
    -f docker-compose.yml `
    -f $overrideFile `
    @ComposeArgs

exit $LASTEXITCODE
