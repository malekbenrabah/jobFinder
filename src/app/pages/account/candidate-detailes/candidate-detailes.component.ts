import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faAward, faLocationDot, faPhone, faSchool, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { forEach } from 'lodash';
import { Education } from 'src/app/services/user/model/Education';
import { Experience } from 'src/app/services/user/model/Experience';
import { Skill } from 'src/app/services/user/model/Skill';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';

@Component({
  selector: 'app-candidate-detailes',
  templateUrl: './candidate-detailes.component.html',
  styleUrls: ['./candidate-detailes.component.css']
})
export class CandidateDetailesComponent implements OnInit {

  validateForm!: FormGroup;
  locationIcon=faLocationDot;
  mailIcon=faEnvelope;
  userTieIcon=faUserTie;
  educationIcon=faSchool;
  experienceIcon=faAward;
  phoneIcon=faPhone;
  

  selectedProfileOption = 'aboutme';
  isbtnActive=true;
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
  candidateSkills:Skill[]=[];
  candiateExperiences:Experience[]=[];
  candidateEducations:Education[]=[];
  
  ngOnInit(): void {
   
    const userId = localStorage.getItem('userId');
    this.userService.getUserbyId(Number(userId)).subscribe(r => {
      console.log('candidate info', r);
      this.user = r as User;

      // updating form controls with user data
      this.validateForm.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        phone: this.user.phone,
        aboutMe:this.user.aboutMe,
      });

      this.userService.getCandidateSkills(this.user.id).subscribe((response)=>{
        console.log('candidate skills', response);
        this.candidateSkills= response as Skill[];
       
      });

      this.userService.getExperienceByUserId(this.user.id).subscribe((response)=>{
        console.log('candidate experiences', response);
        this.candiateExperiences=response as Experience[];
      });

      this.userService.getEducationByUserId(this.user.id).subscribe((response)=>{
        console.log('candidate educations', response);
        this.candidateEducations=response as Education[];
        
        
      });


    },
      (error:HttpErrorResponse)=>{
        if(error.status===403){
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);

        }
    });

  }

  /*user skills */
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  
  candidateEducation():any{
    const nb=this.candidateEducations.length;
   
    if(nb!==0){
      return this.candidateEducations[nb-1].description;

    }else{
      return 'no education mentioned';
    }
      
  }

  candidateExpeirence(){
    const nb=this.candiateExperiences.length;
   
    if(nb!==0){
      return this.candiateExperiences[nb-1].description+"-"+this.candiateExperiences[nb-1].location;

    }else{
      return 'no education mentioned';
    }
  }

  replaceDate(input: string): string {
    return input.replace(/,/g, '-');
  }
  
  toNumber(level:string){
    return Number(level)
  }

}
