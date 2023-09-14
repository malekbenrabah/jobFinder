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

}
