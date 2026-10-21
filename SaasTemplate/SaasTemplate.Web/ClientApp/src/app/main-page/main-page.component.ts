// Angular modules
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

// Project modules
import { ILanguage, Languages } from '@Workspace/models';
import { LanguageService, Theme, ThemeService } from '@Workspace/services';

interface LandingFeature {
  icon: string;
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // Bar heights (in %) of the stylised chart in the hero preview.
  readonly previewBars = [35, 52, 44, 68, 58, 80, 72, 95];

  year = new Date().getFullYear();
  currentTheme: Theme = 'light';
  selectedLanguage = 'en';
  languages: ILanguage[] = [];

  readonly features: LandingFeature[] = [
    { icon: 'pi-lock', titleKey: 'MAIN_PAGE.FEATURES.ITEM_AUTH_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_AUTH_TEXT' },
    { icon: 'pi-chart-bar', titleKey: 'MAIN_PAGE.FEATURES.ITEM_DASHBOARD_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_DASHBOARD_TEXT' },
    { icon: 'pi-users', titleKey: 'MAIN_PAGE.FEATURES.ITEM_ADMIN_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_ADMIN_TEXT' },
    { icon: 'pi-list', titleKey: 'MAIN_PAGE.FEATURES.ITEM_LOGS_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_LOGS_TEXT' },
    { icon: 'pi-sliders-h', titleKey: 'MAIN_PAGE.FEATURES.ITEM_PREFERENCES_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_PREFERENCES_TEXT' },
    { icon: 'pi-globe', titleKey: 'MAIN_PAGE.FEATURES.ITEM_LANGUAGES_TITLE', textKey: 'MAIN_PAGE.FEATURES.ITEM_LANGUAGES_TEXT' },
  ];

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeLanguages();
    this.getSavedLanguage();

    this.currentTheme = this.themeService.loadTheme();

    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.initializeLanguages();
      });
  }

  // Public methods

  // The dashboard is behind AuthenticationGuard, which sends anyone who is not signed in to the
  // login page - so one entry point covers both the returning user and the new one.
  public openApp(): void {
    this.router.navigate(['/app/dashboard']);
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;

    this.selectedLanguage = language;
    this.languageService.setUserLanguage(language);
  }

  public scrollTo(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Private methods

  private initializeLanguages(): void {
    new Languages(this.translateService);
    this.languages = Languages.items;
  }

  private getSavedLanguage(): void {
    this.selectedLanguage = this.languageService.userLanguage;
    this.languageService.useUserLanguage();
  }
}
