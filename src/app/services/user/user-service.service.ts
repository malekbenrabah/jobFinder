import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/user';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http:HttpClient) { }

  login(userCred:User){
    return this.http.post("http://localhost:8086/app/auth/authenticate",userCred);
  }

  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
  }

  logout(){
    const header=this.getHeaders();
    return this.http.post("http://localhost:8086/app/auth/logout",null);
  }

  isLoggedIn(){
    //if there's a token it will return true, else it will return false
   return localStorage.getItem('token')!=null;

   /*
   const token=localStorage.getItem('token')
    if (!token) {
      // no token available, consider user not logged in
      return of(false);
    }

   //checke if the token is expired or not 
    return this.http.get("http://localhost:8086/app/auth/expiredJWT");
    */
  }

  getToken(){
    //if it's null return empty value ''
    return localStorage.getItem('token')||'';
  }

  //registration 
  register(userInfo:any){
    return this.http.post('http://localhost:8086/app/auth/register',userInfo);
  }


  //get user credentials
  getUserInfo(){
    return this.http.get("http://localhost:8086/app/user/userInfo");
  }

  checkCompanyName(companyName:string){
    return this.http.get<boolean>('http://localhost:8086/app/user/checkCompanyName?companyName='+companyName);
  }

  checkUserEmail(userEmail:string){
    
    return this.http.get<boolean>('http://localhost:8086/app/user/checkUserEmail?userEmail='+userEmail);
  }

  forgotPassword(email:string){
    const formData=new FormData();
    formData.append('email',email);
    return this.http.post("http://localhost:8086/app/user/forgot-password",formData);
  }

  resetPassword(email:string, newPass:string){
    const formData=new FormData();
    formData.append('email',email);
    const headers = new HttpHeaders().set('newPassword', newPass);
    return this.http.put("http://localhost:8086/app/user/set-password",formData,{headers:headers});
  }


}
