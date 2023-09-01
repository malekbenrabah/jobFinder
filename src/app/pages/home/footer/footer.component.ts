import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  fbIcon=faFacebook; 
  TwitterIcon=faTwitter;
  InstagramIcon=faInstagram;
  MailIcon=faEnvelope;

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  submitForm(): void {
    console.log('forgot password begin');
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      console.log('email',this.validateForm.value['email']);
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

}
