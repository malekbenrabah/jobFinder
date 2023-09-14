import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faLocationDot,faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import{faSuitcase} from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
@Component({
  selector: 'app-job-grid',
  templateUrl: './job-grid.component.html',
  styleUrls: ['./job-grid.component.css']
})
export class JobGridComponent implements OnInit {

  myLocationIcon=faLocationDot;
  myJob=faSuitcase;
  listIcon=faList;
  gridIcon=faTableCellsLarge;

  //active btn
  isGridActive:boolean=true;


  constructor(private jobService:JobService , private router:Router) { }

  jobs:Job[]=[];
  numJobs!:number;
  ngOnInit(): void {
    this.jobService.getJobs().subscribe((response)=>{
      console.log("jobs grid", response);
      this.jobs=response as Job[];
      this.numJobs=this.jobs.length;
    });
  }

   
  jobTypeSearch(value: string[]): void {
    console.log('checked values',value);
  }

  experienceSearch(value: string[]){
    console.log('checked values experience',value);

  }

  //screen size:
  isSmallScreen = false;
 
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  //check screen size
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }
}
