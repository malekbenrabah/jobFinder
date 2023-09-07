import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faBookmark} from '@fortawesome/free-regular-svg-icons';
import{ faIdBadge}from"@fortawesome/free-solid-svg-icons"
import{faSuitcase, faGraduationCap} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { User } from 'src/app/services/user/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Skill } from 'src/app/services/user/model/Skill';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  saveIcone=faBookmark;
  profileIcon=faIdBadge;
  jobIcon=faSuitcase;

  educationIcon=faGraduationCap;


  validateForm!: FormGroup;

  /*stapper Forms*/
  validateFormEd!: FormGroup;

  validateFormExp!: FormGroup;

  validateFormSkills!:FormGroup;
  constructor(private fb: FormBuilder, private userService:UserServiceService, private router:Router) {

    this.validateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern('[0-9]*')]],
      aboutMe:[''],
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
    this.addField();

    //experience form 
    this.validateFormExp= this.fb.group({
      
    });
    this.addFieldExp();

    //skills
    this.validateFormSkills=this.fb.group({
    })
    this.fetchUserSkills();
    
    

    

    


    
  }

  //profile update 

  getFirstLetter(name:string){
    if(name && name.length>0){
      return name.charAt(0).toLocaleUpperCase();
    }
    return'';
  }

  //updateimg
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
      };
      reader.readAsDataURL(this.file);
    }
  }
  
  
  //do both file.click and call the updateImg API:
  
  updateImg(){
    console.log('file.click()');

    const fileInput = this.fileInput.nativeElement as HTMLInputElement;
    fileInput.click();
    console.log('update img start');
    console.log('the file is', this.file);
    if (this.uploadedPhoto) { // ensure that a file is selected
      this.userService.updateProfileImg(this.file)
        .subscribe(
          (response) => {
            
            console.log('Image updated successfully:', response);
            
          },
          (error) => {
            console.error('Error updating image:', error);
          }
        );
    } else {
      console.warn('No file selected for update.');
    }
  }

  profileUpdatedSucc:string="";
  submitForm(): void {
    console.log('update start');    
    if (this.validateForm.valid) {
      console.log('submit update', this.validateForm.value);
      
      
      this.userService.updateUser(this.validateForm.value,this.file).subscribe(r=>{
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

  @ViewChild('skillInput', { static: false }) skillInput?: ElementRef;


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

  

  removeSkills(i: { id: number; controlInstance: { skill: string; level: string} }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControlSkills.length > 0) {
      const index = this.listOfControlSkills.indexOf(i);
      this.listOfControlSkills.splice(index, 1);
      console.log('Skills Remove',this.listOfControlSkills);
      // Remove form controls for both inputs
      this.validateFormSkills.removeControl(i.controlInstance.skill);
      this.validateFormSkills.removeControl(i.controlInstance.level);
    }
  }

  submitFormSkill(): void {

    if (this.validateFormSkills.valid) {
      console.log('submit Skills ', this.validateFormSkills.value);

      //adding a new control
      
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

  fetchUserSkills() {
    this.userService.getUserSkills().subscribe(
      (response) => {
        console.log('user skills', response);
        // skills is an array of Skill objects
        const skills: Skill[] = response as Skill[]; // Explicitly cast to Skill[]


        this.originalSkillsCount = skills.length;

  
        // clear the existing skills
        //this.listOfControlSkills = [];
  
        // Iterate over the retrieved skills and add them to the form
        skills.forEach((skill, index) => {
          const control = {
            id: index,
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

          this.router.navigateByUrl("/account/profile");
        });
      },
      (error) => {
        console.error('Error fetching user skills:', error);
      }
    );
  }
  
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
        this.index = 'Hobbies';
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
      year: string;
      institution:string;
    };
  }> = [];
  

  

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: {
        input:`degree${id}`,
        year:`year${id}`,
        institution:`institution${id}`
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
      control.controlInstance.year,
      new FormControl(null, Validators.required)
    );



  }

  removeField(i: { id: number; controlInstance: { input: string; year: string; institution:string } }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log('education',this.listOfControl);
    // Remove form controls for both input and select
    this.validateFormEd.removeControl(i.controlInstance.input);
    this.validateFormEd.removeControl(i.controlInstance.institution);
    this.validateFormEd.removeControl(i.controlInstance.year);    }
  }

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


  /*experience form */
  listOfControlExp: Array<{ 
    id: number; 
    controlInstance:{
      input: string;
      location:string;
      date: string;
      
    };
  }> = [];
  
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

  removeFieldExp(i: { id: number; controlInstance: { input: string; location: string; date:string } }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControlExp.length > 0) {
      const index = this.listOfControlExp.indexOf(i);
      this.listOfControlExp.splice(index, 1);
      console.log('experience',this.listOfControlExp);
    // Remove form controls for both input and select
    this.validateFormExp.removeControl(i.controlInstance.input);
    this.validateFormExp.removeControl(i.controlInstance.location);
    this.validateFormExp.removeControl(i.controlInstance.date);    }
  }

  submitFormExp(): void {
    if (this.validateFormExp.valid) {
      

      const formValue = this.validateFormExp.value;
      this.listOfControlExp.forEach(control => {
        const dateRange = formValue[control.controlInstance.date];
        if (Array.isArray(dateRange) && dateRange.length >= 2) {
          const startDate = dateRange[0];
          const endDate = dateRange[1];
          console.log(`${control.controlInstance.date} - Start Date:`, startDate);
          console.log(`${control.controlInstance.date} - Start Date modified:`, this.formatDate(startDate));

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
 

  onChangeDate(result: Date[]): void {
    console.log('onChange: ', result);
  }

  formatDate(date: Date): string {
    if (date instanceof Date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  }
  
  



}
