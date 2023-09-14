import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { JobListComponent } from './job-list/job-list.component';
import { JobGridComponent } from './job-grid/job-grid.component';

const routes: Routes = [
   
  { path:'', component : LayoutComponent, children:[
    {path:'',component:HomeComponent},
    {path:"job-detail/:id",component:JobDetailComponent},
    {path:"job-list",component:JobListComponent},
    {path:"job-grid",component:JobGridComponent},
    {path:"not-found", component:NotFoundComponent},
    {path:"account" , loadChildren:()=>import("../account/account.module").then(module=>module.AccountModule),canActivate:[AuthGuard]},

  ]},
  
  

  {path:'auth',loadChildren:()=>import("./../../auth/auth.module").then(module=>module.AuthModule)},

  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
