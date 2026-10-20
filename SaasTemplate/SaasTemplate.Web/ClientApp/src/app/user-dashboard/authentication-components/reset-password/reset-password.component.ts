// Angular modules
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Third-party modules

// Project modules
import { Constants } from '@Workspace/common';
import { AuthController } from '@Workspace/_generated/services';
import { LoadingSpinnerService, ThemeService, ToastService } from '@Workspace/services';
import { BaseComponent, withSpinner } from '@Workspace/shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent extends BaseComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  constructor(
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authController: AuthController,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {
    super(loadingSpinnerService, router, route);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.themeService.loadTheme();
  }

  // Public methods

  public onPasswordReset(): void {
    this.authController
      .ResetPassword(this.form.value.email)
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(() => {
        this.toastService.addToastKey('success', 'TOAST.RESET_SENT', 'TOAST.RESET_SENT_DETAIL');
        this.router.navigate([Constants.LOGIN_PATH]);
      });
  }

  // Private methods

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_PATTERN)]],
    });
  }
}
