import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import{faSuitcase} from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user/user-service.service';

@Component({
  selector: 'app-day-jobs',
  templateUrl: './day-jobs.component.html',
  styleUrls: ['./day-jobs.component.css']
})
export class DayJobsComponent implements OnInit {

  locationIcon=faLocationDot;
  myJob=faSuitcase;
  constructor(private jobService:JobService, private router:Router, private userService:UserServiceService) { }

  jobs:Job[]=[];
  ngOnInit(): void {
    this.jobService.getJobs().subscribe((response)=>{
      console.log("jobs listings", response);
      this.jobs=response as Job[];
    });
  }

  //formatting the date
  formatDate(created_at: any[]): string {

    const year = created_at[0];
    const month = created_at[1] - 1; // Months in JavaScript are 0-based
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

  applyJob(id:number){
    if(this.userService.isLoggedIn()){

      this.jobService.applyJob(id).subscribe((response)=>{
        console.log('applied successfully',response);
        
        Swal.fire({
          icon:"success",
          title:"Good Job",
          text:"You have applied succesfully",
          confirmButtonColor:"#05264E"
        })
        this.ngOnInit();
      },
      (error:HttpErrorResponse)=>{
        if(error.status===403 ){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have already applied to this job',
            confirmButtonColor:"#05264E"
          })
        }

      });

    }else{
       this.router.navigate(['/auth/login']);
    }
    
  }
  

}
