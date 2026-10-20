namespace SaasTemplate.Common.Exceptions
{
    public class NotFoundException : BaseApplicationException
    {
        public NotFoundException(string entityName, object key)
            : base($"{entityName} '{key}' is not found.")
        {
        }
    }
}
