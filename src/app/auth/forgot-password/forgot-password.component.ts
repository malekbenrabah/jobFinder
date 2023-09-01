import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  validateForm!: FormGroup;

  emailSentSuccess:string="";
  userNotFoundErr:string="";
  submitForm(): void {
    console.log('forgot password begin');
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      console.log('email',this.validateForm.value['email']);
      this.isLoadingOne=true;
      /*
      this.authService.forgotPassword(this.validateForm.value['email']).subscribe(r=>{  
        localStorage.setItem('email',this.validateForm.value['email']);
      
        console.log("forgot password successfully",r);
        this.emailSentSuccess="Please check your email to set your password";
        this.isLoadingOne=false;
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false){
          this.isLoadingOne=false;
          this.userNotFoundErr="There's no user registered with this email";
          this.validateForm.reset();

        }
    });
    */

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  //after closing the alert
  afterClose(){
    this.emailSentSuccess="";
  }

  afterCloseError(){
    this.userNotFoundErr="";
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  //button loading
  isLoadingOne = false;

}
