import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { User } from 'src/app/services/user/model/user';
import { NgIf } from '@angular/common';
import { JobService } from 'src/app/services/jobs/job.service';

@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.css'],
})
export class SiteInfoComponent implements OnInit {


  constructor(private userService:UserServiceService, private jobService:JobService) { }


  companies:User[]=[];
  nbMaxCompanies!:number;
  nbCompanies:number=0;

  nbMaxUsers!:number;
  nbUsers:number=0;

  nbMaxJobs!:number;
  nbJobs:number=0;
  ngOnInit(): void {
    this.userService.getCompanies().subscribe((response)=>{
      console.log('companies',response);
      this.companies=response as User[];
      this.nbMaxCompanies=this.companies.length;
    });

    this.userService.getNbUser().subscribe((response)=>{
      this.nbMaxUsers=response as number;
    });

    this.jobService.nbJobs().subscribe((response)=>{
      this.nbMaxJobs=response as number;
    });
  }


  nbCompaniesStop:any=setInterval(()=>{
   
    //stop
    if(this.nbCompanies==this.nbMaxCompanies){
      clearInterval(this.nbCompaniesStop)
    }else{
      this.nbCompanies++;
    }
  },100);

  nbUsersStop:any=setInterval(()=>{
    if(this.nbUsers==this.nbMaxUsers){
      clearInterval(this.nbUsersStop)
    }else{
      this.nbUsers++;
    }
     
  },100); //100ms


  nbJobsStop:any=setInterval(()=>{
    if(this.nbJobs==this.nbMaxJobs){
      clearInterval(this.nbJobsStop)
    }else{
      this.nbJobs++;
    }
     
  },20); //100ms


}
