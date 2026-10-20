// Angular modules
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Project modules
import { Constants } from '@Workspace/common';
import { BaseComponent, withSpinner } from '@Workspace/shared';
import { IUserProfileDto } from '@Workspace/_generated/interfaces';
import { AuthController } from '@Workspace/_generated/services';
import { AuthService, LoadingSpinnerService, ThemeService } from '@Workspace/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isGoogleReady = false;

  // Google's own rendered button is the only thing that is handed an ID token, and it refuses to
  // work when it is hidden - so the site's button asks for an authorization code instead, which the
  // server trades for that token (AuthController.GoogleCodeLogin).
  private codeClient: any;
  private googleRetryTimer?: number;

  constructor(
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private authController: AuthController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private themeService: ThemeService
  ) {
    super(loadingSpinnerService, router, route);
  }

  // The Google client needs no DOM of ours any more, so it is set up before the first change
  // detection pass - flipping `isGoogleReady` from ngAfterViewInit would change a binding that has
  // already been checked (NG0100).
  ngOnInit(): void {
    this.initializeForm();
    this.themeService.loadTheme();
    this.initializeGoogleLogin();
  }

  override ngOnDestroy(): void {
    window.clearTimeout(this.googleRetryTimer);
    super.ngOnDestroy();
  }

  // Public methods

  public onLogin(): void {
    this.authController
      .Login(this.form.value)
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe((res) => {
        this.handleAuthentication(res);
      });
  }

  public onGoogleLogin(): void {
    this.codeClient?.requestCode();
  }

  // Private methods

  private onGoogleCode(response: any): void {
    if (!response?.code) {
      return;
    }

    this.authController
      .GoogleCodeLogin(JSON.stringify(response.code))
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe((res) => {
        this.handleAuthentication(res);
      });
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_PATTERN)]],
      password: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_PATTERN)]],
    });
  }

  // The Google script is loaded with `async defer`, so it may not be there yet when the view is
  // ready. Rather than guessing with a single timeout, keep looking for it for a few seconds.
  private initializeGoogleLogin(attempt = 0): void {
    if (!this.isGoogleLoaded()) {
      if (attempt < 50) {
        this.googleRetryTimer = window.setTimeout(() => this.initializeGoogleLogin(attempt + 1), 100);
      }
      return;
    }

    this.codeClient = window.google.accounts.oauth2.initCodeClient({
      client_id: Constants.GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: (response: any) => this.onGoogleCode(response),
    });

    this.isGoogleReady = true;
  }

  private isGoogleLoaded(): boolean {
    return !!(window.google && window.google.accounts && window.google.accounts.oauth2);
  }

  private handleAuthentication(res: IUserProfileDto) {
    if (res.requiresExternalLogin === false) {
      this.authService.user.next(res);
      localStorage.setItem('user', JSON.stringify(res));
      this.authService.autoLogout(new Date(res.expiresIn).getTime() - new Date().getTime());
      this.router.navigate(['app/dashboard']);
      return;
    }

    // The account was created through Google, so no password will ever open it - send the user back
    // through Google instead of on to a dashboard they cannot enter.
    this.onGoogleLogin();
  }
}

declare global {
  interface Window {
    google: any;
  }
}
