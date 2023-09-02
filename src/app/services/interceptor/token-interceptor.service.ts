import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs';
import { UserServiceService } from '../user/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private inject:Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let userSrervice=this.inject.get(UserServiceService);
    let jwtToken=req.clone({ 
      setHeaders:{
        Authorization: 'Bearer '+userSrervice.getToken()
      }
    });
    return next.handle(jwtToken);
  }
  
}
