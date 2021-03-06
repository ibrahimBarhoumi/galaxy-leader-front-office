import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const token = window.sessionStorage.getItem('auth-token');
    const tokenPayload = decode(token);

    if (!this.auth.isAuthenticated() || !tokenPayload['authorities'].includes(expectedRole)) {
      this.router.navigate(['login']);
      return false;
    }
    if(this.auth.isAuthenticated() && tokenPayload['authorities'].includes(expectedRole)) {
    return true;
    }
    return false;
  }
}
