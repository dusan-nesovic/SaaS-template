import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export type Theme = 'light' | 'dark';

@Injectable()
export class ThemeService {
  private readonly _theme$ = new BehaviorSubject<Theme>('light');

  // Ovo koristiš u komponenti: uvek dobije poslednju vrednost
  public readonly theme$: Observable<Theme> = this._theme$.asObservable().pipe(
    distinctUntilChanged()
  );

  public toggleTheme(): void {
    const currentTheme = this.getCurrentThemeFromDomOrStorage();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    this._theme$.next(newTheme); // <-- najbitnije
  }

  // Umesto boolean, bolje vrati Theme ili ako mora boolean, može oba (ispod)
  public loadTheme(): Theme {
    const saved = (localStorage.getItem('theme') as Theme | null);

    const theme: Theme = saved === 'dark' || saved === 'light' ? saved : 'light';

    document.documentElement.setAttribute('data-theme', theme);
    this._theme$.next(theme); // <-- da i subscriber-i dobiju inicijalnu vrednost

    return theme;
  }

  private getCurrentThemeFromDomOrStorage(): Theme {
    const dom = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (dom === 'dark' || dom === 'light') return dom;

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;

    return 'light';
  }
}
