// Angular modules
import { Injectable } from '@angular/core';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

/**
 * The user's language: chosen on the preference page or in the landing header
 * and kept in localStorage.
 */
@Injectable()
export class LanguageService {
  public static readonly StorageKey = 'language';
  public static readonly Fallback = 'en';

  constructor(private translate: TranslateService) {}

  // Getters

  /** The language the user picked, or the fallback when they never picked one. */
  public get userLanguage(): string {
    return localStorage.getItem(LanguageService.StorageKey) || LanguageService.Fallback;
  }

  // Public methods

  /** Applies the user's stored language. Call it on start-up. */
  public useUserLanguage(): void {
    this.translate.use(this.userLanguage);
  }

  /** The user chose a language: remember it and apply it. */
  public setUserLanguage(language: string): void {
    localStorage.setItem(LanguageService.StorageKey, language);
    this.translate.use(language);
  }
}
