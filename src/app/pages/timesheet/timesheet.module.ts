import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';

import { TimesheetComponent } from './timesheet.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin,
]);

@NgModule({
  declarations: [TimesheetComponent],
  imports: [
    CommonModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
})
export class TimesheetModule {}
