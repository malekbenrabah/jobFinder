import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

}
