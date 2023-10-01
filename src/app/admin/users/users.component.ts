import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  deleteIcon=faTrash;
  constructor(private userService:UserServiceService, private router:Router) { }

  users :User[]=[];
  ngOnInit(): void {
    this.userService.getUsers().subscribe((response)=>{
      console.log('users', response);
      this.users= response as User[];
      this.searchUsers=this.users;
    },
    (error:HttpErrorResponse) => {
      console.error('Error fetching users', error);
      if(error.status === 403 ){
        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });      
      }
    });
  }

  /*search users*/
  searchUsers:User[]=[];
  search:string='';
  searchUser(){
    if(this.users.length===0 || this.search===''){
      this.searchUsers=this.users;
      console.log('search Users', this.searchUsers);
      console.log('Users', this.users);
    }else{
      
     console.log('search starts');
     console.log('Users', this.users);
     console.log('search:',this.search);
     const searchText=this.search.toLocaleLowerCase();

     this.searchUsers = this.users.filter((user) => {
        const firstnameMatch = user.firstname.toLowerCase().includes(searchText);
        const lastnameMatch = user.lastname.toLowerCase().includes(searchText);
        const emailMatch = user.email.toLowerCase().includes(searchText);
        const idMatch=user.id.toString().includes(searchText);
        const phoneMatch=user.phone?.toString().includes(searchText);
    
        // return true if any of the properties match the search text
        return firstnameMatch || lastnameMatch || emailMatch || idMatch ||phoneMatch ;
      });

      this.totalUsers=this.searchUsers.length;

      console.log('search users filter', this.searchUsers);
    }
    
    
  }

  //pagination 
  currentPageUser = 1; // Initialize to the first page
  itemsPerPageUser = 6; // Number of items to display per page
  totalUsers!:number; // Total number of items (adjust as needed)

  /*view more modal*/
  viewModal = false;

  user:User=new User();
  viewMoreModal(id:number){
    this.viewModal=true;
    this.userService.getUserbyId(id).subscribe((response)=>{
      this.user=response as User;
    },
    (error:HttpErrorResponse) => {
      if(error.status === 403 ){
        console.error('Error fetching user', error);
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
      title: 'Proceed deleting user ?',
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
            'User has been deleted.',
            'success'
          );
          this.ngOnInit();

        },
          (error:HttpErrorResponse) => {
            if(error.status === 403 ){
              console.error('Error deleting user', error);
              this.userService.logout().subscribe(()=>{
                console.log('logout api works!');
                localStorage.clear();
                this.router.navigate(['/admin/admin-auth/login']);
          
              });      
            }
          }
        );
       
      }
    })
  }
}
