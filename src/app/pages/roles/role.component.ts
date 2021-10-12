import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import { QueryOptions } from 'src/app/core/models/query-options';
import { Role } from 'src/app/core/models/role.model';
import { RoleService } from './role.service';
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ISearchRequest} from "../../core/models/search-request.model";
import {ConfigurationPopupComponent} from "../configuration/configuration-popup/configuration-popup.component";
import {Configuration} from "../../core/models/configuration.model";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {takeUntil} from "rxjs/operators";
import {RolesDialogComponent} from "./roles-dialog/roles-dialog.component";
import {LoadingService} from "../../core/services/loadingscreen.service";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
    // bread crum data
    breadCrumbItems: Array<{}>;
    // Role data
    roleData: Role[];
    public selected: any;
    hideme: boolean[] = [];
    roles$: Observable<Role[]>;
    total$: Observable<number>;
    mode: string;
    searchTerm: string;
    totalRecords: number;
    totalPages: number;
    page = 1;
    pageSize = 10;
    selectedRole: Role;
    public isCollapsed = true;
    protected _onDestroy = new Subject<void>();
    roleDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: [ 'name' ,'description','actions'],
    allColumnsName: [ 'name' ,'description','actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(  private modalService: NgbModal,
                private roleService: RoleService,
                private activatedRoute: ActivatedRoute,
                private dialog: MatDialog,
                private translateService: TranslateService,
                private snackBar: MatSnackBar,
                private router: Router,
                private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Role', active: true },
    ];
    this.initroleDataSource();
    this.initFilterForm();

  }
  initroleDataSource(): void {
    this.roleDataSource.dataSource.paginator = this.paginator;
    this.loadConfigurationData();
  }
  initFilterForm(): void {
    this.roleDataSource.filterForm = this.roleService.createFilterForm();
    this.onResetSearchFilter();
  }
  onResetSearchFilter(): void {
    this.roleService.resetSearchFilter(this.roleDataSource.filterForm);
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
    const queries = this.roleService.prepareQueryParam(this.roleDataSource.filterForm);
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
    this.roleDataSource.filterForm.get([fieldName]).setValue('');
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
    const inputs = this.roleService.prepareSearchCriteria();
    console.log('load search result');
    this.getBulkSearchRuleRole(pageCriteria, inputs);
  }
  getBulkSearchRuleRole(pageCriteria: ISearchRequest, inputs: Map<string, string>): void {
    this.roleService.bulkSearchRoles(pageCriteria, inputs).then(page => {
      this.roleDataSource.dataSource.data = page.content;
      this.roleDataSource.page = page;
    });
  }

  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    this.dialog.open(RolesDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_CREATE');
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initroleDataSource();
      }, 500),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });


  }

  onEdit(i: number, e: Role): void {
    this.roleService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.dialog.open(RolesDialogComponent, dialogConfig).afterClosed().subscribe(e=>{
      this.showSnackBar('SUCCESS_UPDATED')
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.initroleDataSource();;
      }, 500),
        () => {
        },
        () => {
          this.loadingService.stopLoading();
        }
    });

  }
  onDelete( i: number, e: Role): void{
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      width: '500px' ,
    });
    dialogRef.componentInstance.title = this.translateService.instant('DELETE.TITLE');
    dialogRef.componentInstance.message = this.translateService.instant('HEADER.ROLES.MODAL.MESSAGE' );
    dialogRef.componentInstance.confirmButtonLabel = this.translateService.instant('DELETE.CONFIRM');
    dialogRef.componentInstance.cancelButtonLabel = this.translateService.instant('DELETE.CANCEL');
    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(isDeleteConfirmed => {
      if (!isDeleteConfirmed) {
        return;
      }
      this.roleService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.roleDataSource.dataSource.data.splice(i, 1);
        this.roleDataSource.dataSource.connect().next(this.roleDataSource.dataSource.data);
        this.roleDataSource.page.totalElements -= 1;
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
}
