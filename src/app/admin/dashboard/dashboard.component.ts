import { Component, OnInit } from '@angular/core';
import { faBuilding} from '@fortawesome/free-regular-svg-icons';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  jobsIcon=faBriefcase;
  userIcon=faUser;
  companyIcon=faBuilding;
  constructor(private userService:UserServiceService, private jobService:JobService) { }

  companies:User[]=[];
  nbCompanies!:number;
  nbUsers!:number;
  nbJobs!:number;
  jobsMonth:any[]=[];
  jobTypeJobs:any[]=[];
  monthMapping = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  jobs:Job[]=[];
  ngOnInit(): void {
    this.userService.getCompanies().subscribe((response)=>{
      console.log('companies',response);
      this.companies=response as User[];
      this.nbCompanies=this.companies.length;
    });

    this.userService.getNbUser().subscribe((response)=>{
      this.nbUsers=response as number;
    });

    this.jobService.nbJobs().subscribe((response)=>{
      this.nbJobs=response as number;
    });

    

    /*monthly jobs chart*/

    this.jobService.getJobsByMonth().subscribe((response)=>{
      console.log('jobs by month', response);
      this.jobsMonth=response as any[];
      const months = this.monthMapping;
      const jobData = Array(12).fill(0); 
      for (const item of this.jobsMonth) {
        const monthIndex = item[0] - 1;
        jobData[monthIndex] = item[1];
      }


      new Chart("jobsChart2", {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'nb.Jobs',
            data: jobData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              "rgba(40,199,111,.12)",
              '#1d4fd826',
              'rgb(199 40 187 / 12%)'

              
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              '#28c76f',
              '#355fd5',
              '#eb2f96'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
  

      new Chart("jobsChart", {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'nb.Jobs',
            data: jobData,
            fill: false,
            borderColor: '#1677cb',

          }]
        },
        options: {
          animations: {
            tension: {
              duration: 1000,
              easing: 'linear',
              from: 1,
              to: 0,
              loop: true
            }
          },
          scales: {
            y: { 
              min: 0,
              max: this.nbJobs
            }
          }
        }
      });

    });

    /*jobs by job type chart*/
    this.jobService.getJobsByJobtype().subscribe((response)=>{
      console.log('jobs by job type', response);
      this.jobTypeJobs=response as any[];
      const jobType = this.jobTypeJobs.map(item => item[0]);
      const jobTypeCount = this.jobTypeJobs.map(item => item[1]);

      console.log('job type', jobType);
      console.log('job type count', jobTypeCount);

      new Chart("jobTypeChart", {
        type: 'polarArea',
        data: {
          labels: jobType,
          datasets: [{
            label: 'nb.Jobs',
            data: jobTypeCount,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(75, 192, 192)',
              'rgb(255, 205, 86)'
            ]
          }]
        }
      });
  
    });

   /*recent jobs*/
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

}
