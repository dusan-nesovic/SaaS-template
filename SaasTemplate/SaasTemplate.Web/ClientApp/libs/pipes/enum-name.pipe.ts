import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'enumName',
  pure: false
})
export class EnumNamePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(
    value: number | null | undefined,
    enumType: any,
    translatePrefix?: string
  ): string {

    if (value === null || value === undefined || !enumType) {
      return '';
    }

    // 1️⃣ Uzmi naziv enum člana (npr. "admin")
    const key = enumType[value];

    if (!key) {
      return '';
    }

    // 2️⃣ Title case za prikaz, UPPERCASE za i18n ključ
    const titleKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    const upperKey = key.toUpperCase();

    // 3️⃣ Ako nema translate prefixa, vrati title case
    if (!translatePrefix) {
      return titleKey;
    }

    // 4️⃣ Napravi i18n ključ
    const i18nKey = `${translatePrefix}.${upperKey}`;

    const translated = this.translate.instant(i18nKey);

    return translated === i18nKey ? titleKey : translated;
  }
}
