import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CandidateDetailesComponent } from './candidate-detailes/candidate-detailes.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { CvComponent } from './cv/cv.component';

const routes: Routes = [
  
  {path:"profile", component:ProfileComponent},
  {path:"company-profile", component:CompanyProfileComponent},
  {path:"candidates", component:CandidatesComponent},
  {path:"candidate-detailes", component:CandidateDetailesComponent},
  {path:"cv", component:CvComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
