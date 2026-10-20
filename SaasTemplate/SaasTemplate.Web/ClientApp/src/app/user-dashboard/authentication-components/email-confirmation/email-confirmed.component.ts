// Angular modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Third-party modules

// Project modules
import { AuthController } from '@Workspace/_generated/services';
import { Constants } from '@Workspace/common';
import { LoadingSpinnerService, ThemeService, ToastService } from '@Workspace/services';
import { BaseComponent, withSpinner } from '@Workspace/shared';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.scss'],
})
export class EmailConfirmedComponent extends BaseComponent implements OnInit {
  constructor(
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private authController: AuthController,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {
    super(loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.themeService.loadTheme();
    
    const confirmationLink = this.route.snapshot.queryParams['confirmationLink'];

    const url = new URL(confirmationLink);

    const token = url.searchParams.has('token') ? url.searchParams.get('token') ?? '' : '';
    const email = url.searchParams.has('email') ? url.searchParams.get('email') ?? '' : '';

    this.authController
      .ConfirmEmail(token, email)
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(() => {
        this.toastService.addToastKey('success', 'TOAST.EMAIL_CONFIRMED', 'TOAST.EMAIL_CONFIRMED_DETAIL');
        this.router.navigate([Constants.LOGIN_PATH]);
      });
  }
}
