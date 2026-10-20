// Angular modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project guards
import { AdminGuard } from 'libs/guards/admin.guard';
import { AuthenticationGuard } from '@Workspace/guards';

// Project components
import { AdminUsersComponent } from './admin-panel/users/admin-users.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserComponent } from './admin-panel/components/edit-user.component';
import { ErrorLogsComponent } from './error-logs/error-logs.component';
import { PreferenceComponent } from './preference/preference.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
    // One page with tabs; each tab is its own address so a reload stays on it.
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', component: AdminUsersComponent, children: [{ path: 'edit/:id', component: EditUserComponent }] },
    ],
  },
  { path: 'error-logs', component: ErrorLogsComponent, canActivate: [AdminGuard] },
  { path: 'preference', component: PreferenceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardContentRoutingModule {}
