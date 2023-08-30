import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { omit } from 'lodash';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedAccountType: string = 'user';

  validateForm: FormGroup;


  constructor(private fb: FormBuilder, private router:Router) {
    this.validateForm = this.fb.group({
      company:['', [Validators.required]],
      firstname:['', [Validators.required]],
      lastname:['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required,this.confirmValidator]]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const data = omit(this.validateForm.value,'confirm');
      console.log('request without confirm', data);
      
      const userInfo={
        firstname:this.validateForm.value['firstname'],
        lastname :  this.validateForm.value ['lastname'],
        email:this.validateForm.value['email'],
        password:this.validateForm.value['password'],
        role:'MANAGER'
      }
      console.log('final user info',userInfo);
      /* to do :  
      this.autService.register(userInfo).subscribe(r=>{
        this.responseData=r;
        console.log('result',this.responseData);
        localStorage.setItem('token',this.responseData['token']);
        this.router.navigate(['']);
      });
      */
    }else{
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls['confirm'].updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
    
  };

 

  passwordVisible = false;
  
  passwordVisibleConf = false;

  

  ngOnInit(): void {
  }

}
 

