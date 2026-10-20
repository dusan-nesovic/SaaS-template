// Angular modules
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

// Project modules
import { Languages } from '@Workspace/models';
import { AuthService, LanguageService, LoadingSpinnerService } from '@Workspace/services';
import { BaseDashboardComponent } from '@Workspace/shared';
import { ThemeService, Theme } from 'libs/services/theme.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent extends BaseDashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  currentTheme: Theme = 'light';
  languages: any[] = [];
  selectedLanguage: string = '';

  get languageOptions() {
    return this.languages.map(l => ({ label: l.name, value: l.code }));
  }

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.initializeLanguages();
    this.getSavedLanguage();

    // Postavi inicijalnu temu + subscribe
    this.themeService.loadTheme();

    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => {
        this.currentTheme = theme;
      });

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.initializeLanguages();
      });
  }

  // Public methods

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  public onLanguageChange(event: any) {
    this.selectedLanguage = event.value;
    this.languageService.setUserLanguage(this.selectedLanguage);
  }

  // Private methods

  private initializeLanguages() {
    new Languages(this.translateService);
    this.languages = Languages.items;
  }

  private getSavedLanguage() {
    this.selectedLanguage = this.languageService.userLanguage;
    this.languageService.useUserLanguage();
  }
}
