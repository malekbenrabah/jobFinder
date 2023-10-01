import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/services/user/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {


  updateImgIcon=faCamera;


  validateForm!: FormGroup;
  validateFormPass!:FormGroup;
  constructor(private fb: FormBuilder,private userService:UserServiceService, private router:Router) {
    this.validateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname:['',[Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern('[0-9]*')]],
      adresse:[''],
      aboutMe:[''],
    });

    this.validateFormPass=this.fb.group({
      oldpass:['', [Validators.required]],
      password: ['', [this.confirmNewPass]],
      confirm: ['', [this.confirmValidator]]
    });
  }

  user:User=new User;
  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(r => {
      console.log('user info', r);
      this.user = r as User;

      // updating form controls with user data
      this.validateForm.patchValue({
        
        firstname:this.user.firstname,
        lastname:this.user.lastname,
        email: this.user.email,
        phone: this.user.phone,
        adresse:this.user.adresse,
        aboutMe:this.user.aboutMe,
      });


    },
      (error:HttpErrorResponse)=>{
        if(error.status===403){
          localStorage.removeItem('token');
          this.router.navigate(['/admin/admin-auth/login']);

        }
    });
  }

  profileUpdatedSucc:string="";
  submitForm(): void {
    console.log('update start');    
    if (this.validateForm.valid) {
      console.log('submit update', this.validateForm.value);
      this.userService.updateUserInfo(this.validateForm.value).subscribe(r=>{
        console.log('updated sucessuflly',r);
        this.profileUpdatedSucc="Profile updated successfully";
        this.router.navigate(['/admin/account']);
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

  cancel(): void {
    console.log('cancel');
  }

  afterCloseProfile(){
    this.profileUpdatedSucc="";
  }

  /*photo*/
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadedPhoto: any | null = null;
  file!: File;
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      // display the selected image in the UI
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedPhoto = e.target.result;
        console.log('selected photo', this.uploadedPhoto);

        //confirmation sweet alert
        this.openConfirmation();
      };

      reader.readAsDataURL(this.file);
    }
  }

  triggerFileInputClick(){
    const fileInput = this.fileInput.nativeElement as HTMLInputElement;
    fileInput.click();
        
  }

  openConfirmation(){
    if(this.uploadedPhoto){
      Swal.fire({
        title: 'Proceed updating your profile picture ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor:"#05264E"
        }).then((result) => {
        if (result.isConfirmed) {
           
            this.updateImg();
        } else {
            //cancel, reset the file input
            const fileInput = this.fileInput.nativeElement as HTMLInputElement;
            fileInput.value = ''; // clearing the selected file
            this.uploadedPhoto = null; // reset the uploaded photo
            this.router.navigateByUrl('/admin/account');
        }
      }); 
    } else {
      console.warn('No file selected for update.');
    }
   
  }

 

  updateImg(){

    console.log('update img start');
    console.log('the file to update ', this.file);
   
      this.userService.updateProfileImg(this.file)
        .subscribe(
          (response) => {
            
            console.log('Image updated successfully:', response);
            this.profileUpdatedSucc="Profile updated successfully";
            this.ngOnInit();
            this.handleCancelMiddle();
            
          },
          (error) => {
            console.error('Error updating image:', error);
          }
        );
   
  }

  
  getFirstLetter(name:string){
    if(name && name.length>0){
      return name.charAt(0).toLocaleUpperCase();
    }
    return'';
  }

  //modal photo
  isVisibleMiddle = false;

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }
  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  //delete Photo 

  deleteCurrentPhoto(){
    this.userService.updateProfileImg(null).subscribe(r=>{
      console.log('reset photo succesflly',r);
      this.profileUpdatedSucc="Profile updated successfully";
      this.ngOnInit();
      this.handleCancelMiddle();
      //this.router.navigate(['/admin/account']);
      /*
      // Reload the current page
     
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/account']);
      });
      */
    },(error:HttpErrorResponse) => {
      console.error('Error updating user', error);
      if(error.status === 403 ){
        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });      
      }
    });
  }

  /*end photo */

  /*update password*/
  passwordVisible = false;
  
  passwordVisibleConf = false;

  passwordVisibleOld=false;


  validateConfirmPassword(): void {
    setTimeout(() => this.validateFormPass.controls['confirm'].updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateFormPass.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
    
  };

  confirmNewPass = (control: FormControl): { [s: string]: boolean } =>{
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value === this.validateFormPass.controls['oldpass'].value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  validateNewPassword():void{
    setTimeout(() => this.validateFormPass.controls['password'].updateValueAndValidity());
  }

  invalidOldPassError:string="";
  successUpdatePass:string="";
  updatePassForm(){

    if(this.validateFormPass.valid){
      console.log('test ',this.validateFormPass.value);
      console.log('oldpass',this.validateFormPass.value['oldpass']);

      this.userService.updatePassword(this.validateFormPass.value['oldpass'],this.validateFormPass.value['password']).subscribe(r=>{
        console.log('updated successfully');
        this.successUpdatePass="your password is updated successsfully";
        this.validateFormPass.reset();

      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false){
         
          this.invalidOldPassError="Invalid old password";
        }

        if(error.status === 403 ){
          console.error('Error updating password', error);

          this.userService.logout().subscribe(()=>{
            console.log('logout api works!');
            localStorage.clear();
            this.router.navigate(['/admin/admin-auth/login']);
      
          });      
        }
        
      }
      );
    }

  }

  afterClose(){
    this.invalidOldPassError="";
  }

  afterCloseSuccessUpdate(){
    this.successUpdatePass="";
  }



}
