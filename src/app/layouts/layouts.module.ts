import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';


import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/services/language.service';
import { HorizontaltopbarComponent } from './horizontaltopbar/horizontaltopbar.component';
import { UIModule } from '../shared/ui/ui.module';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { LoaderService } from '../core/services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from '../core/services/loader-interceptor.service';


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LayoutComponent, FooterComponent,   HorizontalComponent,HorizontaltopbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    ClickOutsideModule,
    UIModule,
    PerfectScrollbarModule
  ],
  providers: [LanguageService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }]
})
export class LayoutsModule { }
