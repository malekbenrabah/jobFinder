import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import{ faIdBadge,faSuitcase, faLock, faCamera, faLocationDot}from"@fortawesome/free-solid-svg-icons"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/services/user/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  validateForm!: FormGroup;
  validateFormPass!:FormGroup;

  constructor(private fb: FormBuilder, private userService:UserServiceService, private router:Router, private jobService:JobService) { 
    this.validateForm = this.fb.group({
      companyName: ['', [Validators.required]],
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

  profileIcon=faIdBadge;
  jobIcon=faSuitcase;
  securityIcon=faLock;
  updateImgIcon=faCamera;

  selectedProfileOption='profile';

  user:User=new User;
  companyJobs:Job[]=[];
  ngOnInit(): void {
    /*user Info*/
    this.userService.getUserInfo().subscribe(r => {
      console.log('user info', r);
      this.user = r as User;

      // updating form controls with user data
      this.validateForm.patchValue({
        
        companyName: this.user.companyName,
        email: this.user.email,
        phone: this.user.phone,
        adresse:this.user.adresse,
        aboutMe:this.user.aboutMe,
      });


    },
      (error:HttpErrorResponse)=>{
        if(error.status===403){
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);

        }
    });

    /*company jobs*/
    this.jobService.getCompanyPostedJobs().subscribe((response)=>{
      console.log('companyJobs', response);
      this.companyJobs=response as Job[];
      this.totalItemsSearch=this.companyJobs.length;

      this.searchJobs = this.companyJobs;

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
        this.router.navigate(['/account/company-profile']);
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
            this.router.navigateByUrl('/account/company-profile');
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
      // Reload the current page
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/account/company-profile']);
      });
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
        
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400 && error.error.success === false){
         
          this.invalidOldPassError="Invalid old password";
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

  /*JOBS*/
  myLocationIcon=faLocationDot;
  myJob=faSuitcase;
  //pagination search 
  currentPageSearch = 1; // initializing to the first page
  itemsPerPageSearch = 6; // nb of items to display per page
  totalItemsSearch!:number; // total nb of items (adjust as needed)

  changePageSearch(page: number) {
    this.currentPageSearch = page;
  }

  get startIndexSearch() {
    return (this.currentPageSearch - 1) * this.itemsPerPageSearch;
  }

  get endIndexSearch() {
    return this.currentPageSearch * this.itemsPerPageSearch;
  }
  //formatting the date
  formatDate(created_at: any[]): string {

    const year = created_at[0];
    const month = created_at[1] - 1; // months in js are 0-based
    const day = created_at[2];
    const hours = created_at[3];
    const minutes = created_at[4];
    const seconds = created_at[5];

    const createdAt = new Date(year, month, day, hours, minutes, seconds);

    const now = new Date();
    const elapsed = now.getTime() - createdAt.getTime();

    if (elapsed < 60000) {
      return 'Just now';
    } else if (elapsed < 3600000) {
      const minutes = Math.floor(elapsed / 60000);
      return `${minutes} minutes ago`;
    } else if (elapsed < 86400000) {
      const hours = Math.floor(elapsed / 3600000);
      return `${hours} hours ago`;
    } else {
      const year = createdAt.getFullYear();
      const month = String(createdAt.getMonth() + 1).padStart(2, '0');
      const day = String(createdAt.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    }
    
  }

  
 

  /*search*/
  searchJobs:Job[]=[];
  search:string='';
  searchJob(){ 

    if(this.companyJobs.length===0 || this.search===''){
      this.searchJobs=this.companyJobs;
      console.log('searchJobs', this.searchJobs);
      console.log('company JObs', this.companyJobs);
    }else{
      
     console.log('search starts');
     console.log('COMPANY JOBS', this.companyJobs);
     console.log('search:',this.search);
     const searchText=this.search.toLocaleLowerCase();

      this.searchJobs = this.companyJobs.filter((job) => {
        const titleMatch = job.title.toLowerCase().includes(searchText);
        const locationMatch = job.location.toLowerCase().includes(searchText);
        const sectorMatch = job.sector.toLowerCase().includes(searchText);
        const jobTypeMatch = job.jobType.toLowerCase().includes(searchText);
        const created_atMatch=this.formatDate(job.created_at).includes(searchText);
    
        // return true if any of the properties match the search text
        return titleMatch || locationMatch || sectorMatch || jobTypeMatch || created_atMatch;
      });

      this.totalItemsSearch=this.searchJobs.length;

      console.log('search jobs filter', this.searchJobs);
    }
    

  }
  /*end search*/
  

}
