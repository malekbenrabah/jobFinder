import { Component, OnInit } from '@angular/core';
import { faLocationDot, faLocationPinLock } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  locationIcon=faLocationDot;
  noLocationIcon=faLocationPinLock;
  constructor(private userService:UserServiceService ) { }
  
  
  companies:User[]=[];
  ngOnInit(): void {
    this.userService.getCompanies().subscribe((resposne)=>{
      console.log('companies inti', resposne);
      this.companies=resposne as User[];
      this.totalItemsSearch=this.companies.length;
      this.serachCompanies=this.companies;

      
    });
  }

  /*search companies*/
  search:string='';
  serachCompanies:User[]=[];
  searchCompany(){
    if(this.companies.length===0 || this.search===''){
      this.serachCompanies=this.companies;
      console.log('serachCompanies', this.serachCompanies);
      console.log('companies', this.companies);
    }else{
      
     console.log('search starts');
     console.log('COMPANIES', this.companies);
     console.log('search:',this.search);
     const searchText=this.search.toLocaleLowerCase();

      this.serachCompanies = this.companies.filter((company) => {
        const companynameMatch = company.companyName.toLowerCase().includes(searchText);
        const emailMatch = company.email.toLowerCase().includes(searchText);
        const locationMatch = company.adresse?.toLowerCase().includes(searchText);

        return companynameMatch  || emailMatch || locationMatch ;
      });

      this.totalItemsSearch=this.serachCompanies.length;

      console.log('search companies filter', this.serachCompanies);
    }
    
  }

  //pagination search 
  currentPageSearch = 1; 
  itemsPerPageSearch = 12;
  totalItemsSearch!:number; 
 
  changePageSearch(page: number) {
    this.currentPageSearch = page;
  }
 
  get startIndexSearch() {
    return (this.currentPageSearch - 1) * this.itemsPerPageSearch;
  }
 
  get endIndexSearch() {
    return this.currentPageSearch * this.itemsPerPageSearch;
  }

  /*store id*/
  storeCompanyId(id:number){
    localStorage.setItem('companyId',id.toString());
  }

}
