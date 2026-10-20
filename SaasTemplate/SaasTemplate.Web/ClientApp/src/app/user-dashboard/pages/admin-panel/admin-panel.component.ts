// Angular modules
import { Component } from '@angular/core';

/**
 * The admin's home: one page with tabs. Each tab is a child route (admin/users, ...),
 * so a reload or a shared link lands on the same tab. Add a tab here and a child route in
 * dashboard-content-routing.module.ts.
 */
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {}
