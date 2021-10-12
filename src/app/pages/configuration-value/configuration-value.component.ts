import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationValue } from 'src/app/core/models/configuration-value.model';
import { Configuration } from 'src/app/core/models/configuration.model';
import { QueryOptions } from 'src/app/core/models/query-options';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigValueService } from './configuration-value.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ISearchRequest} from "../../core/models/search-request.model";
import {ConfigurationPopupComponent} from "../configuration/configuration-popup/configuration-popup.component";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {ConfigurationValuePopupComponent} from "./configuration-value-popup/configuration-value-popup.component";
import {FormGroup} from "@angular/forms";
import {LoadingService} from "../../core/services/loadingscreen.service";

@Component({
  selector: 'app-configuration-value',
  templateUrl: './configuration-value.component.html',
  styleUrls: ['./configuration-value.component.scss']
})
export class ConfigurationValueComponent implements OnInit {
  protected _onDestroy = new Subject<void>();
  breadCrumbItems: Array<{}>;
  // Configuration data
  configurationValueData: ConfigurationValue[];
  public selected: any;
  idConfiguration : number ;
  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;
  selectedConfigurationValue: ConfigurationValue = new ConfigurationValue();
  configuration : Configuration
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
              private configurationValueService: ConfigValueService ,
              private configurationService : ConfigurationService,
              private router : Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private snackBar: MatSnackBar,
              private loadingService: LoadingService
) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.activatedRoute.paramMap.subscribe(params => {
      this.idConfiguration = parseInt(params.get("id"));
      this.configuration = new Configuration;
      this.configuration.id = this.idConfiguration

    });
     this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Configuration Value', active: true },
    ];
    /**
     * fetch data
     */
    this.initConfigurationDataSource();
    this.initFilterForm();

  }
  _fetchData() {
    this.configurationService.getAllConfiguration(new QueryOptions(this.page - 1, this.pageSize),this.idConfiguration).subscribe((data) => {
      this.configurationValueData = data['content'];
      this.totalRecords = data['totalElements'];
      this.totalPages = data['totalPages']
      this.pageSize = data['size']
    });

  }
  onPageChange(){
    this._fetchData()
  }

  openModal(configurationValueModal: any, mode: string, selectedConfigurationValue: ConfigurationValue) {

    selectedConfigurationValue.configuration = this.configuration ;
    this.modalService.open(configurationValueModal, {
      centered: true,
      windowClass: 'modal-holder',
    });
    this.mode = mode;
    this.selectedConfigurationValue = selectedConfigurationValue;
  }

  addOrUpdateConfigurationValue(configurationValueModal: any) {
    if (this.mode === 'Edit') {
      this.configurationValueService.update(this.selectedConfigurationValue).subscribe(() => {
        this.modalService.dismissAll(configurationValueModal);
        this._fetchData();
      });
    }
    else if (this.mode === 'Create'){
        this.configurationValueService.create(this.selectedConfigurationValue).subscribe(() => {
          this.modalService.dismissAll(configurationValueModal);
          this._fetchData();
        });
    }
  }
  onPageSizeChange(){
    this.page = 1;
    this._fetchData();
  }
  deleteConfigurationValue(configurationValue: ConfigurationValue){
    this.configurationValueService.delete(configurationValue.id).then(() => {
      this._fetchData();
    });
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
    this.configurationService.bulkSearchConfigurationValue(pageCriteria, inputs,this.idConfiguration).then(page => {
      this.configurationDataSource.dataSource.data = page.content;
      this.configurationDataSource.page = page;
    });
  }

  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    this.configurationValueService.onSetIdConfig(this.idConfiguration);
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    this.dialog.open(ConfigurationValuePopupComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_CREATE');
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initConfigurationDataSource();
      }, 500),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });


  }

  onEdit(i: number, e: Configuration): void {
    this.configurationService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    this.configurationValueService.onSetIdConfig(this.idConfiguration)
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(ConfigurationValuePopupComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_UPDATED')
      setTimeout(() => {
        this.initConfigurationDataSource();
      }, 500),
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
        duration: 15000,
        horizontalPosition: 'start',
        verticalPosition: 'top',
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
}
