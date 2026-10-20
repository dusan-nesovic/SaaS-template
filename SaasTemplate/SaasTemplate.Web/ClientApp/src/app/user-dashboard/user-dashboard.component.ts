// Angular modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil } from 'rxjs';

// Project modules
import { Constants } from '@Workspace/common';
import { IMenuItem } from '@Workspace/interfaces';
import { MenuItems } from '@Workspace/models';
import { UserController } from '@Workspace/_generated/services';
import { AuthService, LoadingSpinnerService, SubjectService } from '@Workspace/services';
import { BaseDashboardComponent, convertArrayBufferToBase64, withSpinner } from '@Workspace/shared';
import { ThemeService } from 'libs/services/theme.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent extends BaseDashboardComponent implements OnInit {
  menuItems: IMenuItem[] = [];
  activeLink: string = Constants.DEFAULT_MENU;
  appName = Constants.APP_NAME;
  userProfileImage: string | null = 'assets/images/user.png';

  isSidebarCollapsed = window.innerWidth <= 768;

  serilogCount: number;

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private subjectService: SubjectService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private userController: UserController
  ) {
    super(authService, loadingSpinnerService, router, route);
    this.initializeConstructor();
  }

  ngOnInit() {
    if (this.hasAdminPermission) this.createUserSubject();
  }

  // Public Methods

  public onNavigate(url: string) {
    this.router.navigate([url]);
    if (window.innerWidth <= 768) this.isSidebarCollapsed = true;
  }

  public toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  public onLogout() {
    this.authService.logout();
    this.subjectService.flushSubjects();
  }

  // Private Methods

  private initializeConstructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((event: NavigationEnd) => {
        this.initializeMenu();
        this.setActiveMenuItem(event.urlAfterRedirects);
      });
    this.themeService.loadTheme();
    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.initializeMenu();
      this.setActiveMenuItem(Constants.PREFERENCE);
    });
  }

  private initializeMenu() {
    new MenuItems(this.translate);
    this.menuItems = MenuItems.items;
    this.updateConditions();
  }

  private updateConditions() {
    this.menuItems.forEach(item => (item.condition = item.requiresAdmin ? this.hasAdminPermission : this.isAuthenticated));
  }

  private createUserSubject() {
    this.subjectService.createSubject('users', null);
  }

  private setActiveMenuItem(url: string) {
    // Filters live in the query string (e.g. ?status=draft); only the path decides the menu item.
    const path = url.split(/[?#]/)[0];
    let best: IMenuItem | null = null;
    for (const item of this.menuItems) {
      if (path === item.url || path.startsWith(item.url + '/')) {
        if (!best || item.url.length > best.url.length) best = item;
      }
    }
    this.menuItems.forEach(item => (item.active = item === best));
  }
}
