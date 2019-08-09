import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {User} from "../../models/user";


@Injectable()
export class AuthService {
  currentUser: User;
  message: string;


  constructor(public http: Http) {
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/login',

          {email: credentials.email, password: credentials.password}).map(res => res.json()).subscribe(data => {
            if(data.code === 200){
              this.currentUser = data.message;
              localStorage.setItem("token", data.token);
              localStorage.setItem("email", this.currentUser.email);

              observer.next(true);
              observer.complete();
            } else {
              this.message = data.message;
              observer.next(false);
              observer.complete();
            }
        },err => console.log(err));
      });
    }
  }

  public checkLoggedIn(credentials) {
    if (credentials.email === null || credentials.token === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/get-details',
          {email: credentials.email, token: credentials.token}).map(res => res.json()).subscribe(data => {
          if(data.code === 200){
            this.currentUser = data.message;
            observer.next(true);
            observer.complete();
          } else {
            this.message = data.message;
            observer.next(false);
            observer.complete();
          }
        },err => console.log(err));
      });
    }
  }

  public register(credentials) {
    if (credentials.forename === null || credentials.surname === null || credentials.dob === null
      || credentials.email === null || credentials.password === null) {
      return Observable.throw("Please fill in all fields.");
    } else {
      return Observable.create(observer => {
        this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/register',
          {forename: credentials.forename,
            surname: credentials.surname,
            dob: credentials.dob,
            email: credentials.email,
            password: credentials.password}).map(res => res.json()).subscribe(data => {
              if(data.code === 200){
                this.message = data.message;
                observer.next(true);
                observer.complete();
              } else {
                this.message = data.message;
                observer.next(false);
                observer.complete();
              }
        },err => console.log(err));
      });
    }
  }

  public resetPassword(credentials) {

    if(credentials.email === null || credentials.password === null || credentials.confirmPassword === null) {
      return Observable.throw("Please fill in all fields.");
    } else {
      return Observable.create(observer => {
        this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/reset-password',
          {email: credentials.email, password: credentials.password, confirmPassword: credentials.confirmPassword})
          .map(res => res.json()).subscribe(data => {
          if(data.code === 200){
            this.message = data.message;
            observer.next(true);
            observer.complete();
          } else {
            this.message = data.message;
            observer.next(false);
            observer.complete();
          }
        },err => console.log(err));
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public getMessage() : string {
    return this.message;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      localStorage.clear();
      observer.next(true);
      observer.complete();
    });
  }
}
