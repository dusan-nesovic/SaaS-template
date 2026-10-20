// Angular modules
import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';

// Project modules
import { GridCellDirective } from './grid-cell.directive';

export type GridSortValue = string | number | boolean | Date | null | undefined;
export type GridSortDirection = 'asc' | 'desc';

/**
 * Where a cell goes when the grid turns its rows into cards on a phone:
 * - title: first line, takes the free width
 * - aside: first line, on the right (a status pill)
 * - line:  a full-width line of its own (owner, e-mail)
 * - meta:  small items that share the last line, each prefixed with its column name
 * - end:   on the last line, pushed to the right (a row action that must stay reachable)
 * - hidden: not shown on a phone
 */
export type GridMobileSlot = 'title' | 'aside' | 'line' | 'meta' | 'end' | 'hidden';

export interface GridColumn<T = any> {
  // Matches the `appGridCell` template that renders the cell.
  key: string;
  // Translation key of the header; empty for a column without one (row actions).
  headerKey: string;
  // The column is sortable when this is set; the value is what the rows are ordered by.
  sortValue?: (row: T) => GridSortValue;
  align?: 'start' | 'end';
  // Cells stay on one line unless a column opts out.
  wrap?: boolean;
  mobile?: GridMobileSlot;
}

export interface GridSort {
  key: string;
  direction: GridSortDirection;
}

type PageItem = number | 'gap';

/**
 * The studio's table: sortable columns, pagination, and on a phone a card per row. Filtering stays
 * with the page, which hands the grid the rows that pass its filters. Pass a stored array, not a
 * getter that builds a new one: every new array makes the grid sort and slice the rows again.
 */
@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent<T = any> implements OnChanges, AfterContentInit {
  @Input() rows: T[] = [];
  @Input() columns: GridColumn<T>[] = [];
  @Input() defaultSort: GridSort | null = null;
  @Input() pageSizes: number[] = [10, 25, 50];
  @Input() emptyKey = 'GRID.EMPTY';
  @Input() trackBy: (row: T) => unknown = row => (row as any)?.id ?? row;
  // Whether a row reacts to a click (and shows the pointer).
  @Input() clickable = false;

  @Output() rowClick = new EventEmitter<T>();

  @ContentChildren(GridCellDirective) cellTemplates?: QueryList<GridCellDirective>;

  sortKey: string | null = null;
  sortDirection: GridSortDirection = 'asc';
  pageSize = 10;
  page = 1;

  pageRows: T[] = [];
  pageItems: PageItem[] = [];
  pageCount = 1;
  rangeFrom = 0;
  rangeTo = 0;

  private templates = new Map<string, TemplateRef<{ $implicit: T }>>();
  private sortApplied = false;

  // Getters

  get sortableColumns(): GridColumn<T>[] {
    return this.columns.filter(column => !!column.sortValue);
  }

  // Lifecycle

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSizes'] && !this.pageSizes.includes(this.pageSize)) {
      this.pageSize = this.pageSizes[0] ?? 10;
    }

    if (!this.sortApplied && this.defaultSort) {
      this.sortKey = this.defaultSort.key;
      this.sortDirection = this.defaultSort.direction;
      this.sortApplied = true;
    }

    // New rows (a filter, a deleted row) keep the current page; refresh() pulls it back if the
    // rows no longer reach that far.
    this.refresh();
  }

  ngAfterContentInit(): void {
    const collect = () => {
      this.templates.clear();
      this.cellTemplates?.forEach(cell => this.templates.set(cell.key, cell.template));
    };
    collect();
    this.cellTemplates?.changes.subscribe(collect);
  }

  // Public methods

  public templateFor(key: string): TemplateRef<{ $implicit: T }> | null {
    return this.templates.get(key) ?? null;
  }

  public sortBy(key: string | null): void {
    if (key && key === this.sortKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.page = 1;
    this.refresh();
  }

  public toggleDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.page = 1;
    this.refresh();
  }

  public goTo(page: number): void {
    this.page = Math.min(Math.max(page, 1), this.pageCount);
    this.refresh();
  }

  public setPageSize(size: number): void {
    this.pageSize = Number(size);
    this.page = 1;
    this.refresh();
  }

  public onRowClick(row: T): void {
    if (this.clickable) this.rowClick.emit(row);
  }

  public sortIcon(column: GridColumn<T>): string {
    if (column.key !== this.sortKey) return 'pi pi-sort-alt';
    return this.sortDirection === 'asc' ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-amount-down';
  }

  public ariaSort(column: GridColumn<T>): string | null {
    if (!column.sortValue) return null;
    if (column.key !== this.sortKey) return 'none';
    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  public cellClass(column: GridColumn<T>): string {
    return [
      `col-${column.key}`,
      `m-${column.mobile ?? 'meta'}`,
      column.align === 'end' ? 'is-end' : '',
      column.wrap ? '' : 'is-nowrap',
    ].join(' ');
  }

  // A small column name in front of the value, only on a phone, where there is no header row.
  public showMobileLabel(column: GridColumn<T>): boolean {
    return (column.mobile ?? 'meta') === 'meta' && !!column.headerKey;
  }

  // Private methods

  private refresh(): void {
    const sorted = this.sorted();

    this.pageCount = Math.max(1, Math.ceil(sorted.length / this.pageSize));
    this.page = Math.min(this.page, this.pageCount);

    const start = (this.page - 1) * this.pageSize;
    this.pageRows = sorted.slice(start, start + this.pageSize);
    this.rangeFrom = sorted.length ? start + 1 : 0;
    this.rangeTo = start + this.pageRows.length;
    this.pageItems = this.buildPageItems();
  }

  private sorted(): T[] {
    const column = this.columns.find(c => c.key === this.sortKey);
    if (!column?.sortValue) return [...this.rows];

    const value = column.sortValue;
    const factor = this.sortDirection === 'asc' ? 1 : -1;

    return [...this.rows].sort((a, b) => {
      const x = normalize(value(a));
      const y = normalize(value(b));

      // Empty values go last whichever way the column is sorted.
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;

      const result = typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y, undefined, { sensitivity: 'base', numeric: true }) : x < y ? -1 : x > y ? 1 : 0;
      return result * factor;
    });
  }

  // First, last and the pages around the current one; the rest collapse into a gap.
  private buildPageItems(): PageItem[] {
    const pages = new Set<number>([1, this.pageCount, this.page - 1, this.page, this.page + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= this.pageCount).sort((a, b) => a - b);

    const items: PageItem[] = [];
    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) items.push('gap');
      items.push(page);
    });
    return items;
  }
}

function normalize(value: GridSortValue): string | number | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}
