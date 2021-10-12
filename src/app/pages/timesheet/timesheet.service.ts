import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ResourceService} from 'src/app/core/services/resource.service';
import {Timesheet} from '../../core/models/timesheet.model';

@Injectable({
  providedIn: 'root',
})
export class TimsheetService extends ResourceService<Timesheet> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'cra/api/timesheets');
  }

  init(username: string, date: string): any {
    return this.httpClient.get(
      this.apiHost + `cra/api/timesheets/${username}/${date}`
    );
  }
}
