// Angular modules
import { NgModule } from '@angular/core';

// Project modules
import { AdminGuard, AuthenticationGuard } from '@Workspace/guards';
import { EnumNamePipe, TimeAgoPipe } from '@Workspace/pipes';
import { SubjectService } from '@Workspace/services';
import { SharedModule } from '@Workspace/shared';
import * as controllers from '@Workspace/_generated/services';

// Local modules
import { ChangePasswordComponent } from './authentication-components/change-password/change-password.component';
import { EmailConfirmedComponent } from './authentication-components/email-confirmation/email-confirmed.component';
import { LoginComponent } from './authentication-components/login/login.component';
import { RegisterComponent } from './authentication-components/register/register.component';
import { ResetPasswordComponent } from './authentication-components/reset-password/reset-password.component';
import { EditUserComponent } from './pages/admin-panel/components/edit-user.component';
import { AdminUsersComponent } from './pages/admin-panel/users/admin-users.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErrorLogsComponent } from './pages/error-logs/error-logs.component';
import { PreferenceComponent } from './pages/preference/preference.component';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';

@NgModule({
  declarations: [
    //Components
    AdminPanelComponent,
    AdminUsersComponent,
    ChangePasswordComponent,
    DashboardComponent,
    EditUserComponent,
    EmailConfirmedComponent,
    ErrorLogsComponent,
    LoginComponent,
    PreferenceComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserDashboardComponent,
    // Pipes
    EnumNamePipe,
    TimeAgoPipe,
  ],
  imports: [SharedModule, UserDashboardRoutingModule],
  providers: [
    // Controllers
    controllers.AuthController,
    controllers.LogController,
    controllers.UserController,
    // Guards
    AdminGuard,
    AuthenticationGuard,
    // Services
    SubjectService,
  ],
  bootstrap: [UserDashboardComponent],
})
export class UserDashboardModule { }
