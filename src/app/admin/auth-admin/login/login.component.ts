import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user/user-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;

  responseData:any;
  
  loginError:boolean=false;
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      
      this.userService.login(this.validateForm.value).subscribe(r=>{
        if(r !=null){
          this.responseData=r;
          console.log('result',this.responseData);
          localStorage.setItem('token',this.responseData['token']);
          this.router.navigate(['/admin']);
        }
      },
        error=>{
          console.log(error);
          this.loginError=true;
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: FormBuilder, private userService: UserServiceService, private router:Router) {}

 
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email,Validators.required]],
      password: [null, [Validators.required]]  
    });

    
    if(this.userService.isLoggedIn()){
      this.router.navigate(['/admin']);
    }
  }

}
