import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Education } from 'src/app/services/user/model/Education';
import { Experience } from 'src/app/services/user/model/Experience';
import { Skill } from 'src/app/services/user/model/Skill';
import { User } from 'src/app/services/user/model/user';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import jsPDF from 'jspdf';
import { callback } from 'chart.js/dist/helpers/helpers.core';
import { forkJoin } from 'rxjs';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {

  mailIcon=faEnvelope;
  locationIcon=faLocationDot;
  phoneIcon=faPhone;
  constructor(private userService:UserServiceService, private router:Router) { }

  user:User=new User();
  skills:Skill[]=[];
  educations:Education[]=[];
  experiences:Experience[]=[];
  ngOnInit(): void {
    /*
    this.userService.getUserInfo().subscribe((response)=>{
      this.user=response as User;
      console.log('user', this.user);
    },
    (error:HttpErrorResponse)=>{
      if(error.status===403){
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);

      }
    });

    this.userService.getUserSkills().subscribe((response)=>{
      this.skills=response as Skill[];
      console.log('user skills', this.skills);
    })

    this.userService.getUserEducations().subscribe((response)=>{
      this.educations=response as Education[];
      console.log('user education', this.educations);
    });
    this.userService.getUserExperiences().subscribe((response)=>{
      this.experiences=response as Experience[];
      console.log('user experiences', this.experiences);

    });
    */

    const userInfo$ = this.userService.getUserInfo();
    const skills$ = this.userService.getUserSkills();
    const educations$ = this.userService.getUserEducations();
    const experiences$ = this.userService.getUserExperiences();
  
    forkJoin([userInfo$, skills$, educations$, experiences$]).subscribe(
      ([userInfo, skills, educations, experiences]) => {
        this.user = userInfo as User;
        this.skills = skills as Skill[];
        this.educations = educations as Education[];
        this.experiences = experiences as Experience[];
        console.log('Data loaded successfully');
  
        
      },
      (error: HttpErrorResponse) => {
        if (error.status === 403) {
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }

  getFirstLetter(name:string){
    if(name && name.length>0){
      return name.charAt(0).toLocaleUpperCase();
    }
    return'';
  }

  formatEducationDate(date:any){
    if (date.length >= 3) {
      const year = date[0];
      return `${year}`;
    }
    return 'Invalid Date';
  }
  formatDate(dateArray: any){
    if (dateArray.length >= 3) {
      const year = dateArray[0];
      const month = dateArray[1]; // months in js are 0-based
      const day = dateArray[2];
      return `${day}-${month}-${year}`;
    }
    return 'Invalid Date';
  }

  toNumber(level:string){
    return Number(level)
  }
  

  @ViewChild('cv',{static:false })cv!:ElementRef;

  generatePDF(){
    console.log('begin downloading cv');
    
    if (this.user && this.skills.length > 0 && this.educations.length > 0 && this.experiences.length > 0) {
      const elementToCapture = this.cv.nativeElement;

      /*
      const pdf = new jsPDF('p', 'pt', 'a4');
      pdf.html(this.cv.nativeElement, {
        callback: (pdf) => {
          pdf.save('cv.pdf');
        }
      });
      */
      // html2canvas to capture a screenshot
      html2canvas(elementToCapture).then((canvas) => {
        const screenshot = canvas.toDataURL('image/png');

        // Create a new jsPDF document
        const pdf = new jsPDF({
          orientation: 'landscape', // Set to 'portrait' for portrait orientation
          unit: 'mm',
          format: 'a3' // Use 'a4' or adjust as needed
        });

        // Define the dimensions for the image placement
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        const aspectRatio = originalWidth / originalHeight;
        let imgWidth = 210; // PDF page width
        let imgHeight = 297;

        

        // Insert the screenshot as an image in the PDF
        imgWidth = imgHeight * aspectRatio;

        pdf.addImage(screenshot, 'PNG', 0, 0, imgWidth, imgHeight);

        // Save or display the PDF
        pdf.save('cv.pdf');
      });

    }else{
      console.log('Data is not yet loaded. Cannot generate PDF.');

    }
  
    
  }

  generatePDFuser(){

  }
 


}
