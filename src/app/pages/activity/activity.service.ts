import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity } from 'src/app/core/models/activity.model';
import { ResourceService } from 'src/app/core/services/resource.service';
import { environment } from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {formatDate} from '@angular/common';
import {ISearchRequest} from '../../core/models/search-request.model';
import {IPage} from '../../core/models/page.model';
import {log} from 'util';

@Injectable({
  providedIn: 'root',
})
export class ActivityService extends ResourceService<Activity> {

  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(httpClient, 'cra/api/activities');
  }
  get formControls(): any {
    return this.form.controls;
  }
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nature: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required),
    common: new FormControl(false),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    client: new FormControl(null),

  });
  search(keyword: string): Observable<Activity[]> {
    return this.httpClient
      .get(this.apiHost + `cra/api/activities/search?keyword=${keyword}`)
      .pipe(map((data: any) => data));
  }
  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      nature: '',
      label: '',
      startDate: null,
      endDate: null,
      common: false,
      client: null
    });
  }
  createFilterForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      nature: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      isCommon: new FormControl(''),
      client: new FormControl(''),

    });
  }

  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.nature = filterForm.value.nature;
    queryParam.label = filterForm.value.label;
    queryParam.startDate = filterForm.value.startDate;
    queryParam.endDate = filterForm.value.endDate;
    queryParam.isCommon = filterForm.value.isCommon;
    queryParam.client = filterForm.value.client;
    return queryParam;
  }

  prepareSearchCriteria(): Map<string, string> {
    const inputs = new Map();
    if (this.getLabelQuery().length > 0) {
      inputs.set('label', this.getLabelQuery());
    }
    return inputs;
  }

  getLabelQuery(): string {
    const query = this.activatedRoute.snapshot.queryParams.label;
    return !!query ? query : '';
  }

  bulkSearchActivities(queryParams: ISearchRequest, inputs: Map<string, string>): Promise<IPage<Activity>> {
    const requestParam = this.buildRequestParamFromInputs(inputs);
    return this.httpClient.get<IPage<Activity>>(this.apiHost + `cra/api/activities` , {params: queryParams as any}).toPromise();
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
    filterForm.get(['label']).setValue('');
  }
  populateForm(activity: Activity): void {
    this.form.patchValue(activity);
  }
  onCheckChange(e){
    this.form.patchValue({
      common: e.target.checked

    });
    console.log( this.form);
  }
}
