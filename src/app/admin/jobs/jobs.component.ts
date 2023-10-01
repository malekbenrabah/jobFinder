import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  deleteIcon=faTrash;
  jobForm: FormGroup;

  constructor(private jobService:JobService,private fb: FormBuilder, private userService:UserServiceService, private router:Router) { 
    this.jobForm=this.fb.group({
      deadLine:[],
      created_at:[]
    });

  }

  jobs:Job[]=[];
  ngOnInit(): void {
    this.jobService.getJobs().subscribe((response)=>{
      console.log('jobs', response);
      this.jobs=response as Job[]
      this.searchJobs=this.jobs;
    },
    (error:HttpErrorResponse) => {
      console.error('Error fetching users', error);
      if(error.status === 403 ){
        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });      
      }
    });
  }

    /*search users*/
    searchJobs:Job[]=[];
    search:string='';
    searchUser(){
      if(this.jobs.length===0 || this.search===''){
        this.searchJobs=this.jobs;
        console.log('search Jobs', this.searchJobs);
        console.log('Jobs', this.jobs);
      }else{
        
       console.log('search starts');
       console.log('Jobs', this.jobs);
       console.log('search:',this.search);
       const searchText=this.search.toLocaleLowerCase();
  
       this.searchJobs = this.jobs.filter((job) => {
          const titleMatch = job.title.toLowerCase().includes(searchText);
          const sectorMatch = job.sector.toLowerCase().includes(searchText);
          const idMatch=job.id.toString().includes(searchText);
          const experienceMatch=job.experience?.toString().includes(searchText);
          const locationMatch = job.location.toLowerCase().includes(searchText);
          const jobTypeMatch = job.jobType.toLowerCase().includes(searchText);
          const created_atMatch=job.created_at.includes(searchText);
 
          // return true if any of the properties match the search text
          return titleMatch  || sectorMatch || idMatch ||experienceMatch ||locationMatch|| jobTypeMatch || created_atMatch;
        });
  
        this.totaljobs=this.searchJobs.length;
  
        console.log('search jobs filter', this.searchJobs);
      }
      
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

    formatDeadline(dateArray: any[]){
      if (dateArray.length >= 3) {
        const year = dateArray[0];
        const month = dateArray[1]; // Months in JavaScript are 0-based
        const day = dateArray[2];
        const hours = dateArray[3]-1;
        const minutes = dateArray[4];
        const seconds = dateArray[5];
        if(minutes===0){
          return `${day}-${month}-${year} at ${hours}h${minutes}0`;

        }
        return `${day}-${month}-${year} at ${hours}h${minutes}`;
      }
      return 'Invalid Date';
    }
  
    //pagination 
    currentPagejob = 1; // Initialize to the first page
    itemsPerPagejob = 6; // Number of items to display per page
    totaljobs!:number; // Total number of items (adjust as needed)
  
    /*view more modal*/
    viewModal = false;
  
    job:Job=new Job();
    viewMoreModal(id:number){
      this.viewModal=true;
      this.jobService.getJobById(id).subscribe((response)=>{
        this.job=response as Job;

        this.jobForm.patchValue({
          deadLine:this.formatingDate(this.job.deadline),
          created_at:this.formatingDate(this.job.created_at)
        });

      },
      (error:HttpErrorResponse) => {
        console.error('Error fetching users', error);
        if(error.status === 403 ){
          this.userService.logout().subscribe(()=>{
            console.log('logout api works!');
            localStorage.clear();
            this.router.navigate(['/admin/admin-auth/login']);
      
          });      
        }
      });
    } 

    formatingDate(created_at: any[]) {

      const year = created_at[0];
      const month = created_at[1] - 1; // months in js are 0-based
      const day = created_at[2];
      const hours = created_at[3]-1;
      const minutes = created_at[4];
      const seconds = created_at[5];
  
      return new Date(year, month, day, hours, minutes, seconds);
     
    }

    handleOkViewModal(): void {
      this.viewModal = false;
    }
  
    handleCanceViewlModal(): void {
      this.viewModal = false;
    }
  
    /*delete Job */
    deleteJob(id:number){
      console.log('id',id);
      Swal.fire({
        title: 'Proceed deleting this job ?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.jobService.deletJobByAdmin(id).subscribe((response)=>{
            console.log('delete successflly', response);
            Swal.fire(
              'Deleted!',
              'Job has been deleted.',
              'success'
            );
            this.ngOnInit();
  
          });
         
        }
      })
    }
 

}
