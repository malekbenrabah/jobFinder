import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from '../user/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService:UserServiceService, private router:Router){}

  
  canActivate(){
  
    if(this.userService.isLoggedIn()){
      return true;

    }else{
      this.router.navigate(['/auth/login'])
      return false;
    }
  }

  
  
}
