// Angular modules
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Third-party modules
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';

// Project modules
import * as controllers from '@Workspace/_generated/services';
import { AddLoadingSpinnerDirective } from '@Workspace/directives';
import { ContentTypeInterceptor, AuthenticationInterceptor, HttpErrorInterceptor } from '@Workspace/interceptors';
import {
  LoadingSpinnerService,
  ErrorHandlerService,
  SettingsService,
  AuthService,
  ToastService,
  ThemeService,
  LanguageService,
} from '@Workspace/services';
import { SharedModule } from '@Workspace/shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    MainPageComponent,
    // Directives
    AddLoadingSpinnerDirective,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    // Controllers
    controllers.DashboardController,
    // Services
    AuthService,
    ConfirmationService,
    LanguageService,
    LoadingSpinnerService,
    MessageService,
    SettingsService,
    ThemeService,
    ToastService,
    // Providers
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { verticalPosition: 'top', horizontalPosition: 'center' } },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
