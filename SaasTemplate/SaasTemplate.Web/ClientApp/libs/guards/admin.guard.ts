// Angular modules
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

// Third-party modules
import { Observable } from 'rxjs';

// Project modules
import { UserRoleType } from '@Workspace/_generated/enums';
import { AuthService } from '@Workspace/services';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Public methods
  public canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.hasPermissions(UserRoleType.Admin)) {
      return true;
    }
    return this.router.createUrlTree(['/app/dashboard']);
  }
}
