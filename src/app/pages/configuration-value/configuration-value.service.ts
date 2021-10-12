import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationValue } from 'src/app/core/models/configuration-value.model';
import { ResourceService } from 'src/app/core/services/resource.service';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISearchRequest} from '../../core/models/search-request.model';
import {IPage} from '../../core/models/page.model';
import {Configuration} from '../../core/models/configuration.model';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigValueService extends ResourceService<ConfigurationValue> {
  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/configValues');
  }

  get range() {
    return this.form.controls;
  }
  private path = this.apiHost + `cra/api/configs`;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    code: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required),
    configuration: new FormGroup({
      id: new FormControl(null)
    })

  });
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
  private getLabelQuery(): string {
    const query = this.activatedRoute.snapshot.queryParams.label;
    return !!query ? query : '';
  }
  bulkSearchConfiguration(queryParams: ISearchRequest, inputs: Map<string, string>, id: number): Promise<IPage<ConfigurationValue>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<ConfigurationValue>>(this.path + `/${id}/configValue`, {params: queryParams as any}).toPromise();
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
  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      code: '',
      label: '',
      configuration: {
        id: null
      }

    });
  }
  populateForm(configurationValue: ConfigurationValue): void {
    this.form.patchValue({
      id: configurationValue.id,
      code: configurationValue.code,
      label: configurationValue.label,
      configuration: {
        id: configurationValue.configuration.id
      }
    });

  }
  onSetIdConfig(e: number): void {
    this.form.patchValue({
      configuration: {
        id: e
      }
    });


  }
}
