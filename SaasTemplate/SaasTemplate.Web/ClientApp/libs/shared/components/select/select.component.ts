import { Component, ElementRef, forwardRef, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AppSelectComponent),
    multi: true
  }]
})
export class AppSelectComponent implements ControlValueAccessor, OnDestroy {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = '—';

  isOpen = false;
  openUpward = false;

  /**
   * The open list is positioned in viewport coordinates and rendered `fixed`.
   *
   * It used to be absolutely positioned inside the control, which meant any
   * ancestor that scrolls - the horizontal wrapper around a table, above all -
   * clipped it, and the options could only be reached by scrolling the table
   * itself. A larger z-index does not help with that: the list was not behind
   * anything, it was cut off. Taking it out of the flow is what fixes it.
   */
  panelStyle: { [key: string]: string } = {};

  private _value: any = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  /* Bound in the capture phase on `document`, because scroll does not bubble:
     the control usually sits inside a scrolling container - the studio's
     content column, a table wrapper - and only capture sees those. */
  private readonly onAncestorScroll = () => {
    if (this.isOpen) {
      this.zone.run(() => this.positionPanel());
    }
  };

  constructor(private elRef: ElementRef, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('scroll', this.onAncestorScroll, true);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.onAncestorScroll, true);
  }

  // Getters

  get displayLabel(): string {
    const match = this.options.find(o => o.value === this._value);
    return match?.label ?? this.placeholder;
  }

  get hasValue(): boolean {
    return this.options.some(o => o.value === this._value);
  }

  // Public methods

  isSelected(option: SelectOption): boolean {
    return option.value === this._value;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.positionPanel();
    }
    this.onTouched();
  }

  select(option: SelectOption): void {
    this._value = option.value;
    this.isOpen = false;
    this.onChange(option.value);
  }

  // Host listeners

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.isOpen = false;
  }

  @HostListener('window:resize')
  onViewportResize(): void {
    if (this.isOpen) {
      this.positionPanel();
    }
  }

  // ControlValueAccessor

  writeValue(value: any): void {
    this._value = value ?? null;
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  // Private methods

  private positionPanel(): void {
    const rect: DOMRect = this.elRef.nativeElement.getBoundingClientRect();
    const maxPanelHeight = 224; // Matches `max-height` on the list.
    const spaceBelow = window.innerHeight - rect.bottom;

    this.openUpward = spaceBelow < maxPanelHeight && rect.top > spaceBelow;

    this.panelStyle = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      // Overlapping the control's own border by a pixel keeps the two joined.
      ...(this.openUpward
        ? { bottom: `${window.innerHeight - rect.top - 1}px` }
        : { top: `${rect.bottom - 1}px` }),
      // However deep the control sits, the list is never far enough down the
      // page for the room below to be guessed wrong.
      maxHeight: `${Math.max(120, (this.openUpward ? rect.top : spaceBelow) - 8)}px`,
    };
  }
}
