import { Component } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

/**
 * Generated class for the ProfileModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-modal',
  templateUrl: 'profile-modal.html',
})
export class ProfileModalPage {

  numbers: Array<number> = [];
  type: any;
  pickedNumber: any = 0;

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.numbers = this.params.get('numbers');
    this.type = this.params.get('type');
    this.pickedNumber = this.params.get('currentVal');
  }

  dismiss(selected: any) {
    let data = {selectedVal: selected, type: this.type};
    this.viewCtrl.dismiss(data);
  }

}
