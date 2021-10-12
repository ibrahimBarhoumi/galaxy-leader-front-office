import {Component, OnInit, ViewChildren, QueryList, OnDestroy, ViewChild} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { Activity } from '../../core/models/activity.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityService } from './activity.service';
import { QueryOptions } from 'src/app/core/models/query-options';
import { ClientService } from '../clients/client.service';
import { Client } from 'src/app/core/models/client.model';
import {
  catchError,
  distinctUntilChanged,
  switchMap, takeUntil,
  tap,
} from 'rxjs/operators';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ISearchRequest} from "../../core/models/search-request.model";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Publicholiday} from "../../core/models/publicholiday.model";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivityDialogComponent} from "./activity-dialog/activity-dialog.component";
import {LoadingService} from "../../core/services/loadingscreen.service";

@Component({
  selector: 'app-activitytable',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [DecimalPipe],
})

/**
 * Activity component
 */
export class ActivityComponent implements OnInit,OnDestroy {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Activity data
  activityData: Activity[];
  public selected: any;
  hideme: boolean[] = [];
  activitie$: Observable<Activity[]>;
  clients$: Observable<Client[]>;
  clientInput$ = new Subject<string>();
  total$: Observable<number>;
  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;
  selectedActivity: Activity;
  clients: Client[] = [];
  client: Client;
  public isCollapsed = true;
  clientLoading = false;
  subscription: Subscription;
  protected _onDestroy = new Subject<void>();
  activityDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: ['label', 'nature','startDate','endDate','isCommon','client', 'actions'],
    allColumnsName: ['label', 'nature','startDate','endDate','isCommon','client', 'actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private activityService: ActivityService,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Activity', active: true },
    ];

    this._fetchData();
    this.loadPeople();
    this.initActivityDataSource();
    this.initFilterForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * fetches the table value
   */
  _fetchData(): void {
    this.subscription = this.activityService
      .list(new QueryOptions(this.page - 1, this.pageSize))
      .subscribe((data) => {
        // TODO: object access via string literals is disallowed
        this.activityData = data['content'];
        this.totalRecords = data['totalElements'];
        this.totalPages = data['totalPages'];
        this.pageSize = data['size'];
      });
  }

  onPageChange(): void {
    this._fetchData();
  }

  openModal(
    activityModal: any,
    mode: string,
    selectedActivity: Activity
  ): void {
    this.modalService.open(activityModal, {
      centered: true,
      windowClass: 'modal-holder',
    });
    this.mode = mode;
    this.selectedActivity = selectedActivity;
  }

  addOrUpdateActivity(activityModal: any): void {
    if (this.mode === 'Edit') {
      this.selectedActivity.client = this.client;
      this.subscription = this.activityService
        .update(this.selectedActivity)
        .subscribe(() => {
          this.modalService.dismissAll(activityModal);
          this._fetchData();
        });
    } else if (this.mode === 'Create') {
      this.selectedActivity.client = this.client;
      this.subscription = this.activityService
        .create(this.selectedActivity)
        .subscribe(() => {
          this.modalService.dismissAll(activityModal);
          this._fetchData();
        });
    }
  }

  onPageSizeChange(): void {
    this.page = 1;
    this._fetchData();
  }

  deleteActivity(activity: Activity): void {
     this.activityService
      .delete(activity.id)
      .then(() => {
        this._fetchData();
      });
  }
  getClients(companyName: string): void {
    this.subscription = this.clientService
      .search(companyName)
      .subscribe((data) => {
        this.clients = data;
      });
  }

  private loadPeople(): void {
    this.clients$ = concat(
      of([]), // default items
      this.clientInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.clientLoading = true)),
        switchMap((term) =>
          this.clientService.search(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.clientLoading = false))
          )
        )
      )
    );
  }
  trackByFn(item: Client): boolean {
    return item.foreign;
  }
  initActivityDataSource(): void {
    this.activityDataSource.dataSource.paginator = this.paginator;
    this.loadActivityData();
  }

  initFilterForm(): void {
    this.activityDataSource.filterForm = this.activityService.createFilterForm();
    this.onResetSearchFilter();
  }

  onResetSearchFilter(): void {
    this.activityService.resetSearchFilter(this.activityDataSource.filterForm);
    this.loadSearchResult();
  }

  paginate(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex, size: event.pageSize
      }, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadActivityData();
    });
  }

  onSearch(): void {
    this.loadSearchResult();
  }

  loadSearchResult(): void {
    const queries = this.activityService.prepareQueryParam(this.activityDataSource.filterForm);
    this.router.navigate([], {
      queryParams: queries, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadActivityData();
    });
  }

  getPageIndex(): number {
    const pageIndex = this.activatedRoute.snapshot.queryParams.page;
    return pageIndex > 0 ? pageIndex : 0;
  }

  resetSearch(key): void {
    if (key === '') {
      this.loadSearchResult();
    }
  }

  onClearSearchFormFiled(fieldName: string): void {
    this.activityDataSource.filterForm.get([fieldName]).setValue('');
    this.loadSearchResult();
  }

  getPageSize(): number {
    const pageSize = this.activatedRoute.snapshot.queryParams.size;
    return pageSize > 0 ? pageSize : 10;
  }

  loadActivityData(): void {
    const pageCriteria: ISearchRequest = {
      page: this.getPageIndex(), size: this.getPageSize(),
    };
    const inputs = this.activityService.prepareSearchCriteria();
    console.log('load search result');
    this.getBulkSearchRuleActivity(pageCriteria, inputs);
  }

  getBulkSearchRuleActivity(pageCriteria: ISearchRequest, inputs: Map<string, string>): void {
    this.activityService.bulkSearchActivities(pageCriteria, inputs).then(page => {
      this.activityDataSource.dataSource.data = page.content;
      this.activityDataSource.page = page;
    });
  }

  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    this.dialog.open(ActivityDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.loadingService.startLoading();
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initActivityDataSource();
      }, 300),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });
    ;

  }

  onEdit(i: number, e: Publicholiday): void {
    this.activityService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(ActivityDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_UPDATED')
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initActivityDataSource();
      }, 250),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });

  }

  onDelete(i: number, e: Publicholiday): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      width: '500px',
    });
    dialogRef.componentInstance.title = this.translateService.instant('DELETE.TITLE');
    dialogRef.componentInstance.message = this.translateService.instant('HEADER.ACTIVITY.MODAL.MESSAGE');
    dialogRef.componentInstance.confirmButtonLabel = this.translateService.instant('DELETE.CONFIRM');
    dialogRef.componentInstance.cancelButtonLabel = this.translateService.instant('DELETE.CANCEL');
    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(isDeleteConfirmed => {
      if (!isDeleteConfirmed) {
        return;
      }
      this.activityService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.activityDataSource.dataSource.data.splice(i, 1);
        this.activityDataSource.dataSource.connect().next(this.activityDataSource.dataSource.data);
        this.activityDataSource.page.totalElements -= 1;
        this.loadActivityData();
      });
    });
  }

  showSnackBar(key: string): void {
    const snackBarConfigs: any[] = [
      {
        key: 'SUCCESS_DELETE',
        panelClass: ['red-700'],
        message: '{{configCodeName}} was deleted successfully',
        messageI18nKey: 'DELETE.TOASTMESSAGE',
      },
      {
        key: 'SUCCESS_CREATE',
        panelClass: ['green-snackbar'],
        message: '{{configCodeName}} was deleted successfully',
        messageI18nKey: 'DELETE.TOASTMESSAGECREATE',
      },
      {
        key: 'SUCCESS_UPDATED',
        panelClass: ['blue-snackbar'],
        message: '{{configCodeName}} was deleted successfully',
        messageI18nKey: 'DELETE.TOASTMESSAGEUPDATE',
      }

    ];
    const currentConfig = snackBarConfigs.filter(item => item.key === key)[0];
    if (!!currentConfig && key==='SUCCESS_DELETE') {
      this.snackBar.open(this.translateService.instant(currentConfig.messageI18nKey, {
        configCodeName: this.translateService.instant(`CODE_LABEL_CONFIG.CONFIG_CODES.ASSET_CATALOG`)
      }), '', {
        duration: 15000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['red-700']
      });
    }else if (!!currentConfig && key ==='SUCCESS_CREATE'){
      this.snackBar.open(this.translateService.instant(currentConfig.messageI18nKey, {
        configCodeName: this.translateService.instant(`CODE_LABEL_CONFIG.CONFIG_CODES.ASSET_CATALOG`)
      }), '', {
        duration: 4000,
        horizontalPosition:'right',
        verticalPosition: 'top',
        panelClass: ['green-snackbar']
      });
    }else if (!!currentConfig && key ==='SUCCESS_UPDATED'){
      this.snackBar.open(this.translateService.instant(currentConfig.messageI18nKey, {
        configCodeName: this.translateService.instant(`CODE_LABEL_CONFIG.CONFIG_CODES.ASSET_CATALOG`)
      }), '', {
        duration: 4000,
        horizontalPosition:'right',
        verticalPosition: 'top',
        panelClass: ['blue-snackbar']
      });
    }

  }

}
