// Angular modules
import { IMenuItem } from '@Workspace/interfaces';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

export class MenuItems {
  public static items: IMenuItem[] = [];

  constructor(private translate: TranslateService) {
    this.initializeContructor();
  }

  // Private methods

  private initializeContructor() {
    this.updateMenuItems();
    this.translate.onLangChange.subscribe(() => {
      this.updateMenuItems();
    });
  }

  private updateMenuItems() {
    this.translate
      .get(['MENU.DASHBOARD', 'MENU.ADMIN', 'MENU.ADMIN_PANEL', 'MENU.SERILOG', 'MENU.SETTINGS', 'MENU.PREFERENCE'])
      .subscribe(translations => {
        MenuItems.items = [
          {
            label: translations['MENU.DASHBOARD'],
            icon: 'pi pi-fw pi-home',
            url: '/app/dashboard',
            condition: false,
            active: true,
          },
          {
            label: translations['MENU.ADMIN_PANEL'],
            icon: 'pi pi-fw pi-user',
            url: '/app/dashboard/admin',
            requiresAdmin: true,
            condition: false,
            active: false,
          },
          {
            label: translations['MENU.SERILOG'],
            icon: 'pi pi-fw pi-exclamation-triangle',
            url: '/app/dashboard/error-logs',
            requiresAdmin: true,
            condition: false,
            active: false,
          },
          {
            label: translations['MENU.PREFERENCE'],
            icon: 'pi pi-fw pi-sliders-v',
            url: '/app/dashboard/preference',
            condition: false,
            active: false,
          }
        ];
      });
  }
}
