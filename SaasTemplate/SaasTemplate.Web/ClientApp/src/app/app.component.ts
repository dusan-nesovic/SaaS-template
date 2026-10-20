// Angular modules
import { Component, OnInit } from '@angular/core';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

// Project modules
import { LanguageService, ToastService } from '@Workspace/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private languageService: LanguageService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.initializeConstructor();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.languageService.useUserLanguage();
  }

  // Public methods

  public onToastClose() {
    this.toastService.notifyToastClose();
  }

  // Private methods

  private initializeConstructor() {
    this.translate.addLangs(['sr', 'en', 'de', 'it', 'es', 'fr']);
    this.translate.setDefaultLang('en');
  }
}
