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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends BaseComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  constructor(
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private authController: AuthController,
    private formBuilder: FormBuilder,
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

  public onRegister(): void {
    this.authController
      .Register(this.form.value)
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(() => {
        this.toastService.addToastKey('success', 'TOAST.REGISTERED', 'TOAST.REGISTERED_DETAIL');
        this.router.navigate([Constants.LOGIN_PATH]);
      });
  }

  // Private methods

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(Constants.NAME_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(Constants.NAME_PATTERN)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_PATTERN)]],
      password: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required],
    });
  }
}
