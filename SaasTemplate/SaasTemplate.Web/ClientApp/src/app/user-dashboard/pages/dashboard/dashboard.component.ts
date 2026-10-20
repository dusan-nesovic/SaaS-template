// Angular modules
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// Project modules
import { IAdminDashboardDto, IRecentUserDto, IUserDashboardDto } from "@Workspace/_generated/interfaces";
import { DashboardController } from "@Workspace/_generated/services";
import {
  AuthService,
  LoadingSpinnerService,
} from "@Workspace/services";
import { BaseDashboardComponent, DonutSegment, withSpinner } from "@Workspace/shared";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseDashboardComponent implements OnInit {
  dashboard: IUserDashboardDto | null = null;
  adminDashboard: IAdminDashboardDto | null = null;
  mode: 'user' | 'admin' = 'user';

  // Built once per load so the chart is not handed a new array on every change detection.
  emailStatusSegments: DonutSegment[] = [];

  public get canSwitchMode(): boolean {
    return this.hasAdminPermission;
  }

  public setMode(mode: 'user' | 'admin'): void {
    this.mode = mode;
  }

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private dashboardController: DashboardController
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.loadDashboard();
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  private loadDashboard() {
    if (!this.user?.id) {
      // BaseDashboardComponent populates user async; wait until available
      this.authService.user.subscribe(u => {
        if (u?.id) {
          this.fetch();
        }
      });
      return;
    }
    this.fetch();
  }

  private fetch() {
    this.dashboardController
      .GetUserDashboard()
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => {
        this.dashboard = res ?? null;
      });

    if (this.hasAdminPermission) {
      this.dashboardController
        .GetAdminDashboard()
        .subscribe(res => {
          this.adminDashboard = res ?? null;
          this.buildAdminCharts();
        });
    }
  }

  // Helpers for admin section

  public get adminSeriesMax(): number {
    if (!this.adminDashboard) return 0;
    return Math.max(1, ...this.adminDashboard.registrationsByDay.map(d => d.count));
  }

  public seriesPercent(value: number): number {
    return this.adminSeriesMax > 0 ? Math.round((value / this.adminSeriesMax) * 100) : 0;
  }

  public formatShortDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  public userDisplayName(user: IRecentUserDto): string {
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return full || user.email || user.userId;
  }

  // A category keeps its color whatever the counts are: the slot comes from the category itself.
  private buildAdminCharts(): void {
    const kpi = this.adminDashboard?.kpi;
    this.emailStatusSegments = kpi && kpi.totalUsers > 0
      ? [
          { key: 'confirmed', labelKey: 'DASHBOARD.EMAIL_CONFIRMED', value: kpi.confirmedUsers, slot: 1 },
          { key: 'unconfirmed', labelKey: 'DASHBOARD.EMAIL_NOT_CONFIRMED', value: kpi.unconfirmedUsers, slot: 5 },
        ]
      : [];
  }
}
