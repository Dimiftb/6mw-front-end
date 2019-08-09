import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';

/**
 * Generated class for the SafetyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-safety',
  templateUrl: 'safety.html',
})
export class SafetyPage {

  constructor(public viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
