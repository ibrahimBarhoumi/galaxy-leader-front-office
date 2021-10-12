import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './clients/client.component';
import { UserComponent } from './users/user.component';
import { RoleComponent } from './roles/role.component';
import { PublicholidayComponent } from './publicholidays/publicholiday.component';
import { RoleGuardService as RoleGuard } from '../core/auth/role-guard.service';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationValueComponent } from './configuration-value/configuration-value.component';
import { ActivityComponent } from './activity/activity.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

const routes: Routes = [
  
  {

    path: 'timesheet',
    
    component: TimesheetComponent,
    
    data: {
    
    expectedRole: 'ROLE_ADMIN',
    
    },
    
    },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'activities',
    component: ActivityComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'ROLE_ADMIN',
    },
  },
  {
    path: 'clients',
    pathMatch: 'full',
    component: ClientComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'ROLE_ADMIN',
    },
  },
  { path: 'users', component: UserComponent,
  canActivate: [RoleGuard],
  data: {
    expectedRole: 'ROLE_ADMIN',
  }, },
  { path: 'roles', component: RoleComponent,
  canActivate: [RoleGuard],
  data: {
    expectedRole: 'ROLE_ADMIN',
  }, },
  { path: 'publicholidays', component: PublicholidayComponent,
  canActivate: [RoleGuard],
  data: {
    expectedRole: 'ROLE_ADMIN',
  }, },
  { path: 'configuration', component: ConfigurationComponent,
  canActivate: [RoleGuard],
  data: {
    expectedRole: 'ROLE_ADMIN',
  }, },
  { path: 'configvalue/:id', component: ConfigurationValueComponent,
  canActivate: [RoleGuard],
  data: {
    expectedRole: 'ROLE_ADMIN',
  }, },
  {
    path: 'activities',
    component: ActivityComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'ROLE_ADMIN',
    },
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
