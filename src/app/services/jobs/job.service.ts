import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Job, JobType, Sector } from '../user/model/Job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http:HttpClient) { }

  getJobs(){
    return this.http.get("http://localhost:8086/app/job/getJobs");
  }

  getJobById(id:any){
    return this.http.get("http://localhost:8086/app/job/findJobById?id="+id);
  }

  getSimilarJobs(id:any){
    return this.http.get("http://localhost:8086/app/job/getSimilarJobs?id="+id);
  }

  getCompanyJobs(id:any){
    return this.http.get("http://localhost:8086/app/job/companyJobs?email="+id);
  }
  
  getCompanyOpenJobs(id:any){
    return this.http.get("http://localhost:8086/app/job/companyOpenJobs?email="+id);

  }

  applyJob(id:any){
    const formData=new FormData();
    formData.append('id',id);
    return this.http.post("http://localhost:8086/app/job/applyJob",formData);
  }

  nbJobs(){
    return this.http.get("http://localhost:8086/app/job/nbJobs");
  }

  searchJobs(title?:string, description?:string, jobType?:string, experience?:number,
    location?:string , sector?:string, diploma?:string,skills?:string[]){
    
    let params = new HttpParams();

    if (title) {
    params = params.set('title', title);
    }
    if (description) {
    params = params.set('description', description);
    }
    if (jobType) {
    params = params.set('jobType', jobType);
    }
    if (experience) {
    params = params.set('experience', experience.toString());
    }
    if (location) {
    params = params.set('location', location);
    }
    if (sector) {
    params = params.set('sector', sector);
    }
    if (diploma) {
    params = params.set('diploma', diploma);
    }
    if (skills) {
      // convert the skills array to a comma-separated string
      const skillsString = skills.join(',');
      params = params.set('skills', skillsString);
    }
    
    return this.http.get<Job[]>("http://localhost:8086/app/job/serachJobs",{params});

  }

}
