import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role} from 'src/app/core/models/role.model';
import {ResourceService} from 'src/app/core/services/resource.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISearchRequest} from '../../core/models/search-request.model';
import {IPage} from '../../core/models/page.model';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends ResourceService<Role> {
  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/roles');
  }

  get range(): any {
    return this.form.controls;
  }

  get formControls(): any {
    return this.form.controls;
  }

  private path = this.apiHost + `cra/api/roles`;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  createFilterForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    });
  }

  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.name = filterForm.value.name;
    queryParam.description = filterForm.value.description;
    return queryParam;
  }

  prepareSearchCriteria(): Map<string, string> {
    const inputs = new Map();
    if (this.getNameQuery().length > 0) {
      inputs.set('name', this.getNameQuery());
    }
    return inputs;
  }

  private getNameQuery(): string {
    const query = this.activatedRoute.snapshot.queryParams.name;
    return !!query ? query : '';
  }

  bulkSearchRoles(queryParams: ISearchRequest, inputs: Map<string, string>): Promise<IPage<Role>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<Role>>(this.path, {params: queryParams as any}).toPromise();
  }

  private buildRequestParamFromInputs(inputs: Map<string, string>): any {
    let requestParam = '';
    inputs.forEach((value: string, key: string) => {
      if (!value || value === '*') {
        requestParam += `${key}=any&`;
      } else {
        requestParam += `${key}=${value}&`;
      }
    });
    requestParam = requestParam.substring(0, requestParam.length - 1);
    return requestParam;
  }

  resetSearchFilter(filterForm: FormGroup): void {
    filterForm.get(['name']).setValue('');
  }

  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      name: '',
      description: '',
    });
  }

  populateForm(role: Role): void {
    this.form.setValue(role);
  }
}
