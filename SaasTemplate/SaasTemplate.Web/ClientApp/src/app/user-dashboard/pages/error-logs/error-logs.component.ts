// Angular modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Project modules
import { IErrorLogDto } from '@Workspace/_generated/interfaces';
import { LogController } from '@Workspace/_generated/services';
import { AuthService, LoadingSpinnerService } from '@Workspace/services';
import { BaseDashboardComponent, GridColumn, withSpinner } from '@Workspace/shared';

type PeriodFilter = 'all' | 'day' | 'week';

const HOUR = 60 * 60 * 1000;

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss'],
})
export class ErrorLogsComponent extends BaseDashboardComponent implements OnInit {
  errors: IErrorLogDto[] = [];
  // What passes the filters; a stored array, so the grid keeps its page between change detections.
  filteredErrors: IErrorLogDto[] = [];
  isLoaded = false;

  period: PeriodFilter = 'all';
  search = '';

  readonly periodOptions: { value: PeriodFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'ERROR_LOGS_GRID.ALL_TIME' },
    { value: 'day', labelKey: 'ERROR_LOGS_GRID.LAST_DAY' },
    { value: 'week', labelKey: 'ERROR_LOGS_GRID.LAST_WEEK' },
  ];

  readonly columns: GridColumn<IErrorLogDto>[] = [
    { key: 'source', headerKey: 'SOURCE', sortValue: error => error.source, mobile: 'title' },
    { key: 'message', headerKey: 'MESSAGE', sortValue: error => error.message, mobile: 'line' },
    { key: 'user', headerKey: 'USER', sortValue: error => error.email, mobile: 'meta' },
    { key: 'time', headerKey: 'TIME', sortValue: error => this.timeOf(error), mobile: 'aside' },
    { key: 'action', headerKey: '', align: 'end', mobile: 'hidden' },
  ];

  // The log whose details are open.
  selected: IErrorLogDto | null = null;
  isDetailOpen = false;

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

  public setPeriod(period: PeriodFilter): void {
    this.period = period;
    this.applyFilters();
  }

  public applyFilters(): void {
    const term = this.search.trim().toLowerCase();
    const since = this.period === 'day' ? Date.now() - 24 * HOUR : this.period === 'week' ? Date.now() - 7 * 24 * HOUR : null;

    this.filteredErrors = this.errors.filter(error => {
      if (since !== null && (this.timeOf(error)?.getTime() ?? 0) < since) return false;
      if (!term) return true;

      return [error.message, error.source, error.email].some(value => value?.toLowerCase().includes(term));
    });
  }

  public openDetails(error: IErrorLogDto): void {
    this.selected = error;
    this.isDetailOpen = true;
  }

  public onDetailClosed(): void {
    this.selected = null;
  }

  // Private methods

  private timeOf(error: IErrorLogDto): Date | null {
    return error.time ? new Date(error.time) : null;
  }

  private getErrors() {
    this.logController
      .GetAllErrors()
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => {
        this.errors = res;
        this.isLoaded = true;
        this.applyFilters();
      });
  }
}
