namespace SaasTemplate.Common.Exceptions
{
    public class ValidationException : BaseApplicationException
    {
        public Dictionary<string, List<string>> Failures { get; }

        public ValidationException()
            :base("One or more validation failures have occured.")
        {
            Failures = new Dictionary<string, List<string>>();
        }

        public ValidationException(string errorMessage) 
            : base(errorMessage)
        {
            Failures = new Dictionary<string, List<string>>();
        }

        public ValidationException(Dictionary<string, List<string>> failures)
            :this()
        {
            Failures = failures;
        }
    }
}
