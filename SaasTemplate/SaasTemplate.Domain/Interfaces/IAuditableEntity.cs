namespace SaasTemplate.Domain.Interfaces
{
    // Filled in on save by AuditInterceptor (Infrastructure); handlers never set these.
    public interface IAuditableEntity
    {
        DateTime CreatedOn { get; set; }
        Guid CreatedBy { get; set; }
        DateTime? ModifiedOn { get; set; }
        Guid? ModifiedBy { get; set; }
    }
}
