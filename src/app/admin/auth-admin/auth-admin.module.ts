import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthAdminRoutingModule } from './auth-admin-routing.module';
import { AuthAdminComponent } from './auth-admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import{ FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AuthAdminComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthAdminRoutingModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    NzCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzSpaceModule,
    NzAlertModule,
    FontAwesomeModule
  ]
})
export class AuthAdminModule { }
