import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from '../../user/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService:UserServiceService, private router:Router){}
  
  
  isAdmin!:string;
  userRole(){
    this.userService.userRole().subscribe((response=>{
      this.isAdmin= response as string;

    }))
  }
  
  canActivate(){
    if(this.userService.isLoggedIn()){
      return this.userService.userRole().toPromise()
      .then((role) => {
        if (role === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      })
      .catch(() => {


      
  
        // handling any errors that may occur when fetching the user's role

        this.userService.logout().subscribe(()=>{
          console.log('logout api works!');
          localStorage.clear();
          this.router.navigate(['/admin/admin-auth/login']);
    
        });      
  
        //this.router.navigate(['']);
        return false;
      });
      
    }else{
      this.router.navigate(['/admin/admin-auth/login'])
      return false; 
    }
  }
  
}
