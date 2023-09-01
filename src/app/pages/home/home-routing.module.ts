import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
   
  { path:'', component : LayoutComponent, children:[
    {path:'',component:HomeComponent},
    {path:"job-detail",component:JobDetailComponent},
    {path:"not-found", component:NotFoundComponent},
  ]},
  
  

  {path:'auth',loadChildren:()=>import("./../../auth/auth.module").then(module=>module.AuthModule)},

  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
