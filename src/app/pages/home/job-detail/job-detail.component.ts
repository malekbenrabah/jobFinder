import { Component, OnInit } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {

  myLocationIcon=faLocationDot;

  selected: string = 'jobDesc';
  constructor() { }

  ngOnInit(): void {
  }

}
