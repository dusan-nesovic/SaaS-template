import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';
import { noop } from 'rxjs';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AppTimepickerComponent),
    multi: true
  }]
})
export class AppTimepickerComponent implements ControlValueAccessor {
  /** Falls back to the translated "Pick a Time" when the caller gives none. */
  @Input() placeholder?: string;

  isOpen = false;
  openUpward = false;
  selectedHour: number | null = null;
  selectedMinute: number | null = null;

  private _baseDate: Date | null = null;
  private onChange: (value: Date | null) => void = noop;
  private onTouched: () => void = noop;

  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  constructor(private elRef: ElementRef, private translate: TranslateService) {}

  // Getters

  get displayPlaceholder(): string {
    return this.placeholder ?? this.translate.instant('PICK_TIME');
  }

  get displayValue(): string {
    if (this.selectedHour === null || this.selectedMinute === null) return '';
    return `${pad(this.selectedHour)}:${pad(this.selectedMinute)}`;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      const rect = this.elRef.nativeElement.getBoundingClientRect();
      this.openUpward = window.innerHeight - rect.bottom < 280;
    }
    this.onTouched();
  }

  pickHour(h: number): void {
    this.selectedHour = h;
    this.emitIfComplete();
  }

  pickMinute(m: number): void {
    this.selectedMinute = m;
    this.emitIfComplete();
  }

  confirm(): void {
    this.isOpen = false;
  }

  padNum(n: number): string {
    return pad(n);
  }

  private emitIfComplete(): void {
    if (this.selectedHour === null || this.selectedMinute === null) return;
    const d = this._baseDate ? new Date(this._baseDate) : new Date();
    d.setHours(this.selectedHour, this.selectedMinute, 0, 0);
    this.onChange(d);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.isOpen = false; }

  writeValue(value: Date | null | undefined): void {
    if (!value) {
      this._baseDate = null;
      this.selectedHour = null;
      this.selectedMinute = null;
      return;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    this._baseDate = d;
    this.selectedHour = d.getHours();
    const rounded = Math.round(d.getMinutes() / 5) * 5;
    this.selectedMinute = rounded === 60 ? 55 : rounded;
  }

  registerOnChange(fn: (value: Date | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}
