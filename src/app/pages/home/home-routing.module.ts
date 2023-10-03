import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { JobListComponent } from './job-list/job-list.component';
import { JobGridComponent } from './job-grid/job-grid.component';
import { JobDetail2Component } from './job-detail2/job-detail2.component';
import { LoggedInGuard } from 'src/app/services/guards/loggedIn/logged-in.guard';
import { AdminGuard } from 'src/app/services/guards/admin/admin.guard';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

const routes: Routes = [
   
  { path:'', component : LayoutComponent, children:[
    {path:'',component:HomeComponent},
    {path:"job-detail/:id",component:JobDetail2Component},
    {path:"job-list",component:JobListComponent},
    {path:"job-grid",component:JobGridComponent},
    {path:"companies",component:CompaniesComponent},
    {path:"company-detail",component:CompanyDetailComponent},
    {path:"account" , loadChildren:()=>import("../account/account.module").then(module=>module.AccountModule),canActivate:[AuthGuard]},

  ]},
  
  
  /*{path:'admin',loadChildren:()=>import("./../../admin/admin.module").then(module=>module.AdminModule),canActivate:[AdminGuard]},*/
  {path:'auth',loadChildren:()=>import("./../../auth/auth.module").then(module=>module.AuthModule),canActivate: [LoggedInGuard]},

  /*{ path: '**', redirectTo: 'not-found' }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
