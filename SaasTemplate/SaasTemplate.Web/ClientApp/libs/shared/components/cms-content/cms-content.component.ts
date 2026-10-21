// Angular modules
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

const ACTIONS_TOP_GAP = 12;

@Component({
  selector: 'app-cms-content',
  templateUrl: './cms-content.component.html',
  styleUrls: ['./cms-content.component.scss'],
})
export class CmsContentComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Input() description = '';

  @ViewChild('sentinel') sentinel?: ElementRef<HTMLElement>;
  @ViewChild('headWrap') headWrap?: ElementRef<HTMLElement>;
  @ViewChild('actions') actions?: ElementRef<HTMLElement>;

  isStuck = false;
  hasActions = false;

  // How far the header may scroll up before it sticks: everything above the
  // buttons. On a phone that lets the title and description leave the screen
  // while the buttons stay pinned (see the mobile rules in the stylesheet).
  actionsOffset = 0;

  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.sentinel) return;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isStuck = !entry.isIntersecting;
      },
      { threshold: 0 }
    );
    this.observer.observe(this.sentinel.nativeElement);

    if (this.headWrap) {
      this.resizeObserver = new ResizeObserver(() => this.measureActions());
      this.resizeObserver.observe(this.headWrap.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  // Private methods

  private measureActions(): void {
    const actions = this.actions?.nativeElement;
    const headWrap = this.headWrap?.nativeElement;
    if (!actions || !headWrap) return;

    const hasActions = actions.childElementCount > 0;
    // Measured against the header itself, not offsetTop: the header only becomes the buttons' offset
    // parent once it is sticky. A little of its top padding stays visible above the buttons.
    const distance = actions.getBoundingClientRect().top - headWrap.getBoundingClientRect().top;
    const offset = Math.max(0, Math.round(distance) - ACTIONS_TOP_GAP);

    if (hasActions !== this.hasActions || offset !== this.actionsOffset) {
      this.hasActions = hasActions;
      this.actionsOffset = offset;
      this.changeDetector.detectChanges();
    }
  }
}
