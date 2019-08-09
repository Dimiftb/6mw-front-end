import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar  } from 'ionic-angular';
import {Http} from "@angular/http";
import {AuthService} from "../../providers/auth-service/auth-service";
import {ResultsPage} from "../results/results";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {BackgroundMode} from "@ionic-native/background-mode";

/**
 * Generated class for the PreviousResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-previous-result',
  templateUrl: 'previous-result.html',
})
export class PreviousResultPage {
  @ViewChild(Navbar) navBar: Navbar;
  previousResult: any;
  avgMessage: any;
  avgUserMessage: any;
  ageGroupAvg: number;

  userAvg: number;
  belowUserAvg: boolean = false;
  aboveUserAvg: boolean = false;
  onUserAvg: boolean = false;

  belowAvg: boolean = false;
  aboveAvg: boolean = false;
  onAvg: boolean = false;

  avgThreshold: number = 15.00;

  hasPrevious: boolean = true;
  gotPreviousResults: boolean = false;

  gotAvgResults: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public auth: AuthService,
              public localNotification: LocalNotifications, public backgroundMode: BackgroundMode) {
    this.previousResult = this.navParams.data;
    this.previousResult.avgDistance = this.getAvgDistancePerMinute(this.previousResult.distance);

    this.gotPreviousResults = false;
    this.gotAvgResults = false;

    this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/user-result-mean?userDOB=' + this.auth.getUserInfo().dob)
      .map(res => res.json()).subscribe(data => {
      this.ageGroupAvg = data.message.toFixed(0);
      this.ageGroupPercentage();
      this.gotAvgResults = true;
    });

    this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/user-all-result-mean?userId=' + this.auth.getUserInfo().user_id.toString())
      .map(res => res.json()).subscribe(data => {
        if(data.code === 200) {
          this.userAvg = data.message.toFixed(0);
          if(this.userAvg > 0) {
            this.previousResultPercentage();
          } else {
            this.hasPrevious = false;
          }
        } else {
          this.hasPrevious = false;
        }
      this.gotPreviousResults = true;
    });
  }

  ionViewDidLoad() {
    this.overrideBackButton();
    if(this.previousResult.maxResult) {
      this.showTestCompleteNotification();
      if(this.previousResult.maxResult > -1) {
        if(parseFloat(this.previousResult.distance) > this.previousResult.maxResult) {
          this.showBestDistanceNotification();
        }
      } else {
        this.showBestDistanceNotification();
      }
    }
    if(this.backgroundMode.isEnabled()) {
      this.backgroundMode.disable();
    }
  }

  showBestDistanceNotification() {
    this.localNotification.clear(0).then(() => {
      this.localNotification.schedule({
        id: 0,
        title: `Congratulations, ${ this.auth.getUserInfo().forename} 🎉`,
        text: `You have a new best distance of ${this.previousResult.distance} metres!\nKeep up the good work 👍!`
      });
    });
  }

  showTestCompleteNotification() {
    this.localNotification.clear(1).then(() => {
      this.localNotification.schedule({
        id: 1,
        title: "6MWTest complete",
        text: `Overall distance travelled: ${this.previousResult.distance} metres!\nWell done, ${this.auth.getUserInfo().forename} 👍!`
      });
    });
  }

  calculateAverage(avg: any) {
    let difference = this.previousResult.distance - avg;
    return parseFloat((difference / avg * 100).toFixed(2));
  }

  previousResultPercentage() {
    let percentDifference = this.calculateAverage(this.userAvg);

    if(percentDifference > this.avgThreshold) {
      this.aboveUserAvg = true;
      this.avgUserMessage = `This result is ${percentDifference}% above the average of your previous results!`;
    } else if (percentDifference < -this.avgThreshold){
      this.belowUserAvg = true;
      this.avgUserMessage = `This result is ${Math.abs(percentDifference)}% below the average of your previous results!`;
    } else if (percentDifference > -this.avgThreshold && percentDifference < this.avgThreshold) {
      this.onUserAvg = true;
      this.avgUserMessage = "This result is around the average of your previous results!";
    }

  }

  ageGroupPercentage() {
    let percentDifference = this.calculateAverage(this.ageGroupAvg);

    if(percentDifference > this.avgThreshold) {
      this.aboveAvg = true;
      this.avgMessage = `This result is ${percentDifference}% above the average in your age group!`;
    } else if (percentDifference < -this.avgThreshold){
      this.belowAvg = true;
      this.avgMessage = `This result is ${Math.abs(percentDifference)}% below the average in your age group!`;
    } else if (percentDifference > -this.avgThreshold && percentDifference < this.avgThreshold) {
      this.onAvg = true;
      this.avgMessage = "This result is around the average in your age group!";
    }

  }

  getAvgDistancePerMinute(distance) {
    return ((distance/360) * 60).toFixed(2);
  }

  overrideBackButton() {
    //override default back button click for when coming to this page from
    //walk-test ending
    this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(ResultsPage);
    }
  }

}
