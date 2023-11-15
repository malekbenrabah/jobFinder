import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faBriefcase, faLocation, faLocationDot, faPhone, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  mailIcon=faEnvelope;
  locationIcon=faLocationDot;
  phoneIcon=faPhone;
  jobIcon=faBriefcase;
  companyIcon=faUserTie;
  selectedProfileOption = 'aboutme';
  isbtnActive=true;
  constructor(private userService:UserServiceService, private jobService:JobService, private changeDetectorRef: ChangeDetectorRef) { }

  company:User=new User();
  companyJobs:Job[]=[];
  
  ngOnInit(): void {
    const id = localStorage.getItem('companyId');
    this.userService.getUserbyId(Number(id)).subscribe((response)=>{
      this.company= response as User;
      console.log('company info', this.company); 
      
      this.jobService.getCompanyJobs(this.company.email).subscribe((response)=>{
        console.log('company jobs', response);
        this.companyJobs=response as Job[];
        this.totalItems=this.companyJobs.length;
        this.calculateCountdownForJobs();
      });
    });

   
  }

  //pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalItems!:number; 

  changePage(page: number) {
    this.currentPage = page;
  }
 
  get startIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
 
  get endIndex() {
    return this.currentPage * this.itemsPerPage;
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

  //count down deadline 
  calculateCountdownForJobs() {
    // Iterate through this.companyJobs and calculate countdown for each job
    for (const job of this.companyJobs) {
      job.countdown = this.calculateDountDown(job.deadline);
    }
  }
  deadlineOver=false;
  deadLine!:Date; 
  deadLineTime: { days: number, hours: number, minutes: number } = { days: 0, hours: 0, minutes: 0 };
  calculateDountDown(deadline:any){
    console.log('deadline', deadline);
    const [year, month, day, hour, minute] = deadline;
  
    
    const deadlineDate = new Date(year, month - 1, day, hour, minute);
    console.log('deadline date', deadlineDate);
    this.deadLine=deadlineDate;

    //countDown
    const currentTime = new Date().getTime();
    const timeDifference = this.deadLine.getTime() - currentTime;

    console.log('time difference', timeDifference);
    
    if (timeDifference > 0) {
      const totalMinutes = Math.floor(timeDifference / 60000); // 1 minute = 60000 milliseconds
      const days = Math.floor(totalMinutes / 1440); // 1 day = 1440 minutes
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
  
      this.deadLineTime = { days, hours, minutes };
      this.deadlineOver=false;
      this.changeDetectorRef.detectChanges();
      return `${days}d ${hours}h ${minutes}m`;
    }else{
      this.deadlineOver=true;
      this.changeDetectorRef.detectChanges();
      return this.formatDeadline(deadline);
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

}
