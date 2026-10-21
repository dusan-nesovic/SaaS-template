// Angular modules
import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

// Third-party modules
import { Subscription } from 'rxjs';

// Project modules
import { LoadingSpinnerService } from '@Workspace/services';

@Directive({
  selector: '[appLoadingSpinner]',
})
export class AddLoadingSpinnerDirective implements OnDestroy {
  private sub: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2, private loadingSpinnerService: LoadingSpinnerService) {
    this.initializeConstructor();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Private methods

  private initializeConstructor() {
    this.sub = this.loadingSpinnerService.isLoading$.subscribe((isLoading: boolean) => {
      if (isLoading) {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-block'); 
        this.renderer.addClass(this.el.nativeElement, 'loading-spinner');
        this.renderer.addClass(this.el.nativeElement, 'lds-ring');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
        this.renderer.removeClass(this.el.nativeElement, 'loading-spinner');
        this.renderer.removeClass(this.el.nativeElement, 'lds-ring');
      }
    });
  }
}
