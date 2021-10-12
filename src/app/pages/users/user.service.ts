import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import { ResourceService } from 'src/app/core/services/resource.service';
import {environment} from '../../../environments/environment';
import {IPage} from '../../core/models/page.model';
import {ISearchRequest} from '../../core/models/search-request.model';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Activity} from '../../core/models/activity.model';


@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService<User> {
  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/users');
  }
  private path = this.apiHost + `cra/api/users`;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    roles: new FormControl(null),
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    enabled: new FormControl(false),
  });
  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      name: '',
      lastname: '',
      email: '',
      mobile: '',
      userName: '',
      roles: '',
      password: '',
      enabled: false
    });
  }
  createFilterForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl(''),
      roles: new FormControl(''),
      userName: new FormControl(''),
      enabled: new FormControl(''),
    });
  }
  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.name = filterForm.value.name;
    queryParam.lastname = filterForm.value.lastname;
    queryParam.email = filterForm.value.email;
    queryParam.mobile = filterForm.value.mobile;
    queryParam.enabled = filterForm.value.enabled;
    queryParam.userName = filterForm.value.userName ;
    queryParam.roles = filterForm.value.roles ;
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
  bulkSearchUsers(queryParams: ISearchRequest, inputs: Map<string, string>): Promise<IPage<User>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<User>>(this.path , {params: queryParams as any}).toPromise();
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

  onCheckChange(e): void {
    this.form.patchValue({
      enabled: e.target.checked

    });
    console.log( this.form.value);
  }
  populateForm(user: User): void {
    this.form.patchValue(user);
  }
  get formControls(): any {
    return this.form.controls;
  }


}
