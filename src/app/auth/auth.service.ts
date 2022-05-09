import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError,BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthResponse } from './authResponse.interface';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signupURL:string=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`

  private loginURL:string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`

  public user = new BehaviorSubject<User>(null);

  public token:string;

  public tokenExpirationTimer: any;

  constructor(private http: HttpClient) { }


  signup(email: string, password: string) {
    return this.http.post <AuthResponse>(this.signupURL, {
      email: email,
      password: password,
      returnSecureToken:true
    }).pipe(
      catchError(this.handleError),
       tap(res => {
        this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        this.setToken(res.idToken);
      })
    )
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(this.loginURL, {
      email: email,
      password: password,
      returnSecureToken:true
    }).pipe(
      catchError(this.handleError),
      tap(res => {
        this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        this.setToken(res.idToken);
      })

    )
  }


  setToken(token: string) {
    localStorage.setItem('token', token);
    // console.log(token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate:Date
    }  = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser._token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.user.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }


  autoLogout(expirationDate:number) {
    setTimeout(() => {
      this.logout();
    },expirationDate)
  }


  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes.error;
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already"
        break;

      case "INVALID_PASSWORD":
        errorMessage = "Wrong Password. Please Try again."
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exists. Please Sign up."
        break;

    }
      return throwError(errorMessage);
  }
}
