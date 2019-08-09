import { Component } from '@angular/core';
import {NavController, NavParams, MenuController, Loading, AlertController, LoadingController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service/auth-service';
import {RegisterPage} from "../register/register";
import {Http} from "@angular/http";
import {ResetPage} from "../reset/reset";
import {TabsPage} from "../tabs/tabs";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  message: any;
  loginCredentials = { email: '', password: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
              public menu: MenuController, private auth: AuthService, private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
    this.menu.enable(false, 'sideMenu');
  }

  ionViewDidLoad() {
    if(localStorage.getItem("token")) {
      this.showLoading();
      this.auth.checkLoggedIn({email: localStorage.getItem("email"), token: localStorage.getItem("token")}).subscribe(allowed => {
          if (allowed) {
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.showError("Login expired. Please login again.");
            this.navCtrl.setRoot(LoginPage);
          }
        },
        () => {
          this.showError("We had a problem logging you in.\nPlease try again.");
        });
    }
  }

  login() {
    this.showLoading();
    this.auth.login(this.loginCredentials).subscribe(allowed => {
        if (allowed) {
          this.navCtrl.setRoot(TabsPage);
          this.menu.enable(true,'sideMenu');
        } else {
          this.showError(this.auth.getMessage());
          this.loginCredentials.email = '';
          this.loginCredentials.password = '';
        }
      },
      error => {
        this.showError(error);
      });
  }

  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }


  public resetPassword() {
    this.navCtrl.push(ResetPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Logging you in...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
