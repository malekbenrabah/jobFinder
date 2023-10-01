import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoggedInGuard } from '../services/guards/loggedIn/logged-in.guard';

const routes: Routes = [
  {path:"login", component : LoginComponent},
  {path:"register", component : RegisterComponent},
  {path:"forgot-password", component:ForgotPasswordComponent},
  {path:"pass-reset",component:PasswordResetComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
