import { Component, OnInit } from '@angular/core';
import{ faIdBadge,faSuitcase, faLock, faCamera, faLocationDot, faTrash, faUsers}from"@fortawesome/free-solid-svg-icons"
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { User } from 'src/app/services/user/model/user';
import { JobService } from 'src/app/services/jobs/job.service';
import { Skill } from 'src/app/services/user/model/Skill';
import { Job } from 'src/app/services/user/model/Job';
import { UserServiceService } from 'src/app/services/user/user-service.service';
@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  profileIcon=faIdBadge;
  jobIcon=faSuitcase;
  securityIcon=faLock;
  updateImgIcon=faCamera;
  updateIcon=faPenToSquare;
  deleteIcon=faTrash;
  usersIcon=faUsers;

  constructor(private jobService:JobService, private userService:UserServiceService) { }


  selectedProfileOption='profile';
  candidates:User[]=[];
  jobCandidates:Job=new Job();
  //candiate skills
  candidateSkills:Skill[]=[];
 
  ngOnInit(): void {
    const id=localStorage.getItem('jobIdForcandidates');
    this.selectedProfileOption = 'candidates';
    this.jobService.getJobById(id).subscribe((response)=>{
      console.log("response", response);
      this.jobCandidates=response as Job;
      this.candidates=this.jobCandidates.users;
      console.log('candidates', this.candidates);
      this.searchResult=this.candidates;
      this.totalCandidates=this.candidates.length;
      this.candidates.forEach(candidate => {
        this.userService.getCandidateSkills(candidate.id).subscribe((response)=>{
          console.log('user skills', response);
          this.candidateSkills= response as Skill[];
          candidate.candidateSkills=this.candidateSkills;

        });
      });
     
    });
  }

  
  
  
  displayCandidates(id:number){

    localStorage.setItem('jobIdForcandidates',id.toString());

    /*
    this.selectedProfileOption = 'candidates';
    localStorage.setItem("jobId",id.toString());
    this.jobService.getJobById(id).subscribe((response)=>{
      this.jobCandidates=response as Job;
      this.candidates=this.jobCandidates.users;
      console.log('candidates', this.candidates);
      this.searchResult=this.candidates;
      this.totalCandidates=this.candidates.length;
      this.candidates.forEach(candidate => {
        this.userService.getCandidateSkills(candidate.id).subscribe((response)=>{
          console.log('user skills', response);
          this.candidateSkills= response as Skill[];
          candidate.candidateSkills=this.candidateSkills;

        });
      });
     
    });
    */

   
    

  }

 
 //search candidate

  searchResult:User[]=[];
  searchUser:string='';
  searchUsers(){ 

    if(this.candidates.length===0 || this.searchUser===''){
      this.searchResult=this.candidates;
      console.log('searchUsers', this.searchResult);
      console.log('candidates', this.candidates);
    }else{
      
     console.log('search User start');
     console.log('CANDIDATES', this.candidates);
     console.log('search:',this.searchUser);
     const searchText=this.searchUser.toLocaleLowerCase();

      this.searchResult = this.candidates.filter((user) => {
        const firstnameMatch = user.firstname.toLowerCase().includes(searchText);
        const lastnameMatch = user.lastname.toLowerCase().includes(searchText);
        const emailMatch = user.email.toLowerCase().includes(searchText);
        // return true if any of the properties match the search text
        return firstnameMatch || lastnameMatch || emailMatch;
      });

      this.totalCandidates=this.searchResult.length;
      //this.totalItemsSearch=this.searchJobs.length;

      console.log('search user filter result', this.searchResult);
    }
    

  }

  //pagination candidates 
  //pagination
  currentPageCandidate = 1; // Initialize to the first page
  itemsPerPageCandidate = 6; // Number of items to display per page
  totalCandidates!:number; // Total number of items (adjust as needed)

  changePageCandidate(page: number) {
    this.currentPageCandidate = page;
  }

  get startIndexCandidate() {
    return (this.currentPageCandidate - 1) * this.itemsPerPageCandidate;
  }

  get endIndexCandidate() {
    return this.currentPageCandidate * this.itemsPerPageCandidate;
  }

  goToCandidate(id:number){
    localStorage.setItem("userId",id.toString());

  }


}
