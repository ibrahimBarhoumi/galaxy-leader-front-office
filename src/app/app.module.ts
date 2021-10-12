import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LayoutsModule } from './layouts/layouts.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import {CommonModule} from '@angular/common';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';


export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbDropdownModule,
    ClickOutsideModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
