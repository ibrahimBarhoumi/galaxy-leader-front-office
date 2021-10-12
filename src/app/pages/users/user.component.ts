import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {Observable, Subject} from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { Role } from 'src/app/core/models/role.model';
import { UserService } from './user.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UsersPopupComponent} from "./users-popup/users-popup.component";
import {ISearchRequest} from "../../core/models/search-request.model";
import {Publicholiday} from "../../core/models/publicholiday.model";
import {ConfirmDialogComponent} from "../../common/confirm-dialog/confirm-dialog.component";
import {takeUntil} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userData: User[];
  public selected: any;
  hideme: boolean[] = [];
  users$: Observable<User[]>;
  total$: Observable<number>;
  selectedUser: User;
  newPassword = "";
  public isCollapsed = true;

  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;


  selectedItems:Role[] = [];
  dropdownSettings:IDropdownSettings = {};
  userDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: [ 'name' ,'lastname','userName','mobile'  ,'email' ,'roles','enabled','actions' ],
    allColumnsName: [ 'name' ,'lastname','userName','mobile' ,'email' ,'name','enabled','actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  protected _onDestroy = new Subject<void>();
  constructor( private modalService: NgbModal,
    private userService: UserService,
               private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router : Router,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    public zone:NgZone) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'User', active: true },
    ];
    this.initUsersDataSource();
    this.initFilterForm();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  initUsersDataSource(): void {
    this.userDataSource.dataSource.paginator = this.paginator;
    this.loadUsersData();
  }
  initFilterForm(): void {
    this.userDataSource.filterForm = this.userService.createFilterForm();
    this.onResetSearchFilter();
  }
  onResetSearchFilter(): void {
    this.userService.resetSearchFilter(this.userDataSource.filterForm);
    this.loadSearchResult();
  }







  changePassword(){
    this.selectedUser.password = this.newPassword;
  }



  paginate(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex, size: event.pageSize
      }, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadUsersData();
    });
  }

  onSearch(): void {
    this.loadSearchResult();
  }


  loadSearchResult(): void {
    const queries = this.userService.prepareQueryParam(this.userDataSource.filterForm);
    this.router.navigate([], {
      queryParams: queries, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadUsersData();
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
    this.userDataSource.filterForm.get([fieldName]).setValue('');
    this.loadSearchResult();
  }
  getPageSize(): number {
    const pageSize = this.activatedRoute.snapshot.queryParams.size;
    return pageSize > 0 ? pageSize : 10;
  }
  loadUsersData(): void {
    const pageCriteria: ISearchRequest = {
      page: this.getPageIndex(), size: this.getPageSize(),
    };
    const inputs = this.userService.prepareSearchCriteria();
    console.log('load search result');
    this.getBulkSearchRuleClients(pageCriteria, inputs);
  }
  getBulkSearchRuleClients(pageCriteria: ISearchRequest, inputs: Map<string, string>): void {
    this.userService.bulkSearchUsers(pageCriteria, inputs).then(page => {
      this.userDataSource.dataSource.data = page.content;
      this.userDataSource.page = page;
    });
  }
  onCreateNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
    this.dialog.open(UsersPopupComponent, dialogConfig);
  }
  onEdit(i: number, e: User): void {
    this.userService.populateForm(e)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
    this.dialog.open(UsersPopupComponent, dialogConfig);
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
      this.userService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.userDataSource.dataSource.data.splice(i, 1);
        this.userDataSource.dataSource.connect().next(this.userDataSource.dataSource.data);
        this.userDataSource.page.totalElements -= 1;
        this.loadUsersData();
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
    ];
    const currentConfig = snackBarConfigs.filter(item => item.key === key)[0];
    if (!!currentConfig) {
      this.snackBar.open(this.translateService.instant(currentConfig.messageI18nKey, {
        configCodeName: this.translateService.instant(`CODE_LABEL_CONFIG.CONFIG_CODES.ASSET_CATALOG`)
      }), '', {
        duration: 15000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['red-700']
      });
    }
  }
}
