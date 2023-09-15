import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faLocationDot, faAward, faUserTie, faHourglassEnd, faSuitcase , faAt , faPhone, faUsers} from '@fortawesome/free-solid-svg-icons';
import { faBuilding, faClock} from '@fortawesome/free-regular-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-job-detail2',
  templateUrl: './job-detail2.component.html',
  styleUrls: ['./job-detail2.component.css']
})
export class JobDetail2Component implements OnInit {

  myLocationIcon=faLocationDot;
  myBuildingIcon=faBuilding;
  experienceIcon=faAward;
  jobLevelIcon=faUserTie;
  deadlineIcon=faHourglassEnd;
  myJob=faSuitcase;
  cretedatIcon=faClock;
  companyEmailIcon=faAt;
  companyPhoneIcon=faPhone;
  usersIcon=faUsers;

  selected: string = 'jobDesc';
  constructor(private route: ActivatedRoute, private jobService:JobService, private userService:UserServiceService, private router:Router) { }

  job:Job=new Job();
 
  deadLine!:Date; 
  deadLineTime: { days: number, hours: number, minutes: number } = { days: 0, hours: 0, minutes: 0 };

  nbApplicants!:number;

  similarJobs:Job[]=[];
  openJobs:Job[]=[];
  companyOpenJobs!:number;
  ngOnInit(): void {
    const id=Number(this.route.snapshot.params['id']);

    //job detail
    this.jobService.getJobById(id).subscribe((response)=>{
      console.log("job details", response);
      this.job=response as Job;
      
      //countDown
      const [year, month, day, hour, minute] = this.job.deadline;
     
      const deadlineDate = new Date(year, month - 1, day, hour, minute);

      this.deadLine=deadlineDate;

    
      this.calculateDountDown();
      setInterval(() => {
        this.calculateDountDown();
      }, 1000);
      
      // end countdown

      //nb of applicants 
      this.nbApplicants=this.job.users.length;

      //open jobs
      console.log('company email', this.job.companyEmail);
      this.jobService.getCompanyOpenJobs(this.job.companyEmail).subscribe((response)=>{
        this.openJobs=response as Job[];
        this.companyOpenJobs=this.openJobs.length;
      });
      
    });


    //similar Jobs
    this.jobService.getSimilarJobs(id).subscribe((response)=>{
      console.log('similar jobs', response );
      this.similarJobs=response as Job[];
    });

    


  }

  //buttons 
  isbtnActive=true;


  //count down deadline 
  deadlineOver=false;
  calculateDountDown(){
    //countDown
    const currentTime = new Date().getTime();
    const timeDifference = this.deadLine.getTime() - currentTime;

    if (timeDifference > 0) {
      this.deadLineTime.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.deadLineTime.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.deadLineTime.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      
    }else{
        this.deadlineOver=true;
    }
  }


  //format Date 
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

  formatDeadline(dateArray: any[]){
    if (dateArray.length >= 3) {
      const year = dateArray[0];
      const month = dateArray[1]; // Months in JavaScript are 0-based
      const day = dateArray[2];
      return `${day}-${month}-${year}`;
    }
    return 'Invalid Date';
  }

  //apply job
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
