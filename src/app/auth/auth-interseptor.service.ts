import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    // console.log(token)
    if ( !token) {
      return next.handle(req);
    }
    const newReq = req.clone({
      params: new HttpParams().set('auth', token)
    })

    console.log(newReq)
    return next.handle(newReq);
  }
}
