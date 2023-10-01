import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  deleteIcon=faTrash;
  constructor(private userService:UserServiceService, private router:Router) { }

  companies :User[]=[];
  
  ngOnInit(): void {
    this.userService.getCompanies().subscribe((response)=>{
      console.log('companies', response);
      this.companies= response as User[];
      this.searchCompanies=this.companies;
    },
    (error:HttpErrorResponse) => {
      if(error.status === 403 ){
        console.error('Error fetching comapnies', error);
        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });      
      }
    });
  }

  /*search users*/
   searchCompanies:User[]=[];
   search:string='';
   searchUser(){
     if(this.companies.length===0 || this.search===''){
       this.searchCompanies=this.companies;
       console.log('search Users', this.searchCompanies);
       console.log('Users', this.companies);
     }else{
       
      console.log('search starts');
      console.log('Users', this.companies);
      console.log('search:',this.search);
      const searchText=this.search.toLocaleLowerCase();
 
      this.searchCompanies = this.companies.filter((company) => {
         const companynameMatch = company.companyName.toLowerCase().includes(searchText);
         const emailMatch = company.email.toLowerCase().includes(searchText);
         const idMatch=company.id.toString().includes(searchText);
         const phoneMatch=company.phone?.toString().includes(searchText);

         // return true if any of the properties match the search text
         return companynameMatch  || emailMatch || idMatch ||phoneMatch ;
       });
 
       this.totalcompanies=this.searchCompanies.length;
 
       console.log('search companies filter', this.searchCompanies);
     }
     
    }
 
   //pagination 
   currentPagecompany = 1; // Initialize to the first page
   itemsPerPagecompany = 6; // Number of items to display per page
   totalcompanies!:number; // Total number of items (adjust as needed)
 
   /*view more modal*/
   viewModal = false;
 
   company:User=new User();
   viewMoreModal(id:number){
     this.viewModal=true;
     this.userService.getUserbyId(id).subscribe((response)=>{
       this.company=response as User;
     },
     (error:HttpErrorResponse) => {
      if(error.status === 403 ){
        console.error('Error fetching company', error);

        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });
      }
    });
   } 
   handleOkViewModal(): void {
     this.viewModal = false;
   }
 
   handleCanceViewlModal(): void {
     this.viewModal = false;
   }
 
   /*delete User */
   deleteUser(id:number){
     console.log('id',id);
     Swal.fire({
       title: 'Proceed deleting company ?',
       text: "You won't be able to revert this!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then((result) => {
       if (result.isConfirmed) {
         this.userService.deleteUser(id).subscribe((response)=>{
            console.log('delete successflly', response);
            Swal.fire(
              'Deleted!',
              'Company has been deleted.',
              'success'
            );
            this.ngOnInit();
 
          },
          (error:HttpErrorResponse) => {
            if(error.status === 403 ){
              console.error('Error deleting company', error);
              this.userService.logout().subscribe(()=>{
                console.log('logout api works!');
                localStorage.clear();
                this.router.navigate(['/admin/admin-auth/login']);
          
              });      
            }
          })
        
        }
     })
   }

}
