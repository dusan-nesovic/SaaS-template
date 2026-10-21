// Angular modules
import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * The content of one column of an `app-data-grid`, written by the page that uses the grid:
 *
 *   <ng-template appGridCell="owner" let-row>{{ row.ownerName }}</ng-template>
 *
 * The name matches `GridColumn.key`; `row` is the item of that table row.
 */
@Directive({
  selector: 'ng-template[appGridCell]',
})
export class GridCellDirective {
  @Input('appGridCell') key = '';

  constructor(public template: TemplateRef<{ $implicit: unknown }>) {}
}
