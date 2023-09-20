import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faLocationDot,faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import{faSuitcase} from '@fortawesome/free-solid-svg-icons';
import { JobService } from 'src/app/services/jobs/job.service';
import { Job } from 'src/app/services/user/model/Job';
import { SharedService } from 'src/app/services/shared/shared.service';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  myLocationIcon=faLocationDot;
  myJob=faSuitcase;
  listIcon=faList;
  gridIcon=faTableCellsLarge;
  myBuildingIcon=faBuilding;

  //active btn
  isGridActive:boolean=true;

  constructor(private jobService:JobService , private sharedService:SharedService ,private route: ActivatedRoute) { }

  jobs:Job[]=[];
  numJobs!:number;

  searchResults:Job[]=[];
  hasSearchResults!:boolean;
  ngOnInit(): void {


    
    this.searchResults = this.sharedService.getSearchResults();
    console.log('search reasult intially', this.searchResults);

    this.hasSearchResults = this.sharedService.getHasSearchResults();
    console.log('has search result ', this.hasSearchResults);
    if (this.searchResults.length > 0) {
      console.log(this.searchResults, 'getting the result from the search: LIST');
      this.totalItemsSearch=this.searchResults.length;
    } else {
      this.jobService.getJobs().subscribe((response) => {
        console.log('jobs listings', response);
        this.jobs = response as Job[];
        this.numJobs = this.jobs.length;
        this.totalItems = this.jobs.length;
      });
    }

    

    /*
    this.route.queryParams.subscribe((queryParams) => {
      const hasSearchResults = queryParams['searchResults'];
      if (hasSearchResults) {
        this.sharedService.searchResults$.subscribe((results) => {
          this.searchResults = results;
          console.log(this.searchResults, 'getting the result from the search: LIST');
        });
      } else {
        this.jobService.getJobs().subscribe((response) => {
          console.log('jobs listings', response);
          this.jobs = response as Job[];
          this.numJobs = this.jobs.length;
          this.totalItems = this.jobs.length;
        });
      }
    });
    */

    /* old
    this.jobService.getJobs().subscribe((response)=>{
      console.log("jobs listings", response);
      this.jobs=response as Job[];
      this.numJobs=this.jobs.length;
      this.totalItems=this.jobs.length;
    });

    this.sharedService.searchResults$.subscribe(results => {
      this.searchResults = results;
      console.log(this.searchResults,' getting the result from the search : LIST');
    });
    */

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

  //pagination
  currentPage = 1; // Initialize to the first page
  itemsPerPage = 6; // Number of items to display per page
  totalItems!:number; // Total number of items (adjust as needed)

  changePage(page: number) {
    this.currentPage = page;
  }

  get startIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex() {
    return this.currentPage * this.itemsPerPage;
  }

  //pagination search 
  currentPageSearch = 1; // Initialize to the first page
  itemsPerPageSearch = 6; // Number of items to display per page
  totalItemsSearch!:number; // Total number of items (adjust as needed)

  changePageSearch(page: number) {
    this.currentPage = page;
  }

  get startIndexSearch() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndexSearch() {
    return this.currentPage * this.itemsPerPage;
  }












   

/*search*/

  selectedJobTypeValue = null;


  jobTypeSearch(value: string[]): void {
    console.log('checked values',value);
  }

  experienceSearch(value: string[]){
    console.log('checked values experience',value);

  }
/*search end*/






/*screen sizing */
  //screen size:
  isSmallScreen = false;
 
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  //check screen size
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }
/*screen sizing */


}
