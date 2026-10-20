// Angular modules
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Third-party modules
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Project modules
import { AuthService, LoadingSpinnerService, ToastService } from '@Workspace/services';

interface ApiErrorPayload {
  statusCode?: number;
  message?: string;
  errors?: { [propertyName: string]: string[] };
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private loadingSpinnerService: LoadingSpinnerService,
    private translate: TranslateService
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((response: HttpErrorResponse) => {
        this.loadingSpinnerService.takeLoadingSpinner();
        this.showToastFor(response);

        // The token expired or was issued before a change to its contents - a new sign-in is the only way out.
        if (response.status === 401 && this.authService.isAuthenticated()) {
          this.authService.logout();
        }

        return throwError(() => response);
      })
    );
  }

  private showToastFor(response: HttpErrorResponse): void {
    // Network / CORS / browser-level failure — no HTTP response body.
    if (response.status === 0) {
      this.toastService.addToastKey('error', 'TOAST.NETWORK_ERROR', 'TOAST.NETWORK_ERROR_DETAIL');
      return;
    }

    const payload = this.parsePayload(response);
    const summary = this.translate.instant(this.summaryKeyFor(response.status));
    const severity = response.status >= 500 ? 'error' : 'warn';

    if (payload?.errors && Object.keys(payload.errors).length > 0) {
      this.toastService.addToastMessage(severity, summary, this.formatValidationErrors(payload.errors));
      return;
    }

    const detail = payload?.message || response.message || this.translate.instant('TOAST.UNEXPECTED_ERROR');
    this.toastService.addToastMessage(severity, summary, detail);
  }

  private parsePayload(response: HttpErrorResponse): ApiErrorPayload | null {
    if (!response.error) return null;
    if (typeof response.error === 'string') {
      try {
        return JSON.parse(response.error) as ApiErrorPayload;
      } catch {
        return null;
      }
    }
    return response.error as ApiErrorPayload;
  }

  private formatValidationErrors(errors: { [propertyName: string]: string[] }): string {
    return Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
  }

  private summaryKeyFor(status: number): string {
    if (status === 400) return 'TOAST.INVALID_REQUEST';
    if (status === 401) return 'TOAST.UNAUTHORIZED';
    if (status === 403) return 'TOAST.FORBIDDEN';
    if (status === 404) return 'TOAST.NOT_FOUND';
    if (status >= 500) return 'TOAST.SERVER_ERROR';
    return 'TOAST.ERROR';
  }
}
