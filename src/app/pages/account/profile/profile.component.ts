import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { faBookmark, faBell} from '@fortawesome/free-regular-svg-icons';
import{ faIdBadge, faLock,faLocationDot}from"@fortawesome/free-solid-svg-icons"
import{faSuitcase, faGraduationCap, faUserTie,faCamera} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { User } from 'src/app/services/user/model/user';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Skill } from 'src/app/services/user/model/Skill';
import { Experience } from 'src/app/services/user/model/Experience';
import { formatDate } from '@angular/common';
import { Education } from 'src/app/services/user/model/Education';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { Job, JobType } from 'src/app/services/user/model/Job';
import { JobService } from 'src/app/services/jobs/job.service';
import { JobAlert } from 'src/app/services/user/model/JobAlert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  saveIcone=faBookmark;
  profileIcon=faIdBadge;
  jobIcon=faSuitcase;
  appliedJobsIcon=faUserTie;
  securityIcon=faLock;
  updateImgIcon=faCamera;
  alertIcon=faBell;
  myLocationIcon=faLocationDot;


  educationIcon=faGraduationCap;


  validateForm!: FormGroup;

  /*stapper Forms*/
  validateFormEd!: FormGroup;

  validateFormExp!: FormGroup;

  validateFormSkills!:FormGroup;

  formJobAlert!: FormGroup;

  validateFormPass!:FormGroup;

  constructor(private fb: FormBuilder, private userService:UserServiceService, private router:Router,private elementRef: ElementRef, private jobService:JobService) {

    this.validateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern('[0-9]*')]],
      aboutMe:[''],
    });

    this.formJobAlert = this.fb.group({
      experience: ['', [Validators.required]],
      location: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      skills:['']
      
    });
    
    this.validateFormPass=this.fb.group({
      oldpass:['', [Validators.required]],
      password: ['', [this.confirmNewPass]],
      confirm: ['', [this.confirmValidator]]
    });
  
  }

  user:User=new User;
  ngOnInit(): void {

    //user Info  
    this.userService.getUserInfo().subscribe(r => {
      console.log('user info', r);
      this.user = r as User;

      // updating form controls with user data
      this.validateForm.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        phone: this.user.phone,
        aboutMe:this.user.aboutMe,
      });


    },
      (error:HttpErrorResponse)=>{
        if(error.status===403){
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);

        }
    });

    console.log('tags',this.tags);

    //education form  
    this.validateFormEd = this.fb.group({});
    this.fetchUserEd();

    //experience form 
    this.validateFormExp= this.fb.group({
      
    });
    this.fetchUserExp();

    //skills
    this.validateFormSkills=this.fb.group({
    })
    this.fetchUserSkills();
    
    this.getAppliedJobs();
   
  }

  

  //profile update 

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
            this.router.navigateByUrl('/account/profile');
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



  /*photo*/
  profileUpdatedSucc:string="";
  submitForm(): void {
    console.log('update start');    
    if (this.validateForm.valid) {
      console.log('submit update', this.validateForm.value);
      
      this.userService.updateUserInfo(this.validateForm.value).subscribe(r=>{
        console.log('updated sucessuflly',r);
        this.profileUpdatedSucc="Profile updated successfully";
        this.router.navigate(['/account/profile']);
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

  

  /* modal */
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

  //delete current photo 

  deleteCurrentPhoto(){
    this.userService.updateProfileImg(null).subscribe(r=>{
      console.log('reset photo succesflly',r);
      // Reload the current page
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/account/profile']);
      });
    });
  }


  /*popup */

  cancel(): void {
    console.log('cancel');
  }

  afterCloseProfile(){
    this.profileUpdatedSucc="";
  }

  /*btn*/
  selectedProfileOption='profile';

  


  /*skills tag*/

  tags: string[] = [];

  inputVisible = false;
  inputValueControl: FormControl = new FormControl('');
  // initializing the first rate
  rateFormControl: FormControl= new FormControl(3); 

  //level

  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  //inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    console.log('TAGS-SKILLS: ',this.tags);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  
  showInput(): void {
    this.inputVisible = true;
    
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
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
  

  submitSkills(){
    
    
    console.log('Skill:');
    console.log('Rate:');
  

  }
  
  /*skills with level */

  listOfControlSkills: Array<{ 
    id: number; 
    controlInstance:{
      skill: string;
      level: string;
    };
  }> = [];



  originalSkillsCount: number = 0;

  addSkills(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    if (e) {
      e.preventDefault();
    }
  
    // add a new field with an incremented ID
    const id = this.listOfControlSkills.length > 0 ? this.listOfControlSkills[this.listOfControlSkills.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        skill:`skill${id}`,
        level:`level${id}` },
    };
    const index = this.listOfControlSkills.push(control);
    console.log('Skills add',this.listOfControlSkills[this.listOfControlSkills.length - 1]);
    
    this.validateFormSkills.addControl(
      control.controlInstance.skill,
      new FormControl(null, Validators.required)
    );

    this.validateFormSkills.addControl(
      control.controlInstance.level,
      new FormControl(3, Validators.required)
    ); 
  }

  /*
  addSkillssss(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

   
    // add a new field with an incremented ID
    const id = this.listOfControlSkills.length > 0 ? this.listOfControlSkills[this.listOfControlSkills.length - 1].id + 1 : 0;


    const control = {
      id,
      controlInstance: {
        skill:`skill${id}`,
        level:`level${id}` },
    };
    //const index = this.listOfControlSkills.push(control);
    console.log('Skills add',this.listOfControlSkills[this.listOfControlSkills.length - 1]);
    
    this.validateFormSkills.addControl(
      control.controlInstance.skill,
      new FormControl(null, Validators.required)
    );

    this.validateFormSkills.addControl(
      control.controlInstance.level,
      new FormControl(3, Validators.required)
    ); 
  }
  */




  removeSkills(i: { id: number;controlInstance: { skill: string; level: string} }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControlSkills.length > 0) {

      
    
      const index = this.listOfControlSkills.indexOf(i);

      

      this.listOfControlSkills.splice(index, 1);
      console.log('Skills Remove',this.listOfControlSkills);
      // Remove form controls for both inputs
      this.validateFormSkills.removeControl(i.controlInstance.skill);
      this.validateFormSkills.removeControl(i.controlInstance.level);

      if(i.controlInstance.skill!==null){
        //calling the removeSkill API
        // accessing the corresponding hidden input
        const hiddenInput = this.hiddenInputs[index];

        if(hiddenInput===null || hiddenInput===undefined){
          return;
        }

        const skillIdToRemove = hiddenInput.value;

        console.log('skill id to remove', skillIdToRemove);
          
          // Call the deleteSkill API with the skillIdToRemove
          this.userService.deleteSkill(parseInt(skillIdToRemove)).subscribe(
            (r) => {
              console.log('Skill removed successfully',r);
            },
            (error) => {
              console.error('Error removing skill:', error);
            }
          );  
      }
     
      

    }
  }

  updateSkill(i: { id: number;controlInstance: { skill: string; level: string} }, e: MouseEvent){
    e.preventDefault();
    if (this.listOfControlSkills.length > 0) {
      const index = this.listOfControlSkills.indexOf(i);

      const hiddenInput = this.hiddenInputs[index];
      const skillIdToUpdate = hiddenInput.value;
      console.log('skill id to Update', skillIdToUpdate);

      const skillControlName = this.listOfControlSkills[index].controlInstance.skill;
      const levelControlName = this.listOfControlSkills[index].controlInstance.level;
  
      const skillValue = this.validateFormSkills.get(skillControlName)?.value;
      const levelValue = this.validateFormSkills.get(levelControlName)?.value;

      const userskill:Skill=new Skill();
      userskill.skill=skillValue;
      userskill.level=levelValue;
      userskill.id=parseInt(skillIdToUpdate);

      console.log('skill to update', skillValue);
      console.log('level to update', levelValue);

      this.userService.updateSkill(userskill).subscribe((r)=>{
        console.log('skill updated successfully',r)
        this.router.navigateByUrl('/account/profile');
      }, 
      (error) => {
        console.error('Error removing skill:', error);
      });

    }

  }

  submitFormSkill(): void {

    if (this.validateFormSkills.valid) {

      //updating the old dirty inputs  

      // creating an array to keep track of updated skills
      const updatedSkills: Skill[] = [];

      // Iterate through the hidden input fields
      this.hiddenInputs.forEach((hiddenInput, index) => {
        const skillId = hiddenInput.value;

        // Check if the corresponding skill control or level control is dirty
        const skillControlName = this.listOfControlSkills[index].controlInstance.skill;
        const levelControlName = this.listOfControlSkills[index].controlInstance.level;
        const skillValue = this.validateFormSkills.get(skillControlName)?.value;
        const levelValue = this.validateFormSkills.get(levelControlName)?.value;

        if (
          (this.validateFormSkills.get(skillControlName)?.dirty || this.validateFormSkills.get(levelControlName)?.dirty) &&
          skillValue !== null
        ) {
          const userskill: Skill = new Skill();
          userskill.skill = skillValue;
          userskill.level = levelValue;
          userskill.id = parseInt(skillId);

          updatedSkills.push(userskill);
        }
      });

      // Make API calls to update the dirty skills
      updatedSkills.forEach(skill => {
        console.log('skills to update ',skill);
        
        this.userService.updateSkill(skill).subscribe(
          (r) => {
            console.log('Skill updated successfully:', skill.id);
          },
          (error) => {
            console.error('Error updating skill:', error);
          }
        );
        
      });




      //adding a new control
      console.log('submit Skills ', this.validateFormSkills.value);

      const id = this.listOfControlSkills.length > 0 ? this.listOfControlSkills[this.listOfControlSkills.length - 1].id + 1 : 0;


      const control = {
        id,
        controlInstance: {
          skill: `skill${id}`,
          level: `level${id}`,
        },
      };

      // adding a new control without modifying the existing ones
      this.listOfControlSkills = [...this.listOfControlSkills, control];

      // adding form controls for the new skill and level
      this.validateFormSkills.addControl(
        control.controlInstance.skill,
        new FormControl(null, Validators.required)
      );

      this.validateFormSkills.addControl(
        control.controlInstance.level,
        new FormControl(3, Validators.required)
      );

      // iterating over the newly added controls
      const newControls = this.listOfControlSkills.slice(-1 * (this.listOfControlSkills.length - this.originalSkillsCount));

      

      //calling the addskil API 
      
      const formValue = this.validateFormSkills.value;
      newControls.forEach(control => {
        const skillValue = formValue[control.controlInstance.skill];
        console.log('skill test', skillValue);
        
        const levelValue=formValue[control.controlInstance.level];
        console.log('level test', levelValue);


        const userskill:Skill=new Skill();
        userskill.skill=skillValue;
        userskill.level=levelValue;

       
        if(skillValue!==null)
        this.userService.addSkills(userskill).subscribe((r)=>{
          console.log('skills successfully', r);
        },
          (error)=>{
            console.log("error adding skills", error);
          }
        );

      });
      
    
    } else {
      Object.values(this.validateFormSkills.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  @ViewChild('skillInput', { static: false }) skillInput?: ElementRef;

  hiddenInputs: HTMLInputElement[] = [];

  userSkills:Skill[]=[]
  fetchUserSkills() {
    this.userService.getUserSkills().subscribe(
      (response) => {
        console.log('user skills', response);

        this.userSkills=response as Skill[];


        // skills is an array of Skill objects
        const skills: Skill[] = response as Skill[]; // Explicitly cast to Skill[]


        this.originalSkillsCount = skills.length;

  
        // clear the existing skills
        //this.listOfControlSkills = [];
  
        // Iterate over the retrieved skills and add them to the form
        skills.forEach((skill, index) => {
          //create a hidden input 
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `skillId${index}`;
          input.value = skill.id.toString();
          this.hiddenInputs.push(input);

          console.log('hidden input created',input.value);

          const control = {
            id: index,
            idSkill: skill.id,
            controlInstance: {
              skill: `skill${index}`,
              level: `level${index}`,
            },
          };
  
          this.listOfControlSkills.push(control);
  
          // Add form controls for skill name and level

          this.validateFormSkills.addControl(
            control.controlInstance.skill,
            new FormControl(skill.skill, Validators.required)
          );
  
          this.validateFormSkills.addControl(
            control.controlInstance.level,
            new FormControl(parseInt(skill.level), Validators.required)
          );

          /*
          if (this.skillInput) {
            this.skillInput.nativeElement.value = control.idSkill;
          }
          */
          console.log('fetch user Skills',control.idSkill);

          //this.router.navigateByUrl("/account/profile");
        });
      },
      (error) => {
        console.error('Error fetching user skills:', error);
      }
    );
  }
  
 


  /*
  addSkills3(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    
    const id = this.listOfControlSkills.length > 0 ? this.listOfControlSkills[this.listOfControlSkills.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        skill:`skill${id}`,
        level:`level${id}` },
    };
    const index = this.listOfControlSkills.push(control);
    console.log('Skills add',this.listOfControlSkills[this.listOfControlSkills.length - 1]);
    
    this.validateFormSkills.addControl(
      control.controlInstance.skill,
      new FormControl(null, Validators.required)
    );

    this.validateFormSkills.addControl(
      control.controlInstance.level,
      new FormControl(3, Validators.required)
    );

    //calling the addskil API 
   
    const formValue = this.validateFormSkills.value;
    this.listOfControlSkills.forEach(control => {
      const skillValue = formValue[control.controlInstance.skill];
      console.log('skill test', skillValue);
      
      const levelValue=formValue[control.controlInstance.level];
      console.log('level test', levelValue);

      const userskill:Skill=new Skill();
      userskill.skill=skillValue;
      userskill.level=levelValue;

      if(skillValue!==null)
      this.userService.addSkills(userskill).subscribe((r)=>{
        console.log('skills successfully', r);
      },
        (error)=>{
          console.log("error adding skills", error);
        }
      );

    });
    
     
  }
  

  addSkills2(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    // Check if there are any empty skill fields
    const hasEmptySkill = this.listOfControlSkills.some((control) => {
      const skillValue = this.validateFormSkills.get(control.controlInstance.skill)?.value;
      return skillValue === null || skillValue === '';
    });

    // Only add a new control if there are empty skill fields
    if (!hasEmptySkill) {
      return;
    }
    const id = this.listOfControlSkills.length > 0 ? this.listOfControlSkills[this.listOfControlSkills.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        skill:`skill${id}`,
        level:`level${id}`      },
    };
    const index = this.listOfControlSkills.push(control);
    console.log('Skills add',this.listOfControlSkills[this.listOfControlSkills.length - 1]);
    
    this.validateFormSkills.addControl(
      control.controlInstance.skill,
      new FormControl(null, Validators.required)
    );

    this.validateFormSkills.addControl(
      control.controlInstance.level,
      new FormControl(3, Validators.required)
    );

    //calling the addskil API 
   
    const formValue = this.validateFormSkills.value;
    this.listOfControlSkills.forEach(control => {
      const skillValue = formValue[control.controlInstance.skill];
      console.log('skill test', skillValue);
      
      const levelValue=formValue[control.controlInstance.level];
      console.log('level test', levelValue);

      const userskill:Skill=new Skill();
      userskill.skill=skillValue;
      userskill.level=levelValue;

      if(skillValue!==null)
      this.userService.addSkills(userskill).subscribe((r)=>{
        console.log('skills successfully', r);
      },
        (error)=>{
          console.log("error adding skills", error);
        }
      );

    });
    
    
    

    
  }
  */




  /*end skills with level  */
  skillRatings: { tag: string; rating: number }[] = [];

  addSkill(e?: MouseEvent): void {
    const skillTag = this.validateFormSkills.get('skillsInput')?.value;
    if (skillTag && skillTag.trim() !== '') {
      this.tags.push(skillTag);
      this.skillRatings.push({ tag: skillTag, rating: this.rateFormControl.value });
      this.validateFormSkills.get('skillsInput')?.setValue('');
      this.rateFormControl.setValue(0);
    }
  }

  removeSkill(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
      this.skillRatings.splice(index, 1);
    }
  }

  submitFormSkills() {
    // When you click the "Update" button, you can access this.tags and this.skillRatings to get the data.
    console.log('Skills:', this.tags);
    console.log('Ratings:', this.skillRatings);
  }

 


  /*Stepper */

  current = 0;

  index = 'Education';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'Education';
        break;
      }
      case 1: {
        this.index = 'Experience';
        break;
      }
      case 2: {
        this.index = 'Skills';
        break;
      }
      case 3: {
        this.index = 'CV';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  /*education form */

  listOfControl: Array<{ 
    id: number; 
    controlInstance:{
      input: string;
      institution:string;
      date: string;
    };
  }> = [];

  hiddenInputsEd: HTMLInputElement[] = [];
  originalEdCount: number = 0;
  

  

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        input:`degree${id}`,
        institution:`institution${id}`,
        date:`date${id}`

      },
    };
    const index = this.listOfControl.push(control);
    console.log('education',this.listOfControl[this.listOfControl.length - 1]);
    
    
    /*
    this.validateFormEd.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
    */

    // Add form controls for both input and select
    this.validateFormEd.addControl(
      control.controlInstance.input,
      new FormControl(null, Validators.required)
    );

    this.validateFormEd.addControl(
      control.controlInstance.institution,
      new FormControl(null, Validators.required)
    );

    this.validateFormEd.addControl(
      control.controlInstance.date,
      new FormControl(null, Validators.required)
    );



  }

  removeField(i: { id: number; controlInstance: { input: string; institution:string; date: string; } }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log('education',this.listOfControl);
      // Remove form controls for both input and select
      this.validateFormEd.removeControl(i.controlInstance.input);
      this.validateFormEd.removeControl(i.controlInstance.institution);
      this.validateFormEd.removeControl(i.controlInstance.date);    
   }
  }

  removeEducation(i: { id: number; controlInstance: { input: string; institution: string; date:string } }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {

      
    
      const index = this.listOfControl.indexOf(i);

      

      this.listOfControl.splice(index, 1);
      console.log('Education Remove',this.listOfControlExp);
      // Remove form controls for both inputs
      this.validateFormEd.removeControl(i.controlInstance.input);
      this.validateFormEd.removeControl(i.controlInstance.institution);
      this.validateFormEd.removeControl(i.controlInstance.date);



      if(i.controlInstance.input!==null){

        //calling the removeEducation API
        // accessing the corresponding hidden input
        const hiddenInputEd = this. hiddenInputsEd[index];
        if(hiddenInputEd===null || hiddenInputEd===undefined){
          return;
        }

        const edIdToRemove = hiddenInputEd.value;

        console.log('Education id to remove', edIdToRemove);
          
        // Call the deleteEducation API with the edIdToRemove
        this.userService.removeEducation(parseInt(edIdToRemove)).subscribe(
          (r) => {
            console.log('education removed successfully',r);
          },
          (error:HttpErrorResponse) => {
            console.error('Error removing education:', error);
            if(error.status === 403 ){
              this.router.navigate(['/auth/login']);
            }
          }
        );  
      }
     
      

    }
  }

  

  submitFormEducation(): void {

    if (this.validateFormEd.valid) {

      //updating the old dirty inputs  

      // creating an array to keep track of updated educations
      const updatedEds: Education[] = [];

      // Iterate through the hidden input fields
      this.hiddenInputsEd.forEach((hiddenInput, index) => {
        const educationId = hiddenInput.value;

        // Check if the corresponding skill control or level control is dirty
        const inputControlName = this.listOfControl[index].controlInstance.input;
        const inputValue = this.validateFormEd.get(inputControlName)?.value;

        const instituitionControlName = this.listOfControl[index].controlInstance.institution;
        const instituitionValue = this.validateFormEd.get(instituitionControlName)?.value;

        const dateControlName = this.listOfControl[index].controlInstance.date;
        const dateRangeControl = this.validateFormEd.get(dateControlName);

        if (
          (this.validateFormEd.get(inputControlName)?.dirty || this.validateFormEd.get(instituitionControlName)?.dirty) &&
          inputValue !== null && instituitionValue!==null && dateRangeControl!==null
        ) {

          if (dateRangeControl && dateRangeControl.value && Array.isArray(dateRangeControl.value) && dateRangeControl.value.length === 2) {
            const [startDate, endDate] = dateRangeControl.value;

            const userEducation: Education = new Education();
            userEducation.description = inputValue;
            userEducation.institution = instituitionValue;
            userEducation.id = parseInt(educationId);

            userEducation.startDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
            userEducation.endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

            updatedEds.push(userEducation);
          }
        }
      });

      // Make API calls to update the dirty experience
      updatedEds.forEach(education => {
        console.log('Education to update ',education);
        
        this.userService.updateEducation(education).subscribe(
          (r) => {
            console.log('Education updated successfully:', education.id);
          },
          (error:HttpErrorResponse) => {
            console.error('Error updating education:', error);
           
          }
        );
        
      });


      //Add Education

      //adding a new control
      console.log('submit education add ', this.validateFormEd.value);

      const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;


      const control = {
        id,
        controlInstance: {
          input:`experience${id}`,
          institution:`institution${id}`,
          date:`date${id}`
        },
      };

      // adding a new control without modifying the existing ones
      this.listOfControl = [...this.listOfControl, control];

      // adding form controls for the new skill and level
      this.validateFormEd.addControl(
        control.controlInstance.input,
        new FormControl(null, Validators.required)
      );

      this.validateFormEd.addControl(
        control.controlInstance.institution,
        new FormControl(null, Validators.required)
      );

      this.validateFormEd.addControl(
        control.controlInstance.date,
        new FormControl(null, Validators.required)
      );

      // iterating over the newly added controls
      const newControls = this.listOfControl.slice(-1 * (this.listOfControl.length - this.originalEdCount));

      

      //calling the addskil API 
      
      const formValue = this.validateFormEd.value;
      newControls.forEach(control => {
        const inputValue = formValue[control.controlInstance.input];
        console.log('input test', inputValue);
        
        const institutionValue=formValue[control.controlInstance.institution];
        console.log('level test', institutionValue);

        const dateValue=formValue[control.controlInstance.date];
        console.log('date value', dateValue);

        const dateRangeControl = this.validateFormExp.get(control.controlInstance.date);

        if (dateRangeControl && dateRangeControl.value && dateRangeControl.value.length === 2) {
          const [startDate, endDate] = dateRangeControl.value;

          const userEducation:Education=new Education();
          userEducation.description=inputValue;
          userEducation.institution=institutionValue;
          userEducation.startDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
          userEducation.endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

    
       
          if(inputValue!==null)
          this.userService.addEducation(userEducation).subscribe((r)=>{
            console.log('education added successfully', r);
          },
            (error:HttpErrorResponse)=>{
              console.log("error adding education", error);
              
            }
          );
          }

      });
      
    
    } else {
      Object.values(this.validateFormEd.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  userEds:Education[]=[]

  fetchUserEd() {
    this.userService.getUserEducations().subscribe(
      (response) => {
        console.log('user eeducations', response);
        this.userEds=response as Education[];

        // skills is an array of Skill objects
        const educations: Education[] = response as Education[]; // explicitly cast to Skill[]


        this.originalEdCount = educations.length;

  
  
        // iterate over the retrieved skills and add them to the form
        educations.forEach((education, index) => {
          //create a hidden input 
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `educationId${index}`;
          input.value = education.id.toString();
          this.hiddenInputsEd.push(input);

          console.log('hidden input created education',input.value);

          const control = {
            id: index,
            idEducation: education.id,
            controlInstance: {
              input:`degree${index}`,
              institution:`institution${index}`,
              date:`date${index}`
            },
          };
  
          this.listOfControl.push(control);
  
          // Add form controls for education description, instituition, and date

          this.validateFormEd.addControl(
            control.controlInstance.input,
            new FormControl(education.description, Validators.required)
          );
  
          this.validateFormEd.addControl(
            control.controlInstance.institution,
            new FormControl(education.institution, Validators.required)
          );
      
          
          this.validateFormEd.addControl(
            control.controlInstance.date,
            new FormControl([new Date(education.startDate),new Date(education.endDate)], Validators.required)
          );

       
          console.log('fetch user education',control.idEducation);

          //this.router.navigateByUrl("/account/profile");
        });
      },
      (error) => {
        console.error('Error fetching user experiences:', error);
      }
    );
  }


  /*
  submitFormEd(): void {
    if (this.validateFormEd.valid) {
      // extract only the year
      const formValue = this.validateFormEd.value;
      Object.keys(formValue).forEach(key => {
        if (formValue[key] instanceof Date) {
          formValue[key] = formValue[key].getFullYear();
        }
      });

      console.log('submit', this.validateFormEd.value);
    } else {
      Object.values(this.validateFormEd.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  */

  /*date picker year */
  //disable futur dates
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
    differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56]
  });

  /* end education form */

  /*experience form */

  listOfControlExp: Array<{ 
    id: number; 
    controlInstance:{
      input: string;
      location:string;
      date: string;
      
    };
  }> = [];


  
  hiddenInputsExperience: HTMLInputElement[] = [];
  originalExpCount: number = 0;

  
  addFieldExp(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControlExp.length > 0 ? this.listOfControlExp[this.listOfControlExp.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        input:`experience${id}`,
        location:`location${id}`,
        date:`date${id}`
      },
    };
    const index = this.listOfControlExp.push(control);
    console.log('experience',this.listOfControlExp[this.listOfControlExp.length - 1]);
    
    // adding form controls for both input
    this.validateFormExp.addControl(
      control.controlInstance.input,
      new FormControl(null, Validators.required)
    );

    this.validateFormExp.addControl(
      control.controlInstance.location,
      new FormControl(null, Validators.required)
    );

    
    this.validateFormExp.addControl(
      control.controlInstance.date,
      new FormControl(null, Validators.required)
    );

    



  }

  userExp:Experience[]=[]

  fetchUserExp() {
    this.userService.getUserExperiences().subscribe(
      (response) => {
        console.log('user experiences', response);
        this.userExp=response as Experience[];

        // skills is an array of Skill objects
        const experiences: Experience[] = response as Experience[]; // explicitly cast to Skill[]


        this.originalExpCount = experiences.length;

  
        // clear the existing skills
        //this.listOfControlSkills = [];
  
        // iterate over the retrieved skills and add them to the form
        experiences.forEach((experience, index) => {
          //create a hidden input 
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `experienceId${index}`;
          input.value = experience.id.toString();
          this.hiddenInputsExperience.push(input);

          console.log('hidden input created experience',input.value);

          const control = {
            id: index,
            idExperience: experience.id,
            controlInstance: {
              input:`experience${index}`,
              location:`location${index}`,
              date:`date${index}`
            },
          };
  
          this.listOfControlExp.push(control);
  
          // Add form controls for skill name and level

          this.validateFormExp.addControl(
            control.controlInstance.input,
            new FormControl(experience.description, Validators.required)
          );
  
          this.validateFormExp.addControl(
            control.controlInstance.location,
            new FormControl(experience.location, Validators.required)
          );
      
          
          this.validateFormExp.addControl(
            control.controlInstance.date,
            new FormControl([new Date(experience.startDate),new Date(experience.endDate)], Validators.required)
          );

       
          console.log('fetch user experiences',control.idExperience);

          //this.router.navigateByUrl("/account/profile");
        });
      },
      (error) => {
        console.error('Error fetching user experiences:', error);
      }
    );
  }

  submitFormExperience(): void {

    if (this.validateFormExp.valid) {

      //updating the old dirty inputs  

      // creating an array to keep track of updated experiences
      const updatedExp: Experience[] = [];

      // iterate through the hidden input fields
      this.hiddenInputsExperience.forEach((hiddenInput, index) => {
        const experienceId = hiddenInput.value;

        // check if the corresponding input control ,locatrion or date is dirty
        const inputControlName = this.listOfControlExp[index].controlInstance.input;
        const locationControlName = this.listOfControlExp[index].controlInstance.location;
        const inputValue = this.validateFormExp.get(inputControlName)?.value;
        const locationValue = this.validateFormExp.get(locationControlName)?.value;

       
        const dateControlName = this.listOfControlExp[index].controlInstance.date;
        const dateRangeControl = this.validateFormExp.get(dateControlName);


        console.log('update start');

        if (
          (this.validateFormExp.get(inputControlName)?.dirty || this.validateFormExp.get(inputControlName)?.dirty)&&
          inputValue !== null
        ) {
          console.log('dirty?');
          console.log('update skill id ', experienceId);

          console.log('date Range control', dateRangeControl);
         
          if (dateRangeControl && dateRangeControl.value && Array.isArray(dateRangeControl.value) && dateRangeControl.value.length === 2) {
            const [startDate, endDate] = dateRangeControl.value;

            console.log('date range working');
            const userExp: Experience = new Experience();
            userExp.description = inputValue;
            userExp.location = locationValue;
            userExp.id = parseInt(experienceId);
            userExp.startDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
            userExp.endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

            
            updatedExp.push(userExp);
          }
          
        }

        

      });

      // Make API calls to update the dirty experiences
      updatedExp.forEach(experience => {
      
        this.userService.updateExperience(experience).subscribe(
          (r) => {
            console.log('Experience updated successfully:', experience.id);
            this.router.navigateByUrl("/account/profile");
          },
          (error:HttpErrorResponse) => {
            console.error('Error updating experience:', error);
            if(error.status === 403 ){
              this.router.navigate(['/auth/login']);
            }
          }
        );
        
      });








      //Add Experience 

      //adding a new control
      console.log('submit experiences', this.validateFormExp.value);

      const id = this.listOfControlExp.length > 0 ? this.listOfControlExp[this.listOfControlExp.length - 1].id + 1 : 0;


      const control = {
        id,
        controlInstance: {
          input:`experience${id}`,
          location:`location${id}`,
          date:`date${id}`
        },
      };

      // adding a new control without modifying the existing ones
      this.listOfControlExp = [...this.listOfControlExp, control];

      // adding form controls for the new skill and level
      this.validateFormExp.addControl(
        control.controlInstance.input,
        new FormControl(null, Validators.required)
      );

      this.validateFormExp.addControl(
        control.controlInstance.location,
        new FormControl(null, Validators.required)
      );

      this.validateFormExp.addControl(
        control.controlInstance.date,
        new FormControl(null, Validators.required)
      );

      // iterating over the newly added controls
      const newControls = this.listOfControlExp.slice(-1 * (this.listOfControlExp.length - this.originalExpCount));

      

      //calling the addExperience API 
      
      const formValue = this.validateFormExp.value;
      newControls.forEach(control => {
        const inputValue = formValue[control.controlInstance.input];
        console.log('input test', inputValue);
        
        const locationValue=formValue[control.controlInstance.location];
        console.log('location test', locationValue);

        const dateValue=formValue[control.controlInstance.date];
        console.log('date value', dateValue);

        const dateRangeControl = this.validateFormExp.get(control.controlInstance.date);

        if (dateRangeControl && dateRangeControl.value && dateRangeControl.value.length === 2) {
          const [startDate, endDate] = dateRangeControl.value;


          const userExp:Experience=new Experience();
          userExp.description=inputValue;
          userExp.location=locationValue;
          userExp.startDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
          userExp.endDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

       
          if(inputValue!==null && locationValue!==null && dateValue!==null)
            this.userService.addExperience(userExp).subscribe((r)=>{
            console.log('Experience successfully', r);
          },
            (error:HttpErrorResponse)=>{
              console.log("error adding experience", error);
              if(error.status === 403 ){
                this.router.navigate(['/auth/login']);
              }
            }
          );
       
        }
      });
      
    
    } else {
      Object.values(this.validateFormExp.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  
  

  removeExperience(i: { id: number; controlInstance: { input: string; location: string; date:string } }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControlExp.length > 0) {

      
    
      const index = this.listOfControlExp.indexOf(i);

      

      this.listOfControlExp.splice(index, 1);
      console.log('Experience Remove',this.listOfControlExp);
      // Remove form controls for both inputs
      this.validateFormExp.removeControl(i.controlInstance.input);
      this.validateFormExp.removeControl(i.controlInstance.location);
      this.validateFormExp.removeControl(i.controlInstance.date);



      if(i.controlInstance.input!==null){
        //calling the removeExperience API
        // accessing the corresponding hidden input
        const hiddenInputExp = this. hiddenInputsExperience[index];

        if(hiddenInputExp===null || hiddenInputExp===undefined){
          return;
        }

        const experienceIdToRemove = hiddenInputExp.value;

        console.log('Experience id to remove', experienceIdToRemove);
          
          // Call the deleteExperience API with the ExperienceIdToRemove
          this.userService.removeExperience(parseInt(experienceIdToRemove)).subscribe(
            (r) => {
              console.log('Experience removed successfully',r);
            },
            (error) => {
              console.error('Error removing experience:', error);
            }
          );  
      }
     
      

    }
  }


  /*
  submitFormExp(): void {
    if (this.validateFormExp.valid) {
      

      const formValue = this.validateFormExp.value;
      this.listOfControlExp.forEach(control => {
        const dateRange = formValue[control.controlInstance.date];
        if (Array.isArray(dateRange) && dateRange.length >= 2) {
          const startDate = dateRange[0];
          const endDate = dateRange[1];
          console.log(`${control.controlInstance.date} - Start Date:`, startDate);
          console.log(`${control.controlInstance.date} - Start Date modified:`, this.ParseDate(startDate));

          console.log(`${control.controlInstance.date} - End Date:`, endDate);
        }
      });
      console.log('submit experience', this.validateFormExp.value);
  

    } else {
      Object.values(this.validateFormExp.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  */


 
  
 
  
  onChangeDate(result: Date[]): void {
    console.log('onChange: ', result);
  }

  ParseDate(date: Date): string {
    if (date instanceof Date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  
  
 /* end experience */

 //cv

 updateUserCv(){
  localStorage.setItem("useeerId", this.user.id.toString());
  this.userService.updateCv(this.user.id).subscribe((res)=>{
    console.log('updated cv', res);
  });

 }



  @ViewChild('cv',{static:false })cv!:ElementRef;
  
  generatePdf=false;

  
  generatePDF(){

    this.generatePdf=true;

    setTimeout(()=>{
      const contentElement = this.cv.nativeElement;

      //create a copy of the element
      const pdfContentCopy = contentElement.cloneNode(true) as HTMLElement;

      //remove hidden elements
      const hiddenElements = pdfContentCopy.querySelectorAll('.hide-for-pdf');
      hiddenElements.forEach((element) => {
          element.remove();
      });

      //generate PDF with the copied content
      const pdf = new jsPDF('p', 'pt', 'a4');
      pdf.html(pdfContentCopy, {
          callback: (pdf) => {
              pdf.save('cv.pdf');
          }
      });

      //remove copy
      pdfContentCopy.remove();
      this.generatePdf = false;

    },100);
  }
 

  /*
  generatePDF() {
    this.generatePdf = true;
  
    setTimeout(() => {
      const contentElement = this.cv.nativeElement;
  
      // Wait for the images to load
      const images = contentElement.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
      const promises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          img.onload = () => resolve(undefined);
        });
      });
  
      Promise.all(promises).then(() => {
        // Create a copy of the element
        const pdfContentCopy = contentElement.cloneNode(true) as HTMLElement;
  
        // Remove hidden elements
        const hiddenElements = pdfContentCopy.querySelectorAll('.hide-for-pdf');
        hiddenElements.forEach((element) => {
          element.remove();
        });
  
        // Generate PDF with the copied content
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.html(pdfContentCopy, {
          callback: (pdf) => {
            pdf.save('cv.pdf');
          }
        });
  
        // Remove copy
        pdfContentCopy.remove();
        this.generatePdf = false;
      });
    }, 1000);
  }
  */


  /*search*/
  appliedJobs:Job[]=[];
  getAppliedJobs(){
    
    this.jobService.getUserAppliedJos().subscribe((response)=>{
      console.log('user applied jobs', response);
      this.appliedJobs=response as Job[];
      this.searchJobs=this.appliedJobs;
      this.totalItemsSearch=this.appliedJobs.length;
    });
  }
  searchJobs:Job[]=[];
  search:string='';
  searchJob(){ 

    if(this.appliedJobs.length===0 || this.search===''){
      this.searchJobs=this.appliedJobs;
      console.log('searchJobs', this.searchJobs);
      console.log('company JObs', this.appliedJobs);
    }else{
      
      console.log('search starts');
      console.log('COMPANY JOBS', this.appliedJobs);
      console.log('search:',this.search);
      const searchText=this.search.toLocaleLowerCase();

      this.searchJobs = this.appliedJobs.filter((job) => {
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
  //end pagination search
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

  /*end search*/

  /*job alert*/
  jobType=Object.values(JobType);

  jobAlerts:JobAlert[]=[];
  getJobsAlerts(){
    
    this.jobService.getUserJobAlerts().subscribe((response)=>{
      console.log('user job alerts', response);
      this.jobAlerts=response as JobAlert[];
      this.jobAlertSearch=this.jobAlerts;
      this.totalItemsSearchAlert=this.jobAlerts.length;
    });
  }

  searchAlert!:string;
  jobAlertSearch:JobAlert[]=[];
  searchAlertJob(){

    if(this.jobAlerts.length===0 || this.searchAlert===''){
      this.jobAlertSearch=this.jobAlerts;
      console.log('search Jobs Alert', this.jobAlertSearch);
      console.log('Job alerts', this.jobAlerts);
    }else{
      
      console.log('search starts job alert');
      console.log('JOB ALERTS', this.jobAlerts);
      console.log('search:',this.searchAlert);
      const searchText=this.searchAlert.toLocaleLowerCase();

      this.jobAlertSearch = this.jobAlerts.filter((job) => {
        const skillsMatch = job.skills.some((skill) => skill.skill.toLowerCase().includes(searchText));
        const locationMatch = job.location.toLowerCase().includes(searchText);
        const jobTypeMatch = job.jobType.toLowerCase().includes(searchText);
        const created_atMatch=this.formatDate(job.created_at).includes(searchText);
    
        // return true if any of the properties match the search text
        return  locationMatch  || jobTypeMatch || created_atMatch || skillsMatch;
      });

      this.totalItemsSearch=this.jobAlertSearch.length;

      console.log('search jobs filter', this.jobAlertSearch);
    }

  }

  //pagination search 
  currentPageSearchAlert = 1; // initializing to the first page
  itemsPerPageSearchAlert = 6; // nb of items to display per page
  totalItemsSearchAlert!:number; // total nb of items (adjust as needed)

  changePageSearchAlert(page: number) {
    this.currentPageSearchAlert = page;
  }

  get startIndexSearchAlert() {
    return (this.currentPageSearchAlert - 1) * this.itemsPerPageSearch;
  }

  get endIndexSearchAlert() {
    return this.currentPageSearchAlert * this.itemsPerPageSearch;
  }
  //end pagination search

  /*add job alert modal */
  jobModal = false;

  addJobAlertModal(){
    this.jobModal=true;
  }

  handleOkJobModal(): void {
    this.jobModal = false;
  }

  handleCancelJobModal(): void {
    this.jobModal = false;
  }
  /*end job alert modal*/


  /*add job alert*/
  selectedSkills: any[] = [];

  isSelected(skill: Skill): boolean {
    return this.selectedSkills.some((selectedSkill) => selectedSkill.id === skill.id);
  }
  
  toggleSkillSelection(skill: Skill): void {
    const index = this.selectedSkills.findIndex((selectedSkill) => selectedSkill.id === skill.id);
  
    if (index !== -1) {
      // skill is already selected = remove it
      this.selectedSkills.splice(index, 1);
      console.log("selected skills",this.selectedSkills);

    } else {
      // skill is not selected = add it
      this.selectedSkills.push(skill);
      console.log("selected skills",this.selectedSkills);
    }
  }
  
  addJobAlertSuccess!:string;
  addSuccess:string="";
  addJobAlert(){
    if(this.formJobAlert.valid){
      console.log('statring add job alert');
      const jobAlert:JobAlert=new JobAlert();
      jobAlert.experience=this.formJobAlert.value['experience'];
      jobAlert.location=this.formJobAlert.value['location'];
      jobAlert.jobType=this.formJobAlert.value['jobType'];

      const jobSkills:Skill[]=[];
      this.selectedSkills.forEach(selectedSkill => {
        const skill:Skill=new Skill();
        skill.skill=selectedSkill.skill;
        jobSkills.push(skill);
      });
      console.log('job skills', jobSkills);

      jobAlert.skills=jobSkills;

      this.jobService.addJobAlert(jobAlert).subscribe((response)=>{
        console.log('job Alert added succesfully', response);
        this.handleCancelJobModal();
        this.addSuccess="Job Alert created successfully";
        this.ngOnInit();
      });
    }else{
      Object.values(this.formJobAlert.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  afterCloseJobAlert(){
    this.addSuccess="";
  }


  /*update Job Alert*/

  /*modal*/
  jobModalUpdate = false;

  jobAlert:JobAlert=new JobAlert();
  updateJobAlertModal(id:number){
    this.jobModalUpdate=true;
   
    this.jobService.getJobAlertById(id).subscribe((response) => {
      this.jobAlert = response as JobAlert;
  
      this.formJobAlert.patchValue({
        experience: this.jobAlert.experience,
        location: this.jobAlert.location,
        jobType: this.jobAlert.jobType,
        skills: this.jobAlert.skills
      });
    });
      
  }

  handleOkJobUpdateModal(): void {
    this.jobModalUpdate = false;
  }

  handleCancelJobUpdateModal(): void {
    this.jobModalUpdate = false;
  }
  /*modal*/


  isSelectedUpdate(skill: Skill): boolean {
    //return this.jobAlert.skills.some((selectedSkill) => selectedSkill.id === skill.id);
  

    if (!this.jobAlert || !this.jobAlert.skills) {
      return false; // job alert data or skills not yet loaded
    }
    return this.jobAlert.skills.some((selectedSkill) => selectedSkill.id === skill.id);
  }

  updateJobAlert(){
    if(this.formJobAlert.valid){
      console.log('statring updating job alert');
      const jobAlert:JobAlert=new JobAlert();
      jobAlert.id=this.jobAlert.id;
      jobAlert.experience=this.formJobAlert.value['experience'];
      jobAlert.location=this.formJobAlert.value['location'];
      jobAlert.jobType=this.formJobAlert.value['jobType'];

      /* to do 
      const jobSkills:Skill[]=[];
      this.selectedSkills.forEach(selectedSkill => {
        const skill:Skill=new Skill();
        skill.skill=selectedSkill.skill;
        jobSkills.push(skill);
      });
      console.log('job skills', jobSkills);

      jobAlert.skills=jobSkills;

      */
     
      this.jobService.updateJobAlert(jobAlert).subscribe((response)=>{
        console.log('job Alert added succesfully', response);
        this.handleCancelJobUpdateModal();
        
        //this.ngOnInit();
      });
    }else{
      Object.values(this.formJobAlert.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  deleteJobAlert(id:number){
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
        this.jobService.deleteJobAlert(id).subscribe((response)=>{
          console.log('delete successflly job alert', response);
          Swal.fire(
            'Deleted!',
            'This job Alert has been deleted.',
            'success'
          );
          this.ngOnInit();

        })
       
      }
    })
  }

  /*end job alert*/

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

  afterClosePassword(){
    this.invalidOldPassError="";
  }

  afterCloseSuccessUpdatePassword(){
    this.successUpdatePass="";
  }
  /*end password*/






}
