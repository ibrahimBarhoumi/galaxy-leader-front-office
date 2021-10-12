import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Configuration } from 'src/app/core/models/configuration.model';
import { QueryOptions } from 'src/app/core/models/query-options';
import { ConfigurationService } from './configuration.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Client, IClientSearchRequest} from "../../core/models/client.model";
import {ISearchRequest} from "../../core/models/search-request.model";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UsersPopupComponent} from "../users/users-popup/users-popup.component";
import {ConfigurationPopupComponent} from "./configuration-popup/configuration-popup.component";
import {ClientOperationsComponent} from "../clients/client-operations/client-operations.component";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {takeUntil} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {LoadingService} from "../../core/services/loadingscreen.service";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  // Configuration data
  configurationData: Configuration[];
  protected _onDestroy = new Subject<void>();
  public selected: any;
  configuration : Configuration ;
  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;
  selectedConfiguration: Configuration;
  public isCollapsed = true;
  configurationDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: [ 'code' ,'label','actions'],
    allColumnsName: [ 'code' ,'label','actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private modalService: NgbModal,
              private configurationService: ConfigurationService ,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private snackBar: MatSnackBar,
              private loadingService: LoadingService,
) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Configuration', active: true },
    ];
    this.initConfigurationDataSource();
    this.initFilterForm();
  }

  initConfigurationDataSource(): void {
    this.configurationDataSource.dataSource.paginator = this.paginator;
    this.loadConfigurationData();
  }
  initFilterForm(): void {
    this.configurationDataSource.filterForm = this.configurationService.createFilterForm();
    this.onResetSearchFilter();
  }
  onResetSearchFilter(): void {
    this.configurationService.resetSearchFilter(this.configurationDataSource.filterForm);
    this.loadSearchResult();
  }

  openModal(configurationModal: any, mode: string, selectedConfiguration: Configuration) {
    this.modalService.open(configurationModal, {
      centered: true,
      windowClass: 'modal-holder',
    });
    console.log(selectedConfiguration)
    this.mode = mode;
    this.selectedConfiguration= selectedConfiguration;
  }

  addOrUpdateConfiguration(configurationModal: any) {
    console.log(this.selectedConfiguration)
    if (this.mode === 'Edit') {
      this.configurationService.update(this.selectedConfiguration).subscribe(() => {
        this.modalService.dismissAll(configurationModal);
        location.reload()
      });

    }
    else if (this.mode === 'Create'){
      this.configurationService.create(this.selectedConfiguration).subscribe(() => {
        this.modalService.dismissAll(configurationModal);

        location.reload()
      });
    }
  }

  onPageSizeChange(){
    this.page = 1;
  }

  deleteConfiguration(configuration: Configuration){
    this.configurationService.delete(configuration.id).then(() => {
    });
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
    const queries = this.configurationService.prepareQueryParam(this.configurationDataSource.filterForm);
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
    this.configurationDataSource.filterForm.get([fieldName]).setValue('');
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
    const inputs = this.configurationService.prepareSearchCriteria();
    console.log('load search result');
    this.getBulkSearchRuleConfiguration(pageCriteria, inputs);
  }
  getBulkSearchRuleConfiguration(pageCriteria: ISearchRequest, inputs: Map<string, string>): void {
    this.configurationService.bulkSearchConfiguration(pageCriteria, inputs).then(page => {
      this.configurationDataSource.dataSource.data = page.content;
      this.configurationDataSource.page = page;
    });
  }

  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    this.dialog.open(ConfigurationPopupComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_CREATE');
      setTimeout(() => {
        this.initConfigurationDataSource();

      }, 250),
        () => {
        },
        () => {
        }

    });

  }

  onEdit(i: number, e: Configuration): void {
    this.configurationService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(ConfigurationPopupComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_UPDATED')
      setTimeout(() => {
        this.initConfigurationDataSource();
      }, 250),
        () => {
        },
        () => {
          this.loadingService.stopLoading();

        }

    });

  }
  onDelete( i: number, e: Configuration): void{
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      width: '500px' ,
    });
    dialogRef.componentInstance.title = this.translateService.instant('DELETE.TITLE');
    dialogRef.componentInstance.message = this.translateService.instant('HEADER.CONFIGURATION.MODAL.MESSAGE' ,{code: e.code});
    dialogRef.componentInstance.confirmButtonLabel = this.translateService.instant('DELETE.CONFIRM');
    dialogRef.componentInstance.cancelButtonLabel = this.translateService.instant('DELETE.CANCEL');
    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(isDeleteConfirmed => {
      if (!isDeleteConfirmed) {
        return;
      }
      this.configurationService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.configurationDataSource.dataSource.data.splice(i, 1);
        this.configurationDataSource.dataSource.connect().next(this.configurationDataSource.dataSource.data);
        this.configurationDataSource.page.totalElements -= 1;
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
        duration: 3000,
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
        duration: 150000,
        horizontalPosition:'right',
        verticalPosition: 'top',
        panelClass: ['blue-snackbar']
      });
    }

  }
  ngOnDestroy(): void {
  }

}
