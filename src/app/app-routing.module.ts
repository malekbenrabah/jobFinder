import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/home/not-found/not-found.component';

const routes: Routes = [
  { path: '', loadChildren:() => import("./pages/home/home.module").then(module=>module.HomeModule)},
  {path:'auth',loadChildren:()=>import("./auth/auth.module").then(module=>module.AuthModule)},
  {path:'admin',loadChildren:()=>import("./admin/admin.module").then(module=>module.AdminModule)},


  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
