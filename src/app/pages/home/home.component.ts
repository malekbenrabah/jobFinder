import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isCollapsed=true;

  constructor(private jobService:JobService) { }

  
  ngOnInit(): void {
   
  }

}
