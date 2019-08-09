import { Component } from '@angular/core';
import {App, ModalController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service/auth-service";
import {LoginPage} from "../login/login";
import {User} from "../../models/user";
import {Http} from "@angular/http";
import * as moment from "moment";
import {ProfileModalPage} from "../profile-modal/profile-modal";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  holder: string = 'profile page';
  profile: any;

  currentUser: User;

  currentUserFt: number;
  currentUserIn: number;

  currentUserSt: number;
  currentUserLbs: number;

  cmArray: Array<number> = [];
  ftArray: Array<number> = [];
  inArray: Array<number> = [];
  kgArray: Array<number> = [];
  stArray: Array<number> = [];
  lbsArray: Array<number> = [];

  saveComplete: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
              public appCtrl: App, public http: Http, private modalCtrl: ModalController) {

    this.currentUser = auth.getUserInfo();

    this.convertCmToFt(this.currentUser.height);
    this.convertKgToStone(this.currentUser.weight);

    this.inArray = Array.from(Array(12).keys());
    this.lbsArray = Array.from(Array(14).keys());

    for(let i = 0; i < 299; i++) {
      this.kgArray.push(i);
    }

    for(let i = 0; i < 47; i++) {
      this.stArray.push(i)
    }

    for(let i = 91; i < 242; i++) {
      this.cmArray.push(i)
    }

    for(let i = 3; i < 8; i++) {
      this.ftArray.push(i)
    }
  }

  convertCmToFt(cm) {
    let inches = +((cm*0.39370).toFixed(0));
    let feet = Math.floor(inches / 12);
    inches %= 12;
    this.currentUserFt = feet;
    this.currentUserIn = inches;
  }

  convertFtToCm(ft, inch) {
    let inches = +(ft) * 12;
    let totalInches = inches + +(inch);
    this.currentUser.height = Math.floor(totalInches/0.39370);
  }

  convertKgToStone(kg) {
    let lbs = +((kg*2.20462).toFixed(0));
    let stone = Math.floor(lbs / 14);
    lbs %= 14;
    this.currentUserSt = stone;
    this.currentUserLbs = lbs;
  }

  convertStoneToKg(st, lbs) {
    let lb = +(st) * 14;
    let totalLbs = lb + +(lbs);
    this.currentUser.weight = Math.floor(totalLbs/2.20462);
  }

  saveChangedValue(dataToSet: any, fieldToUpdate: any) {
    this.saveComplete = false;

    if(fieldToUpdate === 'dob') {
      dataToSet = moment.utc(dataToSet).format("YYYY-MM-DD");
    }

    this.http.post('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/update-profile',
      {updated_data: dataToSet, field_to_update: fieldToUpdate, email: this.currentUser.email}).map(res => res.json()).subscribe(data => {
      if (data.code === 200) {
        this.saveComplete = true;
      }
    });
  }

  showInputModal(data: any, type: any, currentVal: any) {
    let inputModal = this.modalCtrl.create(ProfileModalPage,
      {numbers: data, type: type, currentVal: currentVal});

    inputModal.onDidDismiss((data) => {
      let selectedVal = data.selectedVal;
      let type = data.type;
      if(type === 'Kgs') {
        this.handleKgInput(selectedVal);
      } else if (type === 'Stone') {
        this.handleStInput(selectedVal);
      } else if (type === 'Lbs') {
        this.handleLbsInput(selectedVal);
      } else if (type === 'Cm') {
        this.handleCmInput(selectedVal);
      } else if (type === 'Ft') {
        this.handleFtInput(selectedVal);
      } else if (type === 'Inches') {
        this.handleInInput(selectedVal);
      }
    });
    inputModal.present();
  }

  handleKgInput(value: number) {
    this.currentUser.weight = value;
    this.convertKgToStone(this.currentUser.weight);
    this.saveChangedValue(this.currentUser.weight, 'weight');
  }

  handleStInput(value: number) {
    this.currentUserSt = value;
    this.convertStoneToKg(this.currentUserSt, this.currentUserLbs);
    this.saveChangedValue(this.currentUser.weight, 'weight');
  }

  handleLbsInput(value: number) {
    this.currentUserLbs = value;
    this.convertStoneToKg(this.currentUserSt, this.currentUserLbs);
    this.saveChangedValue(this.currentUser.weight, 'weight');
  }

  handleCmInput(value: number) {
    this.currentUser.height = value;
    this.convertCmToFt(this.currentUser.height);
    this.saveChangedValue(this.currentUser.height, 'height');
  }

  handleFtInput(value: number) {
    this.currentUserFt = value;
    this.convertFtToCm(this.currentUserFt, this.currentUserIn);
    this.saveChangedValue(this.currentUser.height, 'height');
  }

  handleInInput(value: number) {
    this.currentUserIn = value;
    this.convertFtToCm(this.currentUserFt, this.currentUserIn);
    this.saveChangedValue(this.currentUser.height, 'height');
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.appCtrl.getRootNav().setRoot(LoginPage);
    });
  }

}
