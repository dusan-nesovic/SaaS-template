// Angular modules
import { Injectable } from '@angular/core';

// Third-party modules
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingSpinnerService {
  private loadingCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  isLoading$ = this.isLoadingSubject.asObservable();

  // Public methods

  public addLoadingSpinner(): void {
    this.loadingCount++;
    this.updateLoadingState();
  }

  public takeLoadingSpinner(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    this.updateLoadingState();
  }

  // Private methods

  private updateLoadingState(): void {
    this.isLoadingSubject.next(this.loadingCount > 0);
  }
}
