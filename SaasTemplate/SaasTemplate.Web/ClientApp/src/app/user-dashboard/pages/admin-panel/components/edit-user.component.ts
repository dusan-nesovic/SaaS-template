// Angular modules
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Third-party modules
import { takeUntil } from 'rxjs';

// Project modules
import { UserRoleType } from '@Workspace/_generated/enums';
import { IUserInfoDto } from '@Workspace/_generated/interfaces';
import { UserController } from '@Workspace/_generated/services';
import { AuthService, LoadingSpinnerService, SubjectService } from '@Workspace/services';
import { BaseDashboardComponent, withSpinner } from '@Workspace/shared';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent extends BaseDashboardComponent implements OnInit, OnDestroy {
  selectedUser!: IUserInfoDto;
  userRoles = UserRoleType;
  userRetrieved!: boolean;

  list1: UserRoleType[] = [];
  list2: UserRoleType[] = [];

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private subjectSevice: SubjectService,
    private userController: UserController
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.getUser(this.entityId);
  }

  // Public methods
  
  public onAddUserRoleType(index: number) {
    const item = this.list1.splice(index, 1)[0];
    this.list2.push(item);
  }

  public onRemovUserRoleType(index: number) {
    const item = this.list2.splice(index, 1)[0];
    this.list1.push(item);
  }
  
  public onUpdateUserRoles() {
    this.selectedUser.userRoles = this.list2;
    this.userController.UpdateUserRoles(this.selectedUser)
      .pipe(withSpinner(this.loadingSpinnerService), takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.subjectSevice.updateSubjectValue('users', res);
        this.closeEdit();
      });
  }

  public closeEdit() {
    this.router.navigate(['app/dashboard/admin/users']);
  }
  
  // Private methods

  private getUser(userId: string){
      this.userController.GetUserById(userId)
        .pipe(withSpinner(this.loadingSpinnerService), takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.selectedUser = res;
          this.selectedUser.userRoles.forEach(item => {
            if(item != UserRoleType.User)
            this.list2.push(item);
          });
          for (const value in UserRoleType) {
            const numericValue = Number(value);
            if (!isNaN(numericValue)) {
              const enumValue: UserRoleType = numericValue;

              if (!this.list2.includes(enumValue) && UserRoleType.NotSet != enumValue && UserRoleType.User != enumValue) {
                this.list1.push(enumValue);
              }
            }
          }
          this.userRetrieved = true;
        }
    );
  }

}
