import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/user';
import { Observable, of } from 'rxjs';
import { Skill } from './model/Skill';
import { Experience } from './model/Experience';
import { Education } from './model/Education';
import jwt_decode from 'jwt-decode';

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

  /*
  haveAccess(){
    var logginToken = localStorage.getItem('token') || '';
    var decodedToken = jwt_decode(logginToken);
    console.log('Decoded Token:', decodedToken);
  }
  */

  

  //registration 
  register(userInfo:any){
    return this.http.post('http://localhost:8086/app/auth/register',userInfo);
  }


  checkCompanyName(companyName:string){
    return this.http.get<boolean>('http://localhost:8086/app/user/checkCompanyName?companyName='+companyName);
  }

  checkUserEmail(userEmail:string){
    
    return this.http.get<boolean>('http://localhost:8086/app/user/checkUserEmail?userEmail='+userEmail);
  }

  userRole(){
    return this.http.get("http://localhost:8086/app/user/userRole");
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

  /*user info */
  //get user credentials
  getUserInfo(){
    return this.http.get("http://localhost:8086/app/user/userInfo");
  }

  getUserbyId(id:number){
    return this.http.get("http://localhost:8086/app/user/userInfoById?id="+id);
  }

  updateUser(user:User, photo:File){
    //create formdata object
    const formData = new FormData();

    // adding json data for user fields
    formData.append('user', JSON.stringify(user));

    // Add the profile picture file
    
    if (photo) {
      formData.append('photo', photo);
    }

    return this.http.put("http://localhost:8086/app/user/updateUser",formData);

  }

  updateUserInfo(user:User){
    const formData = new FormData();

    // adding json data for user fields
    formData.append('user', JSON.stringify(user));
    return this.http.put("http://localhost:8086/app/user/updateUserInfo",formData);

  }


  updateProfileImg(photo:any){
    const formData=new FormData();
    formData.append('photo',photo);

    return this.http.put("http://localhost:8086/app/user/updatePhoto",formData);
  }

  updatePassword(oldPass:string, newPass:string){
    const formData=new FormData();
    formData.append('oldPass',oldPass);
    formData.append('newPass',newPass);

    return this.http.put("http://localhost:8086/app/user/updatePass",formData);
  }

  deleteUser(id:number){
    return this.http.delete("http://localhost:8086/app/user/deleteUser?id="+id);
  }

  /*cv */

  /*Skills */
  addSkills(skill:Skill){
    return this.http.post("http://localhost:8086/app/skills/addSkill",skill);
  }

  getUserSkills(){
    return this.http.get("http://localhost:8086/app/skills/getSkills");
  }

  getCandidateSkills(id:number){
    return this.http.get("http://localhost:8086/app/skills/getUserSkills?id="+id)
  }

  deleteSkill(id:any){
   
    return this.http.delete("http://localhost:8086/app/skills/deleteSkill?id="+id);
  }

  updateSkill(skill:Skill){
    return this.http.put("http://localhost:8086/app/skills/updateSkill",skill)
  }
  /*Skills */


  /*Experience*/
  
    addExperience(experience:Experience){
      return this.http.post("http://localhost:8086/app/experience/addExp", experience);
    }

    getUserExperiences(){
      return this.http.get("http://localhost:8086/app/experience/getExperiences")
    }


    updateExperience(experience:Experience){
      return this.http.put("http://localhost:8086/app/experience/updateExperience",experience);
    }

    removeExperience(id:number){
      return this.http.delete("http://localhost:8086/app/experience/removeExperience?id="+id);
    }

    getExperienceByUserId(id:number){
      return this.http.get("http://localhost:8086/app/experience/getExperienceById?id="+id);
    }

  /*Experience */

  /*Education */

    addEducation(education:Education){
      return this.http.post("http://localhost:8086/app/education/addEducation", education);
    }

    getUserEducations(){
      return this.http.get("http://localhost:8086/app/education/getEducations");
    }


    updateEducation(education:Education){
      return this.http.put("http://localhost:8086/app/education/updateEducation",education);
    }

    removeEducation(id:number){
      return this.http.delete("http://localhost:8086/app/education/deleteEducation?id="+id);
    }

    getEducationByUserId(id:number){
      return this.http.get("http://localhost:8086/app/education/educationsByUserId?id="+id);
    }
  /*Education */

  getCompanies(){
    return this.http.get("http://localhost:8086/app/user/getCompanies");
  }

  getUsers(){
    return this.http.get("http://localhost:8086/app/user/getUsers");
  }

  getNbUser(){
    return this.http.get("http://localhost:8086/app/user/nbUsers");
  }

  /*top recruiters*/
  getTopRecuiters(){
    return this.http.get("http://localhost:8086/app/job/getTopCompanies");
  }



}
