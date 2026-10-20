// Angular modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Project modules
import { IErrorLogDto } from '@Workspace/_generated/interfaces';
import { LogController } from '@Workspace/_generated/services';
import { AuthService, LoadingSpinnerService } from '@Workspace/services';
import { BaseDashboardComponent, withSpinner } from '@Workspace/shared';

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss'],
})
export class ErrorLogsComponent extends BaseDashboardComponent implements OnInit {
  errors: IErrorLogDto[];
  expandedErrorIndex: number = -1;

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private logController: LogController
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.getErrors();
  }

  // Public methods

  public toggleDetails(index: number) {
    if (this.expandedErrorIndex === index) {
      this.expandedErrorIndex = -1;
    } else {
      this.expandedErrorIndex = index;
    }
  }

  // Private methods

  private getErrors() {
    this.logController
      .GetAllErrors()
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => {
        this.errors = res;
      });
  }
}
