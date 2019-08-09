import { Component } from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service/auth-service";
import * as moment from "moment";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private mylog(s){
      console.log("   >>>>>  RegisterPage: "+s+"  <<<<<   ");//comment out to turn off debug logging
  }


  createSuccess:boolean = false;
  registerCredentials = { forename: '', surname: '', dob: '', email: '', password: '' };
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
              private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.mylog("Constructor");
  }

  ionViewDidLoad() {
      this.mylog("ionViewDidLoad");
      console.log('ionViewDidLoad RegisterPage');
  }

  public register() {
      this.mylog("register");
      this.showLoading();
      this.registerCredentials.dob = moment.utc(this.registerCredentials.dob).format("YYYY-MM-DD");
      this.auth.register(this.registerCredentials).subscribe(success => {
          if (success) {
            this.createSuccess = true;
            this.showPopup("Account created", this.auth.getMessage());
          } else {
            this.showPopup("Error creating account", this.auth.getMessage());
          }
        },
        () => {
          this.showPopup("Error creating account", "Please try again.");
        });
  }

  showLoading() {
      this.mylog("showLoading");
      this.loading = this.loadingCtrl.create({
          content: 'Registering your account...',
          dismissOnPageChange: true
      });
      this.loading.present();
  }

  showPopup(title, text) {
      this.mylog("showPopup");
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: text,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              if (this.createSuccess) {
                this.navCtrl.popToRoot();
              }
            }
          }
        ]
      });
      alert.present();
  }

}
