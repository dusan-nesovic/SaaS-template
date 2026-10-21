using SaasTemplate.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace SaasTemplate.Domain.Entities
{
    public class User : IdentityUser<Guid>, IAuditableEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        // ThemeType stored as int; 0 (System) until the user picks one.
        public int Theme { get; set; }
        // Language code of the app (en, sr, ...); null until the user picks one.
        public string? Language { get; set; }

        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
    }
}
