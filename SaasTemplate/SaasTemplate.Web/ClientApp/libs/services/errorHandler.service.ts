import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoadingSpinnerService } from '@Workspace/services';

/**
 * Global fallback handler for non-HTTP runtime errors.
 * HTTP errors are handled by HttpErrorInterceptor; if one slips through
 * (e.g. uncaught in a component), we still hide the spinner and warn the user.
 */
@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private loadingSpinnerService: LoadingSpinnerService, private messageService: MessageService) {}

  public handleError(error: unknown): void {
    console.error('Unhandled error:', error);
    this.loadingSpinnerService.takeLoadingSpinner();

    // A rejected promise arrives wrapped, with the original error in `rejection`.
    const { rejection, message } = (error ?? {}) as { rejection?: unknown; message?: string };

    // HTTP errors are already toasted by HttpErrorInterceptor — skip double-toast.
    if (error instanceof HttpErrorResponse || rejection instanceof HttpErrorResponse) {
      return;
    }

    const detail = message ?? 'An unexpected error has occurred.';
    this.messageService.add({ severity: 'error', summary: 'Application error', detail });
  }
}
