import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  CalendarOptions,
  EventClickArg,
  CalendarApi,
  FullCalendarComponent,
  ToolbarInput,
} from '@fullcalendar/angular';
import { TimsheetService } from './timesheet.service';

import { Timesheet } from 'src/app/core/models/timesheet.model';
import { Activity } from 'src/app/core/models/activity.model';
import { TimesheetForm } from 'src/app/core/form/timesheet.form';
import { WorkingDay } from 'src/app/core/models/workingday.model';
import decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { ActivityService } from '../activity/activity.service';
import { QueryOptions } from 'src/app/core/models/query-options';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit, AfterViewInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  @ViewChild('modalShow') modalShow: TemplateRef<any>;
  @ViewChild('fullCalendar') fullCalendarComponent: FullCalendarComponent;

  calendarApi: CalendarApi;

  isFullday = true;
  isPeriod = false;
  mode: string;

  activities: Activity[] = [];

  timesheet: Timesheet;

  timesheetForm: TimesheetForm;
  username: string;

  timesheetOptions: CalendarOptions = {};

  sloading = false;

  activityData: Activity[];
  totalRecords: number;
  totalPages = 1;
  page = 1;
  pageSize = 10;

  searchInput$ = new Subject<string>();

  goToPrevMonth(): void {
    this.calendarApi.prev();
    this._fetchData(this.calendarApi.getDate());
  }

  goToNextMonth(): void {
    this.calendarApi.next();
    this._fetchData(this.calendarApi.getDate());
  }
  saveDraft(): void {
    this.timesheet.status = 'DRAFT';
    this.timsheetService.create(this.timesheet).subscribe(() => {
      this._fetchData(this.calendarApi.getDate());
    });
  }

  submit(): void {
    this.timesheet.status = 'SUBMITTED';
    this.timsheetService.create(this.timesheet).subscribe(() => {
      this._fetchData(this.calendarApi.getDate());
    });
  }

  validate(): void {
    this.timesheet.status = 'VALIDATED';
    this.timsheetService.create(this.timesheet).subscribe(() => {
      this._fetchData(this.calendarApi.getDate());
    });
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.fullCalendarComponent.getApi();

    this._fetchData(this.calendarApi.getDate());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Timesheet', active: true },
    ];
    const token = window.sessionStorage.getItem('auth-token');
    const tokenPayload = decode(token);
    this.username = tokenPayload['user_name'];

    this.searchActivity();
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.mode = 'sEDIT';
    this.timesheetForm = new TimesheetForm();
    if (this.timesheet.status !== 'VALIDATED') {
      const workingDay = this.timesheet.workingDays.filter(
        (data: WorkingDay) => {
          return (
            data.date.toString() === this.formatDate(clickInfo.event.start)
          );
        }
      )[0];
      if (workingDay.afternoonActivity.id === workingDay.morningActivity.id) {
        this.timesheetForm.isFullDay = true;
        this.timesheetForm.activity = workingDay.morningActivity;
      } else {
        this.timesheetForm.isFullDay = false;
        this.timesheetForm.morningActivity = workingDay.morningActivity;
        this.timesheetForm.afternoonActivity = workingDay.afternoonActivity;
      }
      this.timesheetForm.nbrHours = workingDay.workedHoursNumber;
      this.timesheetForm.date = workingDay.date;
      this.modalService.open(this.modalShow);
    }
  }

  constructor(
    private modalService: NgbModal,
    private timsheetService: TimsheetService,
    private activityService: ActivityService,
    private http: HttpClient
  ) {}

  deleteEventData(): void {
    this.modalService.dismissAll();
  }

  dateClick(event?: any): void {
    this.mode = 'sADD';
    const firstCalendarDay = this.calendarApi.getDate();
    firstCalendarDay.setHours(0, 0, 0, 0);
    firstCalendarDay.setDate(1);

    const lastCalendarDay = this.calendarApi.getDate();
    lastCalendarDay.setMonth(firstCalendarDay.getMonth() + 1);
    lastCalendarDay.setDate(0);

    const selectedWorkingDay = this.timesheet.workingDays.filter(
      (data: WorkingDay) => {
        return data.date.toString() === this.formatDate(event.date);
      }
    )[0];

    if (
      ((event.date >= firstCalendarDay && event.date <= lastCalendarDay) ||
        !event.date) &&
      (!selectedWorkingDay ||
        (!selectedWorkingDay.afternoonActivity &&
          !selectedWorkingDay.morningActivity &&
          this.timesheet.status !== 'VALIDATED'))
    ) {
      this.timesheetForm = new TimesheetForm();
      const date: any = event.date;
      date.setMinutes(event.date.getMinutes() - event.date.getTimezoneOffset());
      this.timesheetForm.date = date.toISOString().slice(0, 10);
      this.modalService.open(this.modalShow);
    }
  }

  addModal(): void {
    this.mode = 'gADD';

    this.timesheetForm = new TimesheetForm();

    this.timesheetForm.firstDay = this.timesheet.date.toString();
    const lastDay = new Date(this.timesheetForm.firstDay);
    lastDay.setDate(lastDay.getDate() + this.timesheet.workingDays.length - 1);
    this.timesheetForm.lastDay = lastDay.toISOString().slice(0, 10);
    this.modalService.open(this.modalShow);
  }

  private fetchActivities(page, pageSize): void {
    if (this.totalPages >= page) {
      this.sloading = true;
      this.activityService
        .list(new QueryOptions(page - 1, pageSize))
        .subscribe((data) => {
          this.sloading = false;
          // TODO: object access via string literals is disallowed
          this.activityData = data['content'];
          this.activities = this.activities.concat(this.activityData);
          this.totalRecords = data['totalElements'];
          this.totalPages = data['totalPages'];
        });
    }
  }

  private _fetchData(date: Date): void {
    this.timesheetOptions = {
      customButtons: {
        add: {
          text: 'Add',
        },
        saveDraft: {
          text: 'Save as draft',
        },
        submit: {
          text: 'Submit',
        },
        validate: {
          text: 'Validate',
        },
      },
      themeSystem: 'bootstrap',
    };
    this.timsheetService
      .init(this.username, this.formatDate(date.setDate(1)))
      .subscribe((timesheet: Timesheet) => {
        this.timesheet = timesheet;

        this.timesheetOptions = {
          headerToolbar: {
            center: 'title',
          },
          firstDay: 1,
          initialView: 'dayGridMonth',
          themeSystem: 'bootstrap',
          weekends: true,
          editable: false,
          selectMirror: false,
          dayMaxEvents: true,
          fixedWeekCount: false,
          dateClick: this.dateClick.bind(this),
          dayCellContent: this.dayCellContent.bind(this),
          eventClick: this.handleEventClick.bind(this),
          dayCellDidMount: this.dayCellDidMount.bind(this),
          eventOrder: 'className',
          customButtons: {
            add: {
              text: 'Add',
              click: this.addModal.bind(this),
            },
            saveDraft: {
              text: 'Save as draft',
              click: this.saveDraft.bind(this),
            },
            submit: {
              text: 'Submit',
              click: this.submit.bind(this),
            },
            validate: {
              text: 'Validate',
              click: this.validate.bind(this),
            },
            prev: {
              click: this.goToPrevMonth.bind(this),
            },
            next: {
              click: this.goToNextMonth.bind(this),
            },
          },
        };

        const headerToolbar: boolean | ToolbarInput =
          this.timesheetOptions.headerToolbar;
        // TODO: change to switch
        headerToolbar['left'] = 'add';
        headerToolbar['right'] = 'prev,next';
        if (this.timesheet.status == 'DRAFT') {
          headerToolbar['right'] = 'saveDraft submit ' + headerToolbar['right']; // TODO: to change headerToolbar.right
        }
        if (this.timesheet.status == 'SUBMITTED') {
          headerToolbar['right'] = 'submit validate ' + headerToolbar['right']; // TODO: to change headerToolbar.right
        }
        if (this.timesheet.status == 'VALIDATED') {
          headerToolbar['left'] = null; // TODO: to change headerToolbar.right
        }
        this.calendarApi.setOption('headerToolbar', headerToolbar);

        this.timeSheet2Events();
      });
  }

  private formatDate(date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  saveTimesheet(): void {
    for (const workingDay of this.timesheet.workingDays) {
      if (
        !this.timesheetForm.isPeriod &&
        workingDay.date === this.timesheetForm.date
      ) {
        workingDay.workedHoursNumber = this.timesheetForm.nbrHours;
        if (this.timesheetForm.isFullDay) {
          workingDay.morningActivity = this.timesheetForm.activity;
          workingDay.afternoonActivity = this.timesheetForm.activity;
        } else {
          workingDay.morningActivity = this.timesheetForm.morningActivity;
          workingDay.afternoonActivity = this.timesheetForm.afternoonActivity;
        }
      } else if (
        this.timesheetForm.isPeriod &&
        workingDay.date >= this.timesheetForm.dateFrom &&
        workingDay.date <= this.timesheetForm.dateTo &&
        !workingDay.publicHoliday &&
        ![6, 7].includes(workingDay.dayOfWeek)
      ) {
        workingDay.workedHoursNumber = this.timesheetForm.nbrHours;
        if (this.timesheetForm.isFullDay) {
          workingDay.morningActivity = this.timesheetForm.activity;
          workingDay.afternoonActivity = this.timesheetForm.activity;
        } else {
          workingDay.morningActivity = this.timesheetForm.morningActivity;
          workingDay.afternoonActivity = this.timesheetForm.afternoonActivity;
        }
      }
      if (
        workingDay.date === this.timesheetForm.dateTo ||
        workingDay.date === this.timesheetForm.date
      ) {
        break;
      }
    }
    this.timeSheet2Events();
    this.modalService.dismissAll();
  }

  private dayCellContent(event?: any) {
    const date: any = event.date;
    date.setMinutes(event.date.getMinutes() - event.date.getTimezoneOffset());
    const strDate = date.toISOString().slice(0, 10);
    let customString = '-';
    if (this.timesheet) {
      const workingDays = this.timesheet.workingDays.filter(
        (data: WorkingDay) => {
          return strDate === data.date;
        }
      );

      customString =
        workingDays.length > 0
          ? workingDays[0].publicHoliday
            ? '(' + workingDays[0].publicHoliday.label + ') '
            : workingDays[0].workedHoursNumber + ' hours | '
          : null;
    }

    return customString + event.dayNumberText;
  }

  private dayCellDidMount(event?: any): void {
    const date: any = event.date;
    date.setMinutes(event.date.getMinutes() - event.date.getTimezoneOffset());
    const strDate = date.toISOString().slice(0, 10);
    if (this.timesheet) {
      const workingDays = this.timesheet.workingDays.filter(
        (data: WorkingDay) => {
          return strDate === data.date;
        }
      );
      if (workingDays.length > 0 && workingDays[0].publicHoliday) {
        event.el.className += ' fc-holiday';
      }
    }
  }

  private timeSheet2Events(): void {
    this.timesheetOptions.events = [];
    for (const workingDay of this.timesheet.workingDays) {
      if (workingDay.morningActivity && workingDay.afternoonActivity) {
        this.timesheetOptions.events.push({
          id: workingDay.id ? workingDay.id.toString() : null,
          title: workingDay.morningActivity.label,
          start: workingDay.date,
          className: 'bg-info text-white',
        });
        this.timesheetOptions.events.push({
          id: workingDay.id ? workingDay.id.toString() : null,
          title: workingDay.afternoonActivity.label,
          start: workingDay.date,
          className: 'bg-success text-white',
        });
      }
    }
  }

  compareActivityById(activity1: Activity, activity2: Activity): boolean {
    return activity1 && activity2 && activity1.id === activity2.id;
  }

  goToMonth(date: Date): void {
    this.calendarApi.gotoDate(new Date(date));
    this._fetchData(new Date(date));
  }

  onScrollToEnd(): void {
    this.fetchActivities(this.page++, this.pageSize);
  }

  onScroll({ end }): void {
    if (this.sloading || this.totalRecords <= this.activities.length) {
      return;
    }

    if (end >= this.activities.length) {
      this.fetchActivities(this.page++, this.pageSize);
    }
  }

  // TODO: server side search
  searchActivity(): void {
    this.searchInput$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => this.activityService.search(term))
      )
      .subscribe((data) => {
        this.activityData = data;
        this.activities = this.activityData;
        this.sloading = false;
      });
  }
}
