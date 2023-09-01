import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faLocationDot, IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  myLocationIcon:IconDefinition=faLocationDot;

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [null],
      location: [null]  
    });
  }

  //screen size:
   isSmallScreen = false;
 
   @HostListener('window:resize', ['$event'])
   onResize(event: any): void {
     this.checkScreenSize();
   }
 
   //check screen size
   checkScreenSize(): void {
     this.isSmallScreen = window.innerWidth <= 768;
   }

}