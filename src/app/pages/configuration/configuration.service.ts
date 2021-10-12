import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/core/models/configuration.model';
import { ResourceService } from 'src/app/core/services/resource.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ISearchRequest} from "../../core/models/search-request.model";
import {IPage} from "../../core/models/page.model";
import {environment} from "../../../environments/environment";
import {Client} from "../../core/models/client.model";
import {ConfigurationValue} from "../../core/models/configuration-value.model";


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends ResourceService<Configuration> {
  constructor( httpClient: HttpClient ,
               private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/configs');
  }
  createFilterForm(): FormGroup {
    return new FormGroup({
      code: new FormControl(''),
      label: new FormControl(''),
    });
  }
  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.code = filterForm.value.code;
    queryParam.label = filterForm.value.label;
    return queryParam;
  }
  prepareSearchCriteria(): Map<string, string> {
    const inputs = new Map();
    if (this.getLabelQuery().length > 0) {
      inputs.set('companyName', this.getLabelQuery());
    }
    return inputs;
  }
  private getLabelQuery(): String {
    const query = this.activatedRoute.snapshot.queryParams.label;
    return !!query ? query : '';
  }
  bulkSearchConfiguration(queryParams: ISearchRequest, inputs: Map<string, string>): Promise<IPage<Configuration>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<Configuration>>(this.apiHost + `cra/api/configs` , {params: queryParams as any}).toPromise();
  }
  bulkSearchConfigurationValue(queryParams: ISearchRequest, inputs: Map<string, string>,id: number): Promise<IPage<ConfigurationValue>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<ConfigurationValue>>(this.apiHost + `cra/api/configs` + `/${id}/configValue`, {params: queryParams as any}).toPromise();
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
    filterForm.get(['code']).setValue('');
  }
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    code: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required),
  });
  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      code: '',
      label: '',
    });
  }
  populateForm(configuration: Configuration): void {
    this.form.setValue(configuration);
  }
  get range() {
    return this.form.controls;
  }
  get formControls(): any {
    return this.form['controls'];
  }

}
