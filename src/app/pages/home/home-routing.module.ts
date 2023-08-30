import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
   
  { path:'', component : HomeComponent, children:[

    {path:"account" , loadChildren:()=>import("./account/account.module").then(module=>module.AccountModule),  data: { breadcrumb: 'Account' }},

  ]},

  {path:'auth',loadChildren:()=>import("./../../auth/auth.module").then(module=>module.AuthModule)},

  {path:"**" , redirectTo:"not-found"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
