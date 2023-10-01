import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { UsersComponent } from './users/users.component';
import { CompaniesComponent } from './companies/companies.component';
import { AdminGuard } from '../services/guards/admin/admin.guard';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {path:'', component:AdminComponent,
    children:[
      {path:'', component:DashboardComponent},
      {path:'jobs',component:JobsComponent},
      {path:'users',component:UsersComponent},
      {path:'companies',component:CompaniesComponent},
      {path:'account', component:AccountComponent}
   ],canActivate:[AdminGuard]
  },
  
  {path:'admin-auth',loadChildren:()=>import("./auth-admin/auth-admin.module").then(module=>module.AuthAdminModule)}
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
