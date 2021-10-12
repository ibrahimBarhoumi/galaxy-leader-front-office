import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GLOBAL} from '../../app-config';

const apiHost:string  = GLOBAL.gatewayEndpoint;
const AUTH_API = apiHost + 'oauth/token';
const USER_URI = apiHost + 'oauth/check_token';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa( 'galaxy' + ':' + 'temp' )
          })
      };

      const body = new HttpParams()
        .set('grant_type', 'password')
        .set('username', username)
      .set('password', password)
      .set('client_id', 'galaxy');

    return this.http.post<any>(AUTH_API, body.toString(), httpOptions);

  }

  logout(): Observable<any> {
    const key = window.sessionStorage.getItem(TOKEN_KEY);
    const httpOptions = {
      headers:new HttpHeaders(
        {
          'Authorization': 'Basic '+btoa( 'galaxy' + ':' + 'temp'),
          'token': 'Bearer ' + key
        }
      )
    };
    return this.http.delete<any>(AUTH_API, httpOptions)
  }


}
