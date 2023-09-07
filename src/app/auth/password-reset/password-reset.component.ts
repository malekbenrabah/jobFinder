import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user/user-service.service';
//import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  validateForm!: FormGroup;
  resetSuccess:string="";
  passwordExists:string="";
  submitForm(): void {
    console.log('forgot password begin');
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const userEmail: string | null = localStorage.getItem('email');
      //casting with as:
      const userEmailString: string = userEmail as string;
      console.log('email',userEmailString);
      
      this.userService.resetPassword( userEmailString,this.validateForm.value['password']).subscribe(r=>{
        console.log('reset pass', r);
        this.resetSuccess="Password updated successfully";
        localStorage.removeItem('email');
        this.router.navigate(['/auth/login']);

      },(error: HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false){
          this.passwordExists="Your new password should be different to your old one";
            // clearing the inputs
            this.validateForm.reset();
        }
      });
      
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: FormBuilder, private userService:UserServiceService, private router:Router) { 
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
      confirm: ['', [,Validators.required, this.confirmValidator]]    
    });
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
    
  };

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls['confirm'].updateValueAndValidity());
  }

  passwordVisible = false;
  
  passwordVisibleConf = false;
 

  ngOnInit(): void {
  }

  afterClose(){
    this.resetSuccess="";
  }

  afterClosePassExists(){
    this.passwordExists="";
  }

}
