import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren:() => import("./pages/home/home.module").then(module=>module.HomeModule)},
  {path:'auth',loadChildren:()=>import("./auth/auth.module").then(module=>module.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
