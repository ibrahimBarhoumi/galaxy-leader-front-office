import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ResourceService} from 'src/app/core/services/resource.service';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Client, IClientSearchRequest, IPage} from 'src/app/core/models/client.model';


@Injectable({
  providedIn: 'root'
})
export class ClientService extends ResourceService<Client> {

  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/clients');
  }

      form: FormGroup = new FormGroup({
      id: new FormControl(null),
      companyName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      postcode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      legalForm: new FormControl('', Validators.required),
      capital: new FormControl('', Validators.required),
      rcc: new FormControl('', Validators.required),
      siren: new FormControl('', Validators.required),
      vatNumber: new FormControl('', Validators.minLength(8)),
        foreign: new FormControl(false),
      currency: new FormControl(''),
    });
  search(companyName: string): Observable<Client[]> {
    const params = new HttpParams().set('companyName', companyName);
    return this.httpClient
      .get(this.apiHost + `cra/api/clients/search`, { params })
      .pipe(map((data: any) => data));
  }
  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      companyName: '',
      address: '',
      postcode: '',
      city: '',
      legalForm: '',
      capital: '',
      rcc: '',
      siren: '',
      vatNumber: '',
      foreign: false,
      currency: '',
    });
  }
  createFilterForm(): FormGroup {
    return new FormGroup({
      companyName: new FormControl(''),
      address: new FormControl(''),
      postcode: new FormControl(''),
      city: new FormControl(''),
      legalForm: new FormControl(''),
      capital: new FormControl(''),
      rcc: new FormControl(''),
      siren: new FormControl(''),
      vatNumber: new FormControl(''),
      foreign: new FormControl(''),
      currency: new FormControl(''),
    });
  }

  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.companyName = filterForm.value.companyName;
    queryParam.address = filterForm.value.address;
    queryParam.postalCode = filterForm.value.postalCode;
    queryParam.city = filterForm.value.city;
    queryParam.legalForm = filterForm.value.legalForm;
    queryParam.capital = filterForm.value.capital;
    queryParam.rcc = filterForm.value.rcc;
    queryParam.siren = filterForm.value.siren;
    queryParam.vatNumber = filterForm.value.vatNumber;
    queryParam.foreign = filterForm.value.foreign;
    queryParam.currency = filterForm.value.currency;
    return queryParam;
  }

  prepareSearchCriteria(): Map<string, string> {
    const inputs = new Map();
    if (this.getCompanyNameQuery().length > 0) {
      inputs.set('companyName', this.getCompanyNameQuery());
    }
    return inputs;
  }

  getCompanyNameQuery(): string {
    const query = this.activatedRoute.snapshot.queryParams.companyName;
    return !!query ? query : '';
  }

  bulkSearchClients(queryParams: IClientSearchRequest, inputs: Map<string, string>): Promise<IPage<Client>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<Client>>(`${this.apiHost}cra/api/clients?${requestParam}` , {params: queryParams as any}).toPromise();
  }

  private buildRequestParamFromInputs(inputs: Map<string, string>): any {
    let requestParam = '';
    inputs.forEach((value: string, key: string) => {
      if (!value || value === '*') {
        requestParam += `${key}=&`;
      } else {
        requestParam += `${key}=${value}&`;
      }
    });
    requestParam = requestParam.substring(0, requestParam.length - 1);
    return requestParam;
  }

  resetSearchFilter(filterForm: FormGroup): void {
    filterForm.get(['companyName']).setValue('');
  }
  populateForm(client: Client): void {
    this.form.setValue(client);
  }
}
