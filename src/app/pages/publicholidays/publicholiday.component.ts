import {Component, OnInit, ViewChildren, QueryList, ViewChild} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {Observable, Subject} from 'rxjs';
import { Publicholiday } from '../../core/models/publicholiday.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublicholidayService } from './publicholiday.service';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ISearchRequest} from "../../core/models/search-request.model";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {takeUntil} from "rxjs/operators";
import {PublicholidaysDialogComponent} from "./publicholidays-dialog/publicholidays-dialog.component";
import {LoadingService} from "../../core/services/loadingscreen.service";

@Component({
  selector: 'app-publicholidaytable',
  templateUrl: './publicholiday.component.html',
  styleUrls: ['./publicholiday.component.scss'],
  providers: [DecimalPipe],
})

/**
 * Publicholiday component
 */
export class PublicholidayComponent implements OnInit {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Publicholiday data
  publicholidayData: Publicholiday[];
  public selected: any;
  hideme: boolean[] = [];
  publicholidays$: Observable<Publicholiday[]>;
  total$: Observable<number>;

  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;


  selectedPublicholiday: Publicholiday;
  public isCollapsed = true;
  protected _onDestroy = new Subject<void>();
  publicHolidayDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: ['label', 'date', 'actions'],
    allColumnsName: ['label', 'date', 'actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private publicholidayService: PublicholidayService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Administration'},
      {label: 'publicholiday', active: true},
    ];
    this.initpublicHolidayDataSource();
    this.initFilterForm();
  }

  initpublicHolidayDataSource(): void {
    this.publicHolidayDataSource.dataSource.paginator = this.paginator;
    this.loadConfigurationData();
  }

  initFilterForm(): void {
    this.publicHolidayDataSource.filterForm = this.publicholidayService.createFilterForm();
    this.onResetSearchFilter();
  }

  onResetSearchFilter(): void {
    this.publicholidayService.resetSearchFilter(this.publicHolidayDataSource.filterForm);
    this.loadSearchResult();
  }

  paginate(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex, size: event.pageSize
      }, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadConfigurationData();
    });
  }

  onSearch(): void {
    this.loadSearchResult();
  }

  loadSearchResult(): void {
    const queries = this.publicholidayService.prepareQueryParam(this.publicHolidayDataSource.filterForm);
    this.router.navigate([], {
      queryParams: queries, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadConfigurationData();
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
    this.publicHolidayDataSource.filterForm.get([fieldName]).setValue('');
    this.loadSearchResult();
  }

  getPageSize(): number {
    const pageSize = this.activatedRoute.snapshot.queryParams.size;
    return pageSize > 0 ? pageSize : 10;
  }

  loadConfigurationData(): void {
    const pageCriteria: ISearchRequest = {
      page: this.getPageIndex(), size: this.getPageSize(),
    };
    const inputs = this.publicholidayService.prepareSearchCriteria();
    console.log('load search result');
    this.getBulkSearchRuleRole(pageCriteria, inputs);
  }

  getBulkSearchRuleRole(pageCriteria: ISearchRequest, inputs: Map<string, string>): void {
    this.publicholidayService.bulkSearchPublicHoliday(pageCriteria, inputs).then(page => {
      this.publicHolidayDataSource.dataSource.data = page.content;
      this.publicHolidayDataSource.page = page;
    });
  }

  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    this.dialog.open(PublicholidaysDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_CREATE');
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initpublicHolidayDataSource();
      }, 700),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });


  }

  onEdit(i: number, e: Publicholiday): void {
    this.publicholidayService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(PublicholidaysDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_UPDATED')
      setTimeout(() => {
        this.initpublicHolidayDataSource();
      }, 700),
        () => {
        },
        () => {

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
    dialogRef.componentInstance.message = this.translateService.instant('HEADER.PUBLICHOLIDAY.MODAL.MESSAGE');
    dialogRef.componentInstance.confirmButtonLabel = this.translateService.instant('DELETE.CONFIRM');
    dialogRef.componentInstance.cancelButtonLabel = this.translateService.instant('DELETE.CANCEL');
    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(isDeleteConfirmed => {
      if (!isDeleteConfirmed) {
        return;
      }
      this.publicholidayService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.publicHolidayDataSource.dataSource.data.splice(i, 1);
        this.publicHolidayDataSource.dataSource.connect().next(this.publicHolidayDataSource.dataSource.data);
        this.publicHolidayDataSource.page.totalElements -= 1;
        this.loadConfigurationData();
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

  ngOnDestroy(): void {

  }
    onSynchronising()
    {
      this.publicholidayService.sync().subscribe(() => {
        this.initpublicHolidayDataSource();
      });

    }

}
