// Project modules
import { Injectable } from "@angular/core";

// Third-party modules
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { Subject } from "rxjs";

@Injectable()
export class ToastService {
  private toastCloseSource = new Subject<void>();
  toastClose$ = this.toastCloseSource.asObservable();
  
  constructor(private messageService: MessageService, private translate: TranslateService) {}

  // Public methods

  public notifyToastClose() {
    this.toastCloseSource.next();
  }

  /**
   * The usual way to raise a toast: both halves are i18n keys, so the message
   * follows the language the user picked. `addToastMessage` stays for text
   * that is already in its final form - a validation message from the API, for
   * instance, which the client cannot translate.
   */
  public addToastKey(severity: string, summaryKey: string, detailKey: string, life: number = 1000) {
    this.addToastMessage(severity, this.translate.instant(summaryKey), this.translate.instant(detailKey), life);
  }

  public addToastMessage(severity: string, summary: string, detail: string, life: number = 1000) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life
    });
  }
}