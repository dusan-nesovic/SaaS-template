// Angular modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Third-party modules
import { takeUntil } from 'rxjs';

// Project modules
import { UserRoleType } from '@Workspace/_generated/enums';
import { IUserInfoDto } from '@Workspace/_generated/interfaces';
import { UserController } from '@Workspace/_generated/services';
import { Constants } from '@Workspace/common';
import { AuthService, LoadingSpinnerService, SubjectService } from '@Workspace/services';
import { BaseDashboardComponent, GridColumn, withSpinner } from '@Workspace/shared';

type RoleFilter = 'all' | 'admin';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent extends BaseDashboardComponent implements OnInit {
  users: IUserInfoDto[] = [];
  // What passes the filters; a stored array, so the grid keeps its page between change detections.
  filteredUsers: IUserInfoDto[] = [];
  isLoaded = false;
  userRoles = UserRoleType;

  role: RoleFilter = 'all';
  search = '';

  readonly roleOptions: { value: RoleFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'ADMIN.ALL_ROLES' },
    { value: 'admin', labelKey: 'ADMIN.ADMINS' },
  ];

  readonly columns: GridColumn<IUserInfoDto>[] = [
    { key: 'name', headerKey: 'NAME', sortValue: user => this.fullName(user), mobile: 'title' },
    { key: 'email', headerKey: 'DASHBOARD.COL_EMAIL', sortValue: user => user.userName, mobile: 'line' },
    { key: 'roles', headerKey: 'ROLES', sortValue: user => (this.isAdmin(user) ? 0 : 1), mobile: 'aside' },
    { key: 'created', headerKey: 'CREATED_ON', sortValue: user => new Date(user.createdOn), mobile: 'meta' },
    { key: 'action', headerKey: '', align: 'end', mobile: 'hidden' },
  ];

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private subjectService: SubjectService,
    private userController: UserController
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit(): void {
    // The edit dialog publishes the updated list here after saving roles.
    this.subjectService
      .getSubject('users')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        if (value) {
          this.users = value as IUserInfoDto[];
          this.isLoaded = true;
          this.applyFilters();
        }
      });

    this.getUsers();
  }

  // Public methods

  public setRole(role: RoleFilter): void {
    this.role = role;
    this.applyFilters();
  }

  public applyFilters(): void {
    const term = this.search.trim().toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      if (this.role === 'admin' && !this.isAdmin(user)) return false;
      if (!term) return true;
      return [this.fullName(user), user.userName].some(value => value?.toLowerCase().includes(term));
    });
  }

  public onEdit(user: IUserInfoDto): void {
    this.router.navigate([`${Constants.BASE_PATH}/admin/users/edit`, user.id]);
  }

  public fullName(user: IUserInfoDto): string {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }

  public isAdmin(user: IUserInfoDto): boolean {
    return user.userRoles?.includes(UserRoleType.Admin) ?? false;
  }

  // Private methods

  private getUsers(): void {
    this.userController
      .GetAllUsers()
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => this.subjectService.updateSubjectValue('users', res));
  }
}
