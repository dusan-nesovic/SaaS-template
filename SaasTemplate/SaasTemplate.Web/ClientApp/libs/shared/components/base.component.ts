// Angular modules
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// Third-party modules
import { BehaviorSubject, takeUntil } from 'rxjs';

// Project modules
import { Unsubscribe } from '@Workspace/common';
import { LoadingSpinnerService } from '@Workspace/services';

export class BaseComponent extends Unsubscribe {
  protected routeId = new BehaviorSubject<string | null>(null);
  private id: string | null;

  constructor(protected loadingSpinnerService: LoadingSpinnerService, protected router: Router, protected route: ActivatedRoute) {
    super();
    this.entityIdSubscription();
  }

  // Getters

  protected get entityId(): string | null {
    return this.id;
  }

  protected get entityIdStringified(): string | null {
    return this.id ? JSON.stringify(this.id) : null;
  }

  // Private methods

  private entityIdSubscription() {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params: ParamMap) => {
      const newId = params.get('id');
      this.routeId.next(newId);
    });

    this.routeId.pipe(takeUntil(this.unsubscribe$)).subscribe((id: string | null) => {
      this.id = id;
    });
  }
}
