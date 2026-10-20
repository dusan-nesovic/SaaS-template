import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AppDatepickerComponent),
    multi: true
  }]
})
export class AppDatepickerComponent implements ControlValueAccessor {
  /** Falls back to the translated "Select a Date" when the caller gives none. */
  @Input() placeholder?: string;

  isOpen = false;
  openUpward = false;
  value: Date | null = null;

  viewYear: number = new Date().getFullYear();
  viewMonth: number = new Date().getMonth();

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  /** Month and weekday names per locale, built once and kept. */
  private static readonly namesByLocale = new Map<string, { months: string[]; weekdays: string[] }>();

  constructor(private elRef: ElementRef, private translate: TranslateService) {}

  // Getters

  get displayPlaceholder(): string {
    return this.placeholder ?? this.translate.instant('SELECT_DATE');
  }

  /**
   * A BCP-47 tag, not the two-letter language: plain `sr` renders the months in
   * Cyrillic, while the app is written in Latin - which is exactly what the
   * `DATE_LANGUAGE` key in each translation file spells out.
   */
  private get locale(): string {
    const tag = this.translate.instant('DATE_LANGUAGE');
    return typeof tag === 'string' && tag !== 'DATE_LANGUAGE' ? tag : 'en';
  }

  get weekdays(): string[] {
    return this.names.weekdays;
  }

  private get names(): { months: string[]; weekdays: string[] } {
    const locale = this.locale;
    let cached = AppDatepickerComponent.namesByLocale.get(locale);

    if (!cached) {
      const month = new Intl.DateTimeFormat(locale, { month: 'long' });
      const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });

      cached = {
        months: Array.from({ length: 12 }, (_, m) => month.format(new Date(2021, m, 1))),
        // 4 Jan 2021 was a Monday, and the grid below is Monday-first.
        weekdays: Array.from({ length: 7 }, (_, d) => weekday.format(new Date(2021, 0, 4 + d))),
      };
      AppDatepickerComponent.namesByLocale.set(locale, cached);
    }

    return cached;
  }

  get displayValue(): string {
    if (!this.value) return '';
    return new Intl.DateTimeFormat(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(this.value);
  }

  get monthLabel(): string {
    return `${this.names.months[this.viewMonth]} ${this.viewYear}`;
  }

  get calendarDays(): (number | null)[] {
    const firstDow = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    // Monday-first: Sunday (0) → offset 6, Mon (1) → 0, etc.
    const offset = (firstDow + 6) % 7;
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // Pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      const rect = this.elRef.nativeElement.getBoundingClientRect();
      this.openUpward = window.innerHeight - rect.bottom < 360;
      if (this.value) {
        this.viewYear = this.value.getFullYear();
        this.viewMonth = this.value.getMonth();
      }
    }
    this.onTouched();
  }

  prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
  }

  nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
  }

  selectDay(day: number | null): void {
    if (!day) return;
    this.value = new Date(this.viewYear, this.viewMonth, day);
    this.onChange(this.value);
    this.isOpen = false;
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.value) return false;
    return (
      this.value.getDate() === day &&
      this.value.getMonth() === this.viewMonth &&
      this.value.getFullYear() === this.viewYear
    );
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const t = new Date();
    return t.getDate() === day && t.getMonth() === this.viewMonth && t.getFullYear() === this.viewYear;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.isOpen = false; }

  writeValue(value: Date | string | null | undefined): void {
    if (!value) { this.value = null; return; }
    const d = new Date(value);
    this.value = isNaN(d.getTime()) ? null : d;
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
