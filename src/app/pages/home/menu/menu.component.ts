import { Component, HostListener, OnInit } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import{faSuitcase} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  myLocationIcon=faLocationDot;
  myJob=faSuitcase;

  constructor() { }

  ngOnInit(): void {
  }

  
  jobTypeSearch(value: string[]): void {
    console.log('checked values',value);
  }

  experienceSearch(value: string[]){
    console.log('checked values experience',value);

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
