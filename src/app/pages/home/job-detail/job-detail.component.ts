import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {

  myLocationIcon=faLocationDot;

  selected: string = 'jobDesc';
  constructor(private route: ActivatedRoute, private jobService:JobService) { }

  job:Job=new Job();
  remainingTime: { days: number, hours: number, minutes: number } = { days: 0, hours: 0, minutes: 0 };
  countDownTime: string = ''; 
  ngOnInit(): void {
    const id=Number(this.route.snapshot.params['id']);

    this.jobService.getJobById(id).subscribe((response)=>{
      console.log("job details", response);
      this.job=response as Job;
      
      //countDown
      const [year, month, day, hour, minute] = this.job.deadline;
      const deadlineDate = new Date(year, month - 1, day, hour, minute);
      const currentTime = new Date().getTime();
      const timeDifference = deadlineDate.getTime() - currentTime;

      console.log('time differenc', timeDifference);
      if (timeDifference > 0) {
        this.remainingTime.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        this.remainingTime.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.remainingTime.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        
      }
      console.log('remaining Time', this.remainingTime);
      //countdown

      //countdown2
      // Calculate remaining time
      this.calculateRemainingTime();
      
      // Update remaining time every second
      setInterval(() => {
        this.calculateRemainingTime();
      }, 1000);
      
    });
  }

  //buttons 
  isbtnActive=true;

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

  //deadline
  calculateRemainingTime() {
    const [year, month, day, hour, minute] = this.job.deadline;
    const deadlineDate = new Date(year, month - 1, day, hour, minute);
    const currentTime = new Date().getTime();
    const remainingTimeInMillis = deadlineDate.getTime() - currentTime;

    // Calculate remaining days, hours, and minutes
    const days = Math.floor(remainingTimeInMillis / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTimeInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTimeInMillis % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Format remaining time as DD-HH-mm
    this.countDownTime = `${days}-${hours}-${minutes}`;

    console.log('remaining countdown time', this.countDownTime);
  }


}
