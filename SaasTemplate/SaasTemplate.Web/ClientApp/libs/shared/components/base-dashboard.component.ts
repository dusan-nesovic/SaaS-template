// Angular modules
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// Third-party modules
import { BehaviorSubject, takeUntil } from 'rxjs';

// Project modules
import { UserRoleType } from '@Workspace/_generated/enums';
import { IUserProfileDto } from '@Workspace/_generated/interfaces';
import { Unsubscribe } from '@Workspace/common';
import { AuthService, LoadingSpinnerService } from '@Workspace/services';

export class BaseDashboardComponent extends Unsubscribe {
  protected user: IUserProfileDto;

  protected routeId = new BehaviorSubject<string | null>(null);
  private id: string | null;

  constructor(
    protected authService: AuthService,
    protected loadingSpinnerService: LoadingSpinnerService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super();
    this.authentication();
    this.entityIdSubscription();
  }

  // Getters

  protected get userIdStringified(): string | null {
    return this.user.id ? JSON.stringify(this.user.id) : null;
  }

  protected get entityId(): string | null {
    return this.id;
  }

  protected get entityIdStringified(): string | null {
    return this.id ? JSON.stringify(this.id) : null;
  }

  protected get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  protected get hasAdminPermission(): boolean {
    return this.authService.hasPermissions(UserRoleType.Admin);
  }

  // Private methods

  private authentication() {
    this.authService.autoLogin();
    this.authService.user.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.loadingSpinnerService.takeLoadingSpinner();
    });
  }

  private entityIdSubscription() {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params: ParamMap) => {
      const newId = params.get('id');
      this.routeId.next(newId);
    });

    this.routeId.pipe(takeUntil(this.unsubscribe$)).subscribe((id: string | null) => {
      this.id = id;
    });
  }
}
