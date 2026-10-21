// Angular modules
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Third-party modules
import { BehaviorSubject } from 'rxjs';

// Project modules
import { UserRoleType } from '@Workspace/_generated/enums';
import { IUserProfileDto } from '@Workspace/_generated/interfaces';
import { Constants } from '@Workspace/common';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<IUserProfileDto>(null!);
  tokenExpirationTimer: ReturnType<typeof setTimeout> | null;

  constructor(private router: Router) {}

  // Public methods

  public getLoggedUser(): IUserProfileDto {
    return JSON.parse(localStorage.getItem('user')!);
  }

  public logout() {
    this.user.next(null!);
    this.router.navigate([Constants.LOGIN_PATH]);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  public autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  public autoLogin() {
    const userData = this.getLoggedUser();

    if (!userData) return;

    if (new Date(userData.expiresIn) > new Date()) {
      this.user.next(userData);
      const expirationDuration = new Date(userData.expiresIn).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  public isAuthenticated() {
    const userData = this.getLoggedUser();
    const isAuth = !!userData;

    return isAuth;
  }

  public hasPermissions(userRole: UserRoleType) {
    const userData = this.getLoggedUser();

    return userData != null && userData.userRoles.includes(userRole) ? true : false;
  }
}
