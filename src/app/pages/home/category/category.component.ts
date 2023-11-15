import { Component, OnInit, ViewChild } from '@angular/core';
import { Job, Sector } from 'src/app/services/user/model/Job';
import { faLaptopCode, faMoneyBillTrendUp, faLandmark, faUsers, faFlask, faPlane, faHouseMedical,faScaleBalanced, faBullhorn 
  , faPlus ,faScrewdriverWrench, faPhotoFilm, faHeadset, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { faHospital } from '@fortawesome/free-regular-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  rightIcon=faChevronRight;
  leftIcon=faChevronLeft;
  constructor(private jobService:JobService, private sharedService:SharedService, private router:Router) { }

 

  categories = Object.values(Sector);


  categoriesWithIcons = this.categories.map((type, index) => {
   
    let icon ;
    let title='';
    switch(type) {
      case Sector.computer_science:
        icon = faLaptopCode;
        title = Sector.computer_science
        break;
      case Sector.finance:
        icon = faMoneyBillTrendUp;
        title=Sector.finance
        break;
      case Sector.accounting:
        icon = faLandmark;
        title=Sector.accounting
        break;
      case Sector.consulting:
       
        icon =faUsers ;
        title=Sector.consulting;
        break;
      case Sector.biology:
        icon = faFlask;
        title=Sector.biology;
        break;
      case Sector.tourism:
        icon = faPlane;
        title=Sector.tourism;
        break;
      case Sector.paramedical:
        icon = faHouseMedical;
        title=Sector.paramedical;
        break;
      case Sector.health_care:
        icon = faHospital;
        title=Sector.health_care;
        break;
      case Sector.law:
        icon = faScaleBalanced;
        title=Sector.law;
        break;
      case Sector.media:
        icon = faPhotoFilm;
        title=Sector.media;
        break;
      
      case Sector.architecture:
        icon = faScrewdriverWrench;
        title=Sector.media;
        break;
      case Sector.marketing:
        icon = faBullhorn;
        title=Sector.media;
        break;
      case Sector.rh:
        icon = faPhotoFilm;
        title=Sector.media;
        break;
      case Sector.others:
        icon = faPlus;
        title=Sector.others;
        break;
    }
    return { id: index + 1, type: type, icon: icon, title:title };
  });

  numSlides=Math.ceil(this.categoriesWithIcons.length/6);
  categorieSlides:any[]=[];



 
  searchResult:Job[]=[];
  ngOnInit(): void {

    for (let i = 0; i < this.numSlides; i++) {
      const start = i * 6;
      const end = (i + 1) * 6;
      this.categorieSlides.push(this.categoriesWithIcons.slice(start, end));
    }

   

  }

  search(sector:string){
    this.jobService.searchJobs(undefined,undefined,undefined,undefined,undefined,sector,undefined,undefined)
    .pipe(
      tap((response) => {
        console.log('search response', response);
        // Emit the results into the shared service
        this.sharedService.setSearchResults(response);
        // setting the search results in the search component as well
        this.searchResult = response;
      })
    )
    .subscribe((response)=>{
      console.log("search response", response);
      //this.router.navigateByUrl('/job-list');
      this.router.navigate(['/job-list'], { queryParams: { fromHome: 'true' } });

    });
  }

  //carousel 
  @ViewChild('carousel') carousel: any;

  
  handlePrev(){
    this.carousel.pre();
  }

  handleNext(){
    this.carousel.next();
  }

}
