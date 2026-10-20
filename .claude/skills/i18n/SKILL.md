---
name: i18n
description: Add, rename or remove translation keys in the Angular client. Use whenever a user-visible string is added or changed.
---

# Translations

Files: `SaasTemplate/SaasTemplate.Web/ClientApp/src/assets/i18n/{en,sr,de,es,fr,it}.json`.

1. Search `en.json` for an existing key before adding one.
2. Key format: `UPPER_SNAKE_CASE`, grouped in nested objects where a group exists (`MENU.*`, `TOAST.*`, `EVENT_TYPE.*`, `PAGE_SUB.*`).
3. Add the key to **all six** files, at the same position, with a real translation in each language (Serbian in Latin script).
4. Enum labels: `<PREFIX>.<VALUE_UPPER_SNAKE>`, matching `enumToOptions(Enum, 'PREFIX')` / the `enumName` pipe.
5. Usage: template `{{ 'KEY' | translate }}` or `[title]="'KEY' | translate"`; code `this.translate.instant('KEY')`; toasts `toastService.addToastKey('success', 'TOAST.X', 'TOAST.X_DETAIL')`.
6. Renaming or removing: grep `src/` and `libs/` for the old key first.
7. Verify all six files still parse and have identical key sets.
