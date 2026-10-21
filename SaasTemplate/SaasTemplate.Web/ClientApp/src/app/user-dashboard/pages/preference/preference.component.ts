// Angular modules
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

// Project modules
import { ThemeType } from '@Workspace/_generated/enums';
import { IUserPreferenceDto } from '@Workspace/_generated/interfaces';
import { PreferenceController } from '@Workspace/_generated/services';
import { ILanguage, Languages } from '@Workspace/models';
import { AuthService, LanguageService, LoadingSpinnerService, ThemeService, ToastService } from '@Workspace/services';
import { BaseDashboardComponent, withSpinner } from '@Workspace/shared';

/**
 * Theme and language of the signed-in user. Picking a value changes nothing yet; Save stores both
 * on the account and applies them, so the same choice follows the user to another device.
 */
@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent extends BaseDashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  languages: ILanguage[] = [];
  themeOptions: { label: string; value: ThemeType }[] = [];

  selectedTheme: ThemeType = ThemeType.System;
  selectedLanguage = '';
  // What is stored on the account, to tell whether there is anything to save.
  saved: IUserPreferenceDto | null = null;

  get languageOptions() {
    return this.languages.map(l => ({ label: l.name, value: l.code }));
  }

  get hasChanges(): boolean {
    return !!this.saved && (this.saved.theme !== this.selectedTheme || this.saved.language !== this.selectedLanguage);
  }

  constructor(
    authService: AuthService,
    loadingSpinnerService: LoadingSpinnerService,
    router: Router,
    route: ActivatedRoute,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private preferenceController: PreferenceController,
    private toastService: ToastService
  ) {
    super(authService, loadingSpinnerService, router, route);
  }

  ngOnInit() {
    this.initializeOptions();
    this.getPreference();

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.initializeOptions();
    });
  }

  // Public methods

  public onSave() {
    const preference: IUserPreferenceDto = { theme: this.selectedTheme, language: this.selectedLanguage };

    this.preferenceController
      .UpdatePreference(preference)
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => {
        this.applyPreference(res);
        this.toastService.addToastKey('success', 'TOAST.SAVED', 'TOAST.PREFERENCE_SAVED_DETAIL');
      });
  }

  // Private methods

  private getPreference() {
    this.preferenceController
      .GetPreference()
      .pipe(withSpinner(this.loadingSpinnerService))
      .subscribe(res => {
        // An account that never picked a language keeps the one the app already speaks.
        this.saved = { theme: res.theme, language: res.language ?? this.languageService.userLanguage };
        this.selectedTheme = this.saved.theme;
        this.selectedLanguage = this.saved.language!;
      });
  }

  private applyPreference(preference: IUserPreferenceDto) {
    this.saved = { ...preference };
    this.themeService.setPreference(ThemeService.fromEnum(preference.theme));
    if (preference.language) this.languageService.setUserLanguage(preference.language);

    // The stored sign-in carries the preference too, so a reload and the next sign-in agree with it.
    const user = this.authService.getLoggedUser();
    if (user) {
      const updated = { ...user, theme: preference.theme, language: preference.language };
      localStorage.setItem('user', JSON.stringify(updated));
      this.authService.user.next(updated);
    }
  }

  private initializeOptions() {
    new Languages(this.translateService);
    this.languages = Languages.items;

    this.translateService.get(['THEME_SYSTEM', 'THEME_LIGHT', 'THEME_DARK']).subscribe(translations => {
      this.themeOptions = [
        { label: translations['THEME_SYSTEM'], value: ThemeType.System },
        { label: translations['THEME_LIGHT'], value: ThemeType.Light },
        { label: translations['THEME_DARK'], value: ThemeType.Dark },
      ];
    });
  }
}
