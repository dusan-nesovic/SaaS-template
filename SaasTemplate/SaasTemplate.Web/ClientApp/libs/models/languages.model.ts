// Third-party modules
import { TranslateService } from '@ngx-translate/core';

export interface ILanguage {
  name: string;
  code: string;
}

export class Languages {
  public static items: ILanguage[] = [];

  constructor(private translate: TranslateService) {
    this.initializeConstructor();
  }

  // Private methods

  private initializeConstructor() {
    this.updateLanguages();
    this.translate.onLangChange.subscribe(() => {
      this.updateLanguages();
    });
  }

  private updateLanguages() {
    this.translate.get(['ENGLISH', 'SERBIAN', 'GERMAN', 'ITALIAN', 'SPANISH', 'FRENCH']).subscribe(translations => {
      // Filled in place rather than reassigned: the lookup can resolve after a
      // component has already read `items`, and replacing the array would
      // leave that component holding the empty one it copied.
      Languages.items.length = 0;
      Languages.items.push(
        { name: translations['ENGLISH'], code: 'en' },
        { name: translations['SERBIAN'], code: 'sr' },
        { name: translations['GERMAN'], code: 'de' },
        { name: translations['ITALIAN'], code: 'it' },
        { name: translations['SPANISH'], code: 'es' },
        { name: translations['FRENCH'], code: 'fr' }
      );
    });
  }
}
