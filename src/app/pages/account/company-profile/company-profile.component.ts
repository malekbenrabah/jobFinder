import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import{ faIdBadge,faSuitcase, faLock, faCamera, faLocationDot, faTrash, faUsers}from"@fortawesome/free-solid-svg-icons"
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/services/user/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job, JobType, Sector } from 'src/app/services/user/model/Job';
import { differenceInCalendarDays, setHours } from 'date-fns';

import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { DatePipe, formatDate } from '@angular/common';
import { Skill } from 'src/app/services/user/model/Skill';
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  validateForm!: FormGroup;
  validateFormPass!:FormGroup;
  addJobFormStep1!:FormGroup;
  addJobFormStep2!:FormGroup;
  addJobFormStep3!:FormGroup;

  updateJobFormStep1!:FormGroup;
  updateJobFormStep2!:FormGroup;
  updateJobFormStep3!:FormGroup;
  constructor(private fb: FormBuilder, private userService:UserServiceService, private router:Router, private jobService:JobService, private datePipe:DatePipe, private route:ActivatedRoute) { 

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

    
    /*add job*/

    this.addJobFormStep1=this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      jobType:['', [Validators.required]],
      sector:['', [Validators.required]],

    });

    this.addJobFormStep2=this.fb.group({
      experience:['', [Validators.required]],
      diploma:['', [Validators.required]],
      skills:[''],

    });

    this.addJobFormStep3=this.fb.group({
      deadLine:[],
      location:['', [Validators.required]],
    });

    /*update job*/

    this.updateJobFormStep1=this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      jobType:['', [Validators.required]],
      sector:['', [Validators.required]],

    });

    this.updateJobFormStep2=this.fb.group({
      experience:['', [Validators.required]],
      diploma:['', [Validators.required]],
      skills:[''],

    });

    this.updateJobFormStep3=this.fb.group({
      deadLine:[],
      location:['', [Validators.required]],
    });

  }

  profileIcon=faIdBadge;
  jobIcon=faSuitcase;
  securityIcon=faLock;
  updateImgIcon=faCamera;
  updateIcon=faPenToSquare;
  deleteIcon=faTrash;
  usersIcon=faUsers;
  selectedProfileOption:string='profile';

  user:User=new User;
  companyJobs:Job[]=[];
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const selectedProfileOption = params['selectedProfileOption'];
      if (selectedProfileOption === 'jobs') {
        this.selectedProfileOption = 'jobs';
      }
      if(selectedProfileOption === 'security'){
        this.selectedProfileOption = 'security';
      }
    });
    
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
        this.validateFormPass.reset();

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
  
  /*add Job MODAL */

  jobModal = false;

  addJobModal(){
    this.jobModal=true;
  } 
  handleOkJobModal(): void {
    this.jobModal = false;
  }

  handleCancelJobModal(): void {
    this.jobModal = false;
  }
  //stepper
  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    const currentStepForm = this.getCurrentStepForm();
    if(currentStepForm.valid){
      this.current += 1;
      this.changeContent();
      console.log('infos',currentStepForm.value);
    }else {
      Object.values(currentStepForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    
  }

  getCurrentStepForm(): FormGroup {
    if (this.current === 0) {
      return this.addJobFormStep1;
    } else if (this.current === 1) {
      return this.addJobFormStep2;
    } else if (this.current === 2) {
      return this.addJobFormStep3;
    }
    //return empty grp if the current step is invalid
    return this.fb.group({});
  }

  done(): void {
    console.log('done');
    console.log('step1', this.addJobFormStep1.value);
    console.log('step2', this.addJobFormStep2.value);
    console.log('step3', this.addJobFormStep3.value);
    console.log('deadline',this.addJobFormStep3.value['deadLine']);
    const deadline=this.addJobFormStep3.value['deadLine'];
    const addedDate = new Date(deadline);
    addedDate.setHours(addedDate.getHours() + 1);

    const formatedDeadLine:any=this.datePipe.transform(this.addJobFormStep3.value['deadLine'], 'yyyy-MM-ddTHH:mm:ss');
    console.log('formatted deadline', formatedDeadLine);

    if(this.addJobFormStep3.valid){

      
      const job=new Job();
      job.title=this.addJobFormStep1.value['title'];
      job.description=this.addJobFormStep1.value['description'];
      job.jobType=this.addJobFormStep1.value['jobType'];
      job.experience=this.addJobFormStep2.value['experience']
      job.deadline=formatedDeadLine;
      job.location=this.addJobFormStep3.value['location'];
      job.sector=this.addJobFormStep1.value['sector'];
      job.diploma=this.addJobFormStep2.value['diploma'];


      //adding a job
      const skills:Skill[]=[];
      this.tags.forEach(tag => {
        const skill=new Skill();
        skill.skill=tag;
        skills.push(skill);
      });
      job.skills=skills;

      this.jobService.addJob(job).subscribe((response)=>{
        console.log('job add success', response);
        this.handleCancelJobModal();
        
        this.ngOnInit();
        
        

      });


    }else {
      Object.values(this.addJobFormStep3.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }



  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  //add Job
  jobSector = Object.values(Sector);
  jobType=Object.values(JobType);


  selectedJobTypeValue: any=null;
  selectedJobLevelValue: any=null;
  addJob(){

  }

  //skills tag 

  tags : string[]=[];
  inputVisible = false;
  inputValueControl: FormControl = new FormControl('');
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    console.log('After removing: ',this.tags);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    
    if (this.validateForm.value['inputValue'] && this.tags.indexOf(this.validateForm.value['inputValue']) === -1) {
      this.tags = [...this.tags, this.validateForm.value['inputValue']];
    }
    this.validateForm.value['inputValue'] = '';
    this.inputVisible = false; const inputValue = this.inputValueControl.value;
    if (inputValue && this.tags.indexOf(inputValue) === -1) {
      this.tags = [...this.tags, inputValue];
    }
    console.log('TAGS-SKILLS: ',this.tags);
    this.inputValueControl.reset('');
    this.inputVisible = false;
  }
  //end skills tag 

  //deadline picker
  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
  differenceInCalendarDays(current, this.today) < 0;

  
  /*
  disabledDateTime: DisabledTimeFn = () => ({
   
    
    nzDisabledHours: () => this.range(0, this.today.getHours()),
    nzDisabledMinutes: () => this.range(0, this.today.getMinutes()),
    nzDisabledSeconds: () => [55, 56]
  });
  */
 

  disabledDateTime: any = (current: Date) => {
    
    
    if (differenceInCalendarDays(current, this.today) === 0) {
      // Disable previous times for today
      return {
        nzDisabledHours: () => this.range(0, this.today.getHours()),
        nzDisabledMinutes: () => this.range(0, this.today.getMinutes()),
        nzDisabledSeconds: () => [55, 56]
      };
    }
  
    // Allow any time for future dates
    return {};
  };

  /*END ADD JOB*/

  /*delete Job*/
  deletJobPost(id:number){
  
    Swal.fire({
      title: 'Proceed deleting posted ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.deleteJob(id).subscribe((response)=>{
          console.log('delete successflly', response);
          Swal.fire(
            'Deleted!',
            'This job post has been deleted.',
            'success'
          );
          this.ngOnInit();

        })
       
      }
    })
  }
  /*end delete job*/

  /*update Job */
  
  //update Job Modal 
  updateModal = false;
  updatedJob:Job=new Job();

  updateJobModal(id:number): void {
    this.updateModal = true;
    this.jobService.getJobById(id).subscribe((response)=>{
      this.updatedJob=response as Job;

      console.log('job to update', this.updatedJob);
      // updating form controls with job data
    
      this.updateJobFormStep1.patchValue({
        title: this.updatedJob.title,
        description:this.updatedJob.description,
        jobType:this.updatedJob.jobType,
        sector:this.updatedJob.sector,
  
      });
  
      this.updateJobFormStep2.patchValue({
        experience:this.updatedJob.experience,
        diploma:this.updatedJob.diploma,
        skills:this.updatedJob.skills,
  
      });
  
      
      this.updateJobFormStep3.patchValue({
        deadLine:this.formatingDate(this.updatedJob.deadline),
        location:this.updatedJob.location,
      });

    });
  }

  formatingDate(created_at: any[]) {

    const year = created_at[0];
    const month = created_at[1] - 1; // months in js are 0-based
    const day = created_at[2];
    const hours = created_at[3];
    const minutes = created_at[4];
    const seconds = created_at[5];

    return new Date(year, month, day, hours, minutes, seconds);
   
  }
  okUpdateModal(): void {
    console.log('click ok');
    this.updateModal = false;
  }

  cancelUpdateModal(): void {
    this.updateModal = false;
  }

  //stepper update
  currentUpdate = 0;

  indexUpdate = 'First-content-update';

  preUpdate(): void {
    this.currentUpdate -= 1;
    this.changeContentUpdate();
  }

  nextUpdate(): void {
    const currentStepForm = this.getCurrentStepFormUpdate();
    if(currentStepForm.valid){
      this.currentUpdate += 1;
      this.changeContentUpdate();
      console.log('infos',currentStepForm.value);
    }else {
      Object.values(currentStepForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    
  }

  getCurrentStepFormUpdate(): FormGroup {
    if (this.currentUpdate === 0) {
      return this.updateJobFormStep1;
    } else if (this.currentUpdate === 1) {
      return this.updateJobFormStep2;
    } else if (this.currentUpdate === 2) {
      return this.updateJobFormStep3;
    }
    //return empty grp if the current step is invalid
    return this.fb.group({});
  }

  doneUpdate(): void {
    console.log('done');
    console.log('step1', this.updateJobFormStep1.value);
    console.log('step2', this.updateJobFormStep2.value);
    console.log('step3', this.updateJobFormStep3.value);
    console.log('formated Date',this.updateJobFormStep3.value['deadLine']);
    const formatedDeadLine: any=this.datePipe.transform(this.updateJobFormStep3.value['deadLine'], 'yyyy-MM-ddTHH:mm:ss');
    console.log('formatted deadline', formatedDeadLine);

    if(this.updateJobFormStep3.valid){

      
      const job=new Job();
      job.id=this.updatedJob.id;
      job.title=this.updateJobFormStep1.value['title'];
      job.description=this.updateJobFormStep1.value['description'];
      job.jobType=this.updateJobFormStep1.value['jobType'];
      job.experience=this.updateJobFormStep2.value['experience']
      job.deadline=formatedDeadLine;
      job.location=this.updateJobFormStep3.value['location'];
      job.sector=this.updateJobFormStep1.value['sector'];
      job.diploma=this.updateJobFormStep2.value['diploma'];

      if(this.tagsupdate.length!==0){
        const skills:Skill[]=[];
        this.tagsupdate.forEach(tag => {
          const skill=new Skill();
          skill.skill=tag;
          skills.push(skill);
        });
        job.skills=skills;
      }else{
        job.skills=this.updatedJob.skills;
      }
      
      console.log('job entity to update', job);
      
      this.jobService.updateJob(job).subscribe((response)=>{
        console.log('update successfully', response);
        
        
        this.ngOnInit();
        
      });
      

      


    }else {
      Object.values(this.updateJobFormStep3.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }



  }

  changeContentUpdate(): void {
    switch (this.currentUpdate) {
      case 0: {
        this.indexUpdate = 'First-content-update';
        break;
      }
      case 1: {
        this.indexUpdate = 'Second-content-update';
        break;
      }
      case 2: {
        this.indexUpdate = 'third-content-update';
        break;
      }
      default: {
        this.indexUpdate = 'error';
      }
    }
  }

  /*update skills tag */
  tagsupdate : string[]=[];
  inputVisibleUpdate = false;
  inputValueControlUpdate: FormControl = new FormControl('');
  @ViewChild('inputElementUpdate', { static: false }) inputElementUpdate?: ElementRef;

  handleCloseUpdate(skillId:number): void {
    this.jobService.deleteJobSkill(this.updatedJob.id,skillId).subscribe((response)=>{
      console.log(response);
      
    });
  }

  sliceTagNameUpdate(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInputUpdate(): void {
    this.inputVisibleUpdate = true;
    setTimeout(() => {
      this.inputElementUpdate?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirmUpdate(): void {
    
    this.inputVisibleUpdate = false; 
    const inputValue = this.inputValueControlUpdate.value;
    if (inputValue && this.tagsupdate.indexOf(inputValue) === -1) {
      this.tagsupdate = [...this.tagsupdate, inputValue];
    }
    console.log('TAGS-SKILLS: ',this.tagsupdate);
    this.inputValueControlUpdate.reset('');
    this.inputVisibleUpdate = false;
  }

  displayCandidates(id:number){
    localStorage.setItem('jobIdForcandidates',id.toString());
  }
  


  
  
 
  
  
  
  
  

  
  

}
