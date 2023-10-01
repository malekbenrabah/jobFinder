import { Component, OnInit } from '@angular/core';
import { faBuilding} from '@fortawesome/free-regular-svg-icons';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { JobService } from 'src/app/services/jobs/job.service';
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
  monthMapping = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
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
            label: 'jobs',
            data: jobData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
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
  

    });

    new Chart("jobsChart", {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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


  }

}
