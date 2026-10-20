namespace SaasTemplate.Common.Exceptions
{
    public abstract class BaseApplicationException : Exception
    {
        protected BaseApplicationException(string message)
            : base(message) 
        {
        }
    }
}
