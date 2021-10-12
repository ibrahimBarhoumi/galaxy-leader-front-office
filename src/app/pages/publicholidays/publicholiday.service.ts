import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ResourceService} from 'src/app/core/services/resource.service';
import {Publicholiday} from '../../core/models/publicholiday.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ISearchRequest} from '../../core/models/search-request.model';
import {IPage} from '../../core/models/page.model';
import {Role} from '../../core/models/role.model';
import {ActivatedRoute} from '@angular/router';
import {formatDate} from '@angular/common';

interface Post {
  startDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PublicholidayService extends ResourceService<Publicholiday> {
  constructor(httpClient: HttpClient,
              private activatedRoute: ActivatedRoute) {
    super(
      httpClient,
      'cra/api/publicholidays');
  }

  get range() {
    return this.form.controls;
  }

  get formControls(): any {
    return this.form.controls;
  }

  post: Post = {
    startDate: new Date(Date.now())
  };
  private path = this.apiHost + `cra/api/publicholidays`;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    label: new FormControl('', Validators.required),
    date: new FormControl(formatDate(this.post.startDate, 'yyyy-MM-dd', 'en'), Validators.required),
  });

  sync() {
    return this.httpClient
      .get(this.apiHost + `cra/api/publicholidays/sync`);
  }

  createFilterForm(): FormGroup {
    return new FormGroup({
      label: new FormControl(''),
      date: new FormControl(''),
    });
  }

  prepareQueryParam(filterForm: FormGroup): any {
    const queryParam: any = {};
    queryParam.label = filterForm.value.label;
    queryParam.date = filterForm.value.date;
    return queryParam;
  }

  prepareSearchCriteria(): Map<string, string> {
    const inputs = new Map();
    if (this.getLabelQuery().length > 0) {
      inputs.set('name', this.getLabelQuery());
    }
    return inputs;
  }

  private getLabelQuery(): string {
    const query = this.activatedRoute.snapshot.queryParams.name;
    return !!query ? query : '';
  }

  bulkSearchPublicHoliday(queryParams: ISearchRequest, inputs: Map<string, string>): Promise<IPage<Role>> {
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
    filterForm.get(['label']).setValue('');
  }

  initializeFormGroup(): void {
    this.form.setValue({
      id: null,
      label: '',
      date: '',
    });
  }

  populateForm(publicholiday: Publicholiday): void {
    this.form.setValue(publicholiday);
  }
}
