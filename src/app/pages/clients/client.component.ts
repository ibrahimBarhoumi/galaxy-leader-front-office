import {Component, OnInit, ViewChildren, QueryList, ViewChild, OnDestroy} from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable, Subject} from 'rxjs';

import {Client, IClientSearchRequest} from '../../core/models/client.model';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientService} from './client.service';

import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { ClientOperationsComponent } from './client-operations/client-operations.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../common/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-clienttable',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [DecimalPipe],
})

/**
 * Client component
 */
export class ClientComponent implements OnInit, OnDestroy {
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Client data
  clientData: Client[];
  public selected: any;
  hideme: boolean[] = [];
  clients$: Observable<Client[]>;
  total$: Observable<number>;

  mode: string;
  searchTerm: string;
  totalRecords: number;
  totalPages: number;
  page = 1;
  pageSize = 10;

  clientDataSource: any = {
    dataSource: new MatTableDataSource(),
    columnsToDisplay: ['companyName', 'capital' , 'legalForm' , 'rcc' , 'siren', 'vatNumber', 'actions'],
    allColumnsName: ['companyName' , 'capital' , 'legalForm', 'rcc' , 'siren', 'vatNumber',  'actions'],
    filterForm: null,
    page: null,
    pageSizeOptions: [10, 25, 50, 100],
  };
  selectedClient: Client;
  public isCollapsed = true;

  constructor(
    private modalService: NgbModal,
    protected clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {

    this.initClientsDataSource();
    this.initFilterForm();
  }

  initClientsDataSource(): void {
    this.clientDataSource.dataSource.paginator = this.paginator;
    this.loadClientsData();
  }

  initFilterForm(): void {
    this.clientDataSource.filterForm = this.clientService.createFilterForm();
    this.onResetSearchFilter();
  }

  onResetSearchFilter(): void {
    this.clientService.resetSearchFilter(this.clientDataSource.filterForm);
    this.loadSearchResult();
  }

  /**
   * fetches the table value
   */


  openModal(clientModal: any, mode: string, selectedClient: Client): void {
    this.modalService.open(clientModal, {
      centered: true,
      windowClass: 'modal-holder',
    });
    this.mode = mode;
    this.selectedClient = selectedClient;
  }

  addOrUpdateClient(clientModal: any): void {

    if (this.mode === 'Edit') {
      this.clientService.update(this.selectedClient).subscribe(() => {
        this.modalService.dismissAll(clientModal);
        this.initClientsDataSource();
        this.initFilterForm();
      });
    } else if (this.mode === 'Create') {
      this.clientService.create(this.selectedClient).subscribe(() => {
        this.modalService.dismissAll(clientModal);
        this.initClientsDataSource();
        this.initFilterForm();
      });
    }
  }

  onPageSizeChange(): void {
    this.page = 1;

  }


  paginate(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex, size: event.pageSize
      }, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadClientsData();
    });
  }

  onClearSearchFormFiled(fieldName: string): void {
    this.clientDataSource.filterForm.get([fieldName]).setValue('');
    this.loadSearchResult();
  }

  onSearch(): void {
    this.loadSearchResult();
  }

  loadSearchResult(): void {
    const queries = this.clientService.prepareQueryParam(this.clientDataSource.filterForm);
    this.router.navigate([], {
      queryParams: queries, queryParamsHandling: 'merge',
    }).finally(() => {
      this.loadClientsData();
    });
  }

  loadClientsData(): void {
    const pageCriteria: IClientSearchRequest = {
      page: this.getPageIndex(), size: this.getPageSize(),
    };
    const inputs = this.clientService.prepareSearchCriteria();
    this.getBulkSearchRuleClients(pageCriteria, inputs);
  }

  getBulkSearchRuleClients(pageCriteria: IClientSearchRequest, inputs: Map<string, string>): void {
    this.clientService.bulkSearchClients(pageCriteria, inputs).then(page => {
      this.clientDataSource.dataSource.data = page.content;
      this.clientDataSource.page = page;
    });
  }

  getPageIndex(): number {
    const pageIndex = this.activatedRoute.snapshot.queryParams.page;
    return pageIndex > 0 ? pageIndex : 0;
  }

  getPageSize(): number {
    const pageSize = this.activatedRoute.snapshot.queryParams.size;
    return pageSize > 0 ? pageSize : 10;
  }

  resetSearch(key): void {
    if (key === '') {
      this.loadSearchResult();
    }
  }

  onCreateNew(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.height = '60%';
    this.dialog.open(ClientOperationsComponent, dialogConfig);
  }
  onDelete( i: number, e: Client): void{
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      width: '500px' ,
    });
    dialogRef.componentInstance.title = this.translateService.instant('DELETE.TITLE');
    dialogRef.componentInstance.message = this.translateService.instant('HEADER.CLIENTS.MODAL.MESSAGE' );
    dialogRef.componentInstance.confirmButtonLabel = this.translateService.instant('DELETE.CONFIRM');
    dialogRef.componentInstance.cancelButtonLabel = this.translateService.instant('DELETE.CANCEL');
    dialogRef.afterClosed().pipe(takeUntil(this._onDestroy)).subscribe(isDeleteConfirmed => {
      if (!isDeleteConfirmed) {
        return;
      }
      this.clientService.delete(e.id).then(() => {
        this.showSnackBar('SUCCESS_DELETE');
        this.clientDataSource.dataSource.data.splice(i, 1);
        this.clientDataSource.dataSource.connect().next(this.clientDataSource.dataSource.data);
        this.clientDataSource.page.totalElements -= 1;
        this.loadClientsData();
      });
    });
  }
  onEdit(i: number, e: Client): void {
    this.clientService.populateForm(e);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.height = '60%';
    this.dialog.open(ClientOperationsComponent, dialogConfig);
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
  ngOnDestroy(): void {
  }


}
