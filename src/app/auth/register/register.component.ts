import { Component, OnInit ,ElementRef, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { omit } from 'lodash';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myBuildingIcon=faBuilding;
  
  selectedAccountType: string = 'USER';

  validateForm: FormGroup;
  validateFormCompany: FormGroup;

  constructor(private fb: FormBuilder, private router:Router,private userService:UserServiceService) {
    this.validateForm = this.fb.group({
      firstname:['', [Validators.required]],
      lastname:['', [Validators.required]],
      email: ['', [Validators.email, Validators.required],[this.userEmailAsyncValidator]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required,this.confirmValidator]]
    });

    this.validateFormCompany=this.fb.group({
      companyName:['', [Validators.required], [this.companyNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required],[this.companyEmailAsyncValidator]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required,this.confirmValidatorCompany]]
    });
  }


  companyNameAsyncValidator = (control: FormControl) =>{
    const companyName=control.value;
    console.log('companyName',companyName);
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userService.checkCompanyName(companyName).subscribe(
        (exists) => {
          console.log('exists', exists);
          if (exists) {
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        (error) => {
          console.error('Error:', error);
          observer.next(null);
          observer.complete();
        }
      );
    });
  };


  userEmailAsyncValidator = (control: FormControl) =>{
    const email=control.value;
    console.log('userEmail',email);
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userService.checkUserEmail(email).subscribe(
        (exists) => {
          console.log('exists', exists);
          if (exists) {
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        (error) => {
          console.error('Error:', error);
          observer.next(null);
          observer.complete();
        }
      );
    });
  };

  companyEmailAsyncValidator = (control: FormControl) =>{
    const email=control.value;
    console.log('userEmail',email);
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userService.checkUserEmail(email).subscribe(
        (exists) => {
          console.log('exists', exists);
          if (exists) {
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        (error) => {
          console.error('Error:', error);
          observer.next(null);
          observer.complete();
        }
      );
    });
  };

  

  responseData:any;

  emailExists:string="";
  companyNameExists:string="";

  submitForm(){

    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const data = omit(this.validateForm.value,'confirm');
      console.log('request without confirm', data);
      const userInfo={
        firstname:this.validateForm.value['firstname'],
        lastname :  this.validateForm.value ['lastname'],
        email:this.validateForm.value['email'],
        password:this.validateForm.value['password'],
        role:this.selectedAccountType
      }
      console.log('final user info',userInfo);
    
      this.userService.register(userInfo).subscribe(r=>{
        this.responseData=r;
        console.log('result',this.responseData);
        localStorage.setItem('token',this.responseData['token']);
        this.router.navigate(['']);
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false && error.error.message==="Email already exists !! "){
         this.emailExists="Email already exists";
         this.validateForm.reset();
        }
        
      });
    
      
    }else{
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

  }

  submitFormCompany(): void {
  
    if (this.validateFormCompany.valid) {
      console.log('submit', this.validateFormCompany.value);
      const data = omit(this.validateFormCompany.value,'confirm');
      console.log('request without confirm', data);
      const userInfo={
        companyName:this.validateFormCompany.value['companyName'],
        email:this.validateFormCompany.value['email'],
        password:this.validateFormCompany.value['password'],
        role:this.selectedAccountType
      }
      console.log('final user info',userInfo);
    
      
      

      this.userService.register(userInfo).subscribe(r=>{
        this.responseData=r;
        console.log('result',this.responseData);
        localStorage.setItem('token',this.responseData['token']);
        this.router.navigate(['']);
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false && error.error.message==="Email already exists !! "){
         this.emailExists="Email already exists";
         this.validateForm.reset();
        }
        if(error.status === 400 && error.error.success === false && error.error.message==="Company Name already exists"){
          this.companyNameExists="Company Name already exists";
          this.validateForm.reset();
        }
      });
      
    
      
    }else{
      Object.values(this.validateFormCompany.controls).forEach(control => {
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

  resetFormCompany(e: MouseEvent): void {
    e.preventDefault();
    this.validateFormCompany.reset();
    for (const key in this.validateFormCompany.controls) {
      if (this.validateFormCompany.controls.hasOwnProperty(key)) {
        this.validateFormCompany.controls[key].markAsPristine();
        this.validateFormCompany.controls[key].updateValueAndValidity();
      }
    }
  }



  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls['confirm'].updateValueAndValidity());
  }

  validateConfirmPasswordCompany(): void{
    setTimeout(() => this.validateFormCompany.controls['confirm'].updateValueAndValidity());

  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
    
  };

  confirmValidatorCompany = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateFormCompany.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
    
  };

 

  passwordVisible = false;
  
  passwordVisibleConf = false;


  passwordVisibleCompany = false;
  
  passwordVisibleConfCompany = false;

  

  ngOnInit(): void {
  }

  afterCloseError(){
    this.emailExists="";
    this.companyNameExists="";
  }

  

 
}
 

