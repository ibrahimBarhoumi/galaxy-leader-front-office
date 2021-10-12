import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {QueryOptions} from '../models/query-options';
import {Resource} from '../models/resource';
import {GLOBAL} from '../../app-config';


export class ResourceService<T extends Resource> {

  protected apiHost = `${GLOBAL.gatewayEndpoint}`;

  constructor(
    protected httpClient: HttpClient,
    protected endpoint: string) {
  }

  public create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(this.apiHost + `${this.endpoint}`, item)
      .pipe(map(data => data as T));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(this.apiHost + `${this.endpoint}`,
        item)
      .pipe(map(data => data as T));
  }

  read(id: number): Observable<T> {
    return this.httpClient
      .get(this.apiHost + `${this.endpoint}/${id}`)
      .pipe(map((data: any) => data as T));
  }

  list(queryOptions: QueryOptions): Observable<T[]> {
    return this.httpClient
      .get(this.apiHost + `${this.endpoint}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => data));
  }

  delete(id: number): Promise<T> {
    return this.httpClient.delete<T>(this.apiHost + `${this.endpoint}/${id}`).toPromise<T>();
  }

  getAllConfiguration(queryOptions: QueryOptions, id: number): Observable<any> {
    return this.httpClient
      .get(this.apiHost + `${this.endpoint}/${id}/configValue?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => data));
  }


}
