import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import{faChevronRight, faChevronLeft,faLocationDot} from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';

@Component({
  selector: 'app-top-recruiters',
  templateUrl: './top-recruiters.component.html',
  styleUrls: ['./top-recruiters.component.css']
})
export class TopRecruitersComponent implements OnInit {

  rightIcon=faChevronRight;
  leftIcon=faChevronLeft;
  locationIcon=faLocationDot;
  constructor(private userService:UserServiceService, private jobService:JobService) { }

  companies:User[]=[];

  numSlides!:number;
  companieSlides:any[]=[];

  ngOnInit(): void {
    this.userService.getCompanies().subscribe((response)=>{
      console.log('companies',response);
      this.companies=response as User[];

      /*carousel */
      const companiesArray=response as User[];
      const length= companiesArray.length;
      this.numSlides=Math.ceil(length/6);
      for (let i = 0; i < this.numSlides; i++) {
        const start = i * 6;
        const end = (i + 1) * 6;
        this.companieSlides.push(this.companies.slice(start, end));
      }
      console.log('companies slide', this.companieSlides);
      /*carousel */
    });

    

  }

  @ViewChild('carousel') carousel: any;

  
  handlePrev(){
    this.carousel.pre();
  }

  handleNext(){
    this.carousel.next();
  }

  

  

 
}
