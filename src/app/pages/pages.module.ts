import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PagesRoutingModule } from './pages-routing.module';
import { ClientModule } from './clients/client.module';
import { UIModule } from '../shared/ui/ui.module';
import { UserModule } from './users/user.module';
import { RoletModule } from './roles/role.module';
import { PublicholidayModule } from './publicholidays/publicholiday.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { ActivityModule } from './activity/activity.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationValueComponent } from './configuration-value/configuration-value.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from '../core/services/language.service';
import { ConfigurationPopupComponent } from './configuration/configuration-popup/configuration-popup.component';
import {ConfigurationModule} from "./configuration/configuration.module";
import {ConfigurationValueModule} from "./configuration-value/configuration-value.module";



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3,
};
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ClientModule,
    UserModule,
    RoletModule,
    ConfigurationModule,
    PublicholidayModule,
    ConfigurationValueModule,
    UIModule,
    PerfectScrollbarModule,
    TimesheetModule,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    TranslateModule,
    ActivityModule

  ],
  providers: [
    LanguageService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class PagesModule {}
