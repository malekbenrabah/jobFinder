import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user/user-service.service';
import { Router } from '@angular/router';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isCollapsed=false;

  constructor(private userService:UserServiceService, private router:Router) { }

  ngOnInit(): void {
  }
  logout(){
    console.log("logout works!");
    this.userService.logout().subscribe(()=>{
      console.log('logout api works!');
      localStorage.clear();
      this.router.navigate(['/admin/admin-auth/login']);

    });
  }

}
