import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { AuthService } from './auth.service';
import { AuthResponse } from './authResponse.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {

  // @ViewChild('authForm', { static: true }) authFrom: NgForm;


  isLoginMode:boolean = true;
  isLoading:boolean = false;
  error: string = "";
  subscription: Subscription;

  constructor(private authService:AuthService,private router:Router,private alertService:AlertService) { }

  ngOnInit(): void {
    this.subscription=this.alertService.message.subscribe(message => {
      if (!!message) {
        this.error = message;
      } else {
        this.error = "";
      }
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;

  }

  onSubmit(form:NgForm) {
    // console.log(this.authFrom.value);
    this.isLoading = true;

    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponse>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);

    } else {
      authObs=this.authService.signup(email, password);
    }

    authObs?.subscribe(responseData => {
      this.isLoading = false;
      // console.log(responseData)
      this.router.navigate(["/recipes"])
      },
        errorMessage => {
          // console.log(errorMessage);
          this.alertService.setMessage(errorMessage);
          this.isLoading = false;
          this.error = errorMessage;
        }
      )


    form.reset();
  }

  onCloseAlert() {
    this.error = "";
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
