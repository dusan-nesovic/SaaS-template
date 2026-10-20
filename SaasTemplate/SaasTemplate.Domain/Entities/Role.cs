using SaasTemplate.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace SaasTemplate.Domain.Entities
{
    public class Role : IdentityRole<Guid>, IAuditableEntity
    {
        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
    }
}
