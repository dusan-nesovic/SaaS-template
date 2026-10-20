// Third-party modules
import { finalize, Observable } from 'rxjs';

// Project modules
import { LoadingSpinnerService } from '@Workspace/services';

// Wraps an observable to show a loading spinner while the operation is in progress
export function withSpinner<T>(loadingSpinnerService: LoadingSpinnerService): (source$: Observable<T>) => Observable<T> {
  return (source$: Observable<T>) => {
    loadingSpinnerService.addLoadingSpinner();
    return source$.pipe(
      finalize(() => {
        loadingSpinnerService.takeLoadingSpinner();
      })
    );
  };
}

// Converts an ArrayBuffer to a base64-encoded image string (data URL)
export function convertArrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:image/jpeg;base64,' + window.btoa(binary);
}
