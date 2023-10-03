import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import{faChevronRight, faChevronLeft,faLocationDot} from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { CompanySlide } from 'src/app/services/user/model/CompanySlide';

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

  //companies:User[]=[];

  numSlides!:number;
  companieSlides:CompanySlide[][]=[];

  topRecruiters:any[]=[];
  ngOnInit(): void {
    this.userService.getTopRecuiters().subscribe((response)=>{
      console.log('top recuiters',response);
      this.topRecruiters=response as any[];


      for (let i = 0; i < this.topRecruiters.length; i += 6) {
        const slide = this.topRecruiters.slice(i, i + 6).map(companyData => {
          return {
            nbJob: companyData[0],
            company: companyData[1] as User,
          };
        });
        this.companieSlides.push(slide);
      }
      console.log('top recruiters carousel',this.companieSlides);

      /*carousel */
      /*
      const companiesArray= response as any[];
      console.log('companies array ', companiesArray);
      const length= companiesArray.length;
      this.numSlides=Math.ceil(length/6);
      console.log('num smildes', this.numSlides);
      for (let i = 0; i < this.numSlides; i++) {
        const start = i * 6;
        const end = (i + 1) * 6;
        this.companieSlides.push(this.topRecuiters.slice(start, end).map(data=>{
          return{
            nbJob:data[0],
            company:data[1]
          };
        }));

        const nbPostedJob = this.topRecuiters.map(item => item[0]);
        const company = this.topRecuiters.map(item => item[1]);

        console.log('posted jobs', nbPostedJob);
        console.log('company', company);
      }
      console.log('companies slide', this.companieSlides);
      
      */
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
