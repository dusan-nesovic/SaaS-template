namespace SaasTemplate.Application.Interfaces
{
    public interface ICurrentUser
    {
        // Id of the signed-in user, taken from the token. Throws UnauthorizedException when there is none.
        Guid UserId { get; }

        // False for anonymous requests (public pages, registration).
        bool IsAuthenticated { get; }
    }
}
