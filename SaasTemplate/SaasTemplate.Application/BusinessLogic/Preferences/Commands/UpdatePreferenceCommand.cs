using Microsoft.EntityFrameworkCore;
using SaasTemplate.Application.BusinessLogic._Base;
using SaasTemplate.Application.Dtos.Preferences;
using SaasTemplate.Application.Interfaces;
using SaasTemplate.Common.Constants;
using SaasTemplate.Common.Exceptions;
using SaasTemplate.Domain.Entities;
using FluentValidation;

namespace SaasTemplate.Application.BusinessLogic.Preferences.Commands
{
    public class UpdatePreferenceCommand : BaseCommand<UserPreferenceDto>
    {
        private UserPreferenceDto Preference { get; set; }

        public UpdatePreferenceCommand(UserPreferenceDto preference)
        {
            Preference = preference;
        }

        public class Validator : AbstractValidator<UpdatePreferenceCommand>
        {
            public Validator()
            {
                RuleFor(x => x.Preference).NotNull();
                RuleFor(x => x.Preference.Theme)
                    .IsInEnum().WithMessage("Theme is not supported.")
                    .When(x => x.Preference != null);
                RuleFor(x => x.Preference.Language)
                    .Must(language => Constants.LANGUAGES.Contains(language)).WithMessage("Language is not supported.")
                    .When(x => x.Preference?.Language != null);
            }
        }

        public class Handler : BaseHandler<UpdatePreferenceCommand, UserPreferenceDto>
        {
            private readonly ICurrentUser _currentUser;

            public Handler(IApplicationDbContext dbContext, ICurrentUser currentUser) : base(dbContext)
            {
                _currentUser = currentUser;
            }

            public override async Task<UserPreferenceDto> Handle(UpdatePreferenceCommand request, CancellationToken cancellationToken)
            {
                var userId = _currentUser.UserId;

                var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException(nameof(User), userId);
                }

                user.Theme = (int)request.Preference.Theme;
                user.Language = request.Preference.Language;

                await _dbContext.SaveChangesAsync(cancellationToken);

                return new UserPreferenceDto
                {
                    Theme = request.Preference.Theme,
                    Language = user.Language,
                };
            }
        }
    }
}
