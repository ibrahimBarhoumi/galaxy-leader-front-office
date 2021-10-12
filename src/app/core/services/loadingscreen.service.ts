import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading: boolean = false;
  loadingStatus = new Subject();
  get loading(): boolean {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }
}
