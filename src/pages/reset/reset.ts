import { Component } from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service/auth-service";
import {LoginPage} from "../login/login";
import {isDefined} from "ionic-angular/util/util";

/**
 * Generated class for the ResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {

  loading: Loading;
  resetCredentials = { email: '', password: '', confirmPassword: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
              private auth: AuthService, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  reset() {
    if(this.resetCredentials.password !== this.resetCredentials.confirmPassword) {
      this.showError("Please ensure both passwords match.")
    } else {
      this.showLoading();
      this.auth.resetPassword(this.resetCredentials).subscribe(allowed => {
          if (allowed) {
            this.showError(this.auth.getMessage());
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.showError(this.auth.getMessage());
            this.resetCredentials.email = '';
            this.resetCredentials.password = '';
            this.resetCredentials.confirmPassword = '';
          }
        },
        () => {
          this.showError("We had a problem trying to reset your password.\nPlease try again");
        });
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Resetting password...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    if(isDefined(this.loading)){
      this.loading.dismiss();
    }
    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
