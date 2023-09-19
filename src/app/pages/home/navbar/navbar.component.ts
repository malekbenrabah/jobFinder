import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { UserServiceService } from 'src/app/services/user/user-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed=false;
  constructor(private userService:UserServiceService, private router:Router) { }

  //drawer

  visible = false;
  placement: NzDrawerPlacement = 'left';
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  userLoggedIn:boolean=false;
  ngOnInit(): void {
    this.userLoggedIn=this.userService.isLoggedIn();

   

    //check screen size at initialization
    this.checkScreenSize();
  }

  logout(){
    console.log("logout works!");
    this.userService.logout().subscribe(()=>{
      console.log('logout api works!');
      localStorage.removeItem('token');
      this.userLoggedIn=false;
      this.router.navigate(['']);

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
