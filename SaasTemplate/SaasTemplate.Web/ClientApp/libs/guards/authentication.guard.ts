// Angular modules
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

// Third-party modules
import { Observable } from 'rxjs';

// Project modules
import { Constants } from '@Workspace/common';
import { AuthService } from '@Workspace/services';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Public methods

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree([Constants.LOGIN_PATH] );
  }
}
