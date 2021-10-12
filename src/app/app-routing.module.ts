import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './pages/login/login.component';

import { AuthService } from './core/auth/auth.service';

import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';

import {
  AuthGuardService as AuthGuard
} from './core/auth/auth-guard.service';

import {
  RoleGuardService as RoleGuard
} from './core/auth/role-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, RoleGuard]

})
export class AppRoutingModule {}
