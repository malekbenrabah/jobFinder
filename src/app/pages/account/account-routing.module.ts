import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { CompanyProfileComponent } from './company-profile/company-profile.component';

const routes: Routes = [
  
  {path:"profile", component:ProfileComponent},
  {path:"company-profile", component:CompanyProfileComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
