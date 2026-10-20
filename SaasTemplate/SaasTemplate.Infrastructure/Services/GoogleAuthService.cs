using System.Text.Json;
using Google.Apis.Auth;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Common.Interfaces.Settings;
using SaasTemplate.Common.Models;

namespace SaasTemplate.Infrastructure.Services
{
    // With the authorization-code flow the browser never holds an ID token: Google hands the client a
    // one-time code, and only this exchange - which needs the client secret, so it has to happen on the
    // server - turns that code into the ID token the sign-in is built on.
    public class GoogleAuthService : IGoogleAuthService
    {
        private const string TokenEndpoint = "https://oauth2.googleapis.com/token";

        // Google requires this exact literal for codes issued through their JavaScript popup flow;
        // there is no real redirect to name.
        private const string PopupRedirectUri = "postmessage";

        private readonly IGoogleAuthSettings _googleAuthSettings;
        private readonly IHttpClientFactory _httpClientFactory;

        public GoogleAuthService(IGoogleAuthSettings googleAuthSettings, IHttpClientFactory httpClientFactory)
        {
            _googleAuthSettings = googleAuthSettings;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> ExchangeCodeForIdTokenAsync(string code, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_googleAuthSettings.ClientId) || string.IsNullOrWhiteSpace(_googleAuthSettings.ClientSecret))
            {
                throw new InvalidRequestException("Google sign-in is not configured. Set GoogleAuthSettings:ClientId and GoogleAuthSettings:ClientSecret.");
            }

            var request = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = _googleAuthSettings.ClientId,
                ["client_secret"] = _googleAuthSettings.ClientSecret,
                ["redirect_uri"] = PopupRedirectUri,
                ["grant_type"] = "authorization_code"
            });

            var httpClient = _httpClientFactory.CreateClient();

            using var response = await httpClient.PostAsync(TokenEndpoint, request, cancellationToken);
            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                // The body carries Google's own error code; it is echoed because it is the only way to
                // tell a stale code from a misconfigured client, and it holds no secret of ours.
                throw new InvalidRequestException($"Google rejected the authorization code ({(int)response.StatusCode}): {content}");
            }

            using var document = JsonDocument.Parse(content);

            if (!document.RootElement.TryGetProperty("id_token", out var idToken) || string.IsNullOrWhiteSpace(idToken.GetString()))
            {
                throw new InvalidRequestException("Google did not return an id_token. Make sure the 'openid' scope is requested.");
            }

            return idToken.GetString()!;
        }

        public async Task<GoogleUser> ValidateIdTokenAsync(string idToken, CancellationToken cancellationToken = default)
        {
            // Without the audience check Google accepts an ID token issued to any app, so a site the user
            // signed into elsewhere could replay that token here and sign in as them.
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _googleAuthSettings.ClientId }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            }
            catch (InvalidJwtException)
            {
                throw new UnauthorizedException("Google sign-in failed. Please try again.");
            }

            return new GoogleUser
            {
                Subject = payload.Subject,
                Email = payload.Email,
                GivenName = payload.GivenName,
                FamilyName = payload.FamilyName,
                Picture = payload.Picture,
            };
        }
    }
}
