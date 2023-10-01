import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from '../../user/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private userService:UserServiceService, private router:Router){}
  canActivate(){
    if(this.userService.isLoggedIn()){
      //user logged in => redirect to home page
      this.router.navigate(['/']);
      return false; //prevent access to auth/
    }
    return true; // allow access to /auth for non loggedIn users
  }
  
}
