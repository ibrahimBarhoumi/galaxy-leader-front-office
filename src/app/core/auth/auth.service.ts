import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable, Subscription, throwError} from 'rxjs';
import decode from 'jwt-decode';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {GLOBAL} from '../../app-config';

const apiHost: string = GLOBAL.gatewayEndpoint;
const AUTH_API = apiHost + 'oauth/token';
const REFRESH_KEY = 'auth-refresh';
const TOKEN_KEY = 'auth-token';
const intervalTime = 27000;

@Injectable()
export class AuthService {
  subscription: Subscription = new Subscription();

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router
  ) {}
  timer;
  public isAuthenticated(): boolean {
    const token = window.sessionStorage.getItem('auth-token');
    if (this.jwtHelper.isTokenExpired(token) || token == null) return false;
    const tokenPayload = decode(token);
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    let exp = tokenPayload['exp'];
    this.clearTimer();
    const timeToRefresh = exp * 1000 - timestamp;
    //check tocken expiration < timer next schedule => refresh
    if (timeToRefresh < intervalTime) {
      this.subscription = this.refresh().pipe( catchError(err => {
        this.router.navigate['/login']
        return throwError(err);
    })).subscribe({
        next: (data) => {
          this.saveRefresh(data.refresh_token);
          this.saveToken(data.access_token);
        },
        error: () => {
          window.sessionStorage.removeItem(TOKEN_KEY);
          window.sessionStorage.removeItem(REFRESH_KEY);
          this.router.navigate['/login'];
        },
      });
    }
    this.timer = setInterval(() => {
      this.subscription.unsubscribe();
      this.subscription = this.refresh().pipe( catchError(err => {
        this.router.navigate['/login']
        return throwError(err);
    })).subscribe({
        next: (data) => {
          this.saveRefresh(data.refresh_token);
          this.saveToken(data.access_token);
        },
        error: () => {
          console.log('failed')
          window.sessionStorage.removeItem(TOKEN_KEY);
          window.sessionStorage.removeItem(REFRESH_KEY);
          this.router.navigate['/login'];
        },
      });
    }, intervalTime);
    console.log(!this.jwtHelper.isTokenExpired(token))
    return !this.jwtHelper.isTokenExpired(token);
  }
  refresh(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa('galaxy' + ':' + 'temp'),
      }),
    };
    const key = window.sessionStorage.getItem(REFRESH_KEY);
    const body = new HttpParams()
      .set('refresh_token', key)
      .set('grant_type', 'refresh_token');
    return this.http.post<any>(AUTH_API, body.toString(), httpOptions);
  }
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(REFRESH_KEY);
    window.sessionStorage.setItem(REFRESH_KEY, token);
  }

  clearTimer(): void {
    clearInterval(this.timer);
  }

  private handleError (error: Response | any) {
    if (error.status == 0){
    this.router.navigate(['/login']);
    }
    }
}
