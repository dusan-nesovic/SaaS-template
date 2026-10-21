// Angular modules
import { Injectable } from '@angular/core';

// Third-party modules
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// Project modules
import { ThemeType } from '@Workspace/_generated/enums';

// What is on screen.
export type Theme = 'light' | 'dark';
// What the user chose; 'system' follows the device's light or dark setting.
export type ThemePreference = 'system' | 'light' | 'dark';

/**
 * The colour scheme of the whole app. The choice is kept in localStorage so it applies before
 * anyone signs in; a signed-in user's choice also lives on their account (PreferenceController),
 * and is copied here on sign-in and on save.
 */
@Injectable()
export class ThemeService {
  public static readonly StorageKey = 'theme';

  private readonly _theme$ = new BehaviorSubject<Theme>('light');
  private readonly darkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // The theme on screen; always emits the latest value to a new subscriber.
  public readonly theme$: Observable<Theme> = this._theme$.asObservable().pipe(distinctUntilChanged());

  constructor() {
    this.apply();

    // A device switching between light and dark is followed while the choice is 'system'.
    this.darkScheme.addEventListener('change', () => {
      if (this.preference === 'system') this.apply();
    });
  }

  // Getters

  public get preference(): ThemePreference {
    const saved = localStorage.getItem(ThemeService.StorageKey);
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  }

  // Public methods

  /** Applies the stored choice and returns the theme now on screen. */
  public loadTheme(): Theme {
    return this.apply();
  }

  public setPreference(preference: ThemePreference): void {
    localStorage.setItem(ThemeService.StorageKey, preference);
    this.apply();
  }

  /** The quick switch in the landing header: the opposite of what is on screen, as an explicit choice. */
  public toggleTheme(): void {
    this.setPreference(this._theme$.value === 'dark' ? 'light' : 'dark');
  }

  public static fromEnum(theme: ThemeType | null | undefined): ThemePreference {
    switch (theme) {
      case ThemeType.Light:
        return 'light';
      case ThemeType.Dark:
        return 'dark';
      default:
        return 'system';
    }
  }

  public static toEnum(preference: ThemePreference): ThemeType {
    switch (preference) {
      case 'light':
        return ThemeType.Light;
      case 'dark':
        return ThemeType.Dark;
      default:
        return ThemeType.System;
    }
  }

  // Private methods

  private apply(): Theme {
    const preference = this.preference;
    const theme: Theme = preference === 'system' ? (this.darkScheme.matches ? 'dark' : 'light') : preference;

    document.documentElement.setAttribute('data-theme', theme);
    this._theme$.next(theme);

    return theme;
  }
}
