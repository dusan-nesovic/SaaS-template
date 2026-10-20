// Angular modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project modules
import { AuthenticationGuard } from '@Workspace/guards';
import { ChangePasswordComponent } from './authentication-components/change-password/change-password.component';
import { EmailConfirmedComponent } from './authentication-components/email-confirmation/email-confirmed.component';
import { LoginComponent } from './authentication-components/login/login.component';
import { RegisterComponent } from './authentication-components/register/register.component';
import { ResetPasswordComponent } from './authentication-components/reset-password/reset-password.component';
import { UserDashboardComponent } from './user-dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',
      loadChildren: () =>
      import('./pages/dashboard-content-routing.module').then(
        (m) => m.DashboardContentRoutingModule
      ),
    component: UserDashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
