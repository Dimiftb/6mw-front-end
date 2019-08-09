import { Component } from '@angular/core';
import {AlertController, App, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Subscription} from "rxjs/Subscription";
import {NativeGeocoder, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
import {SafetyPage} from "../safety/safety";
import {Http} from "@angular/http";
import {AuthService} from "../../providers/auth-service/auth-service";
import {PreviousResultPage} from "../previous-result/previous-result";
import * as moment from "moment";
import { Diagnostic } from '@ionic-native/diagnostic';
import {LocationAccuracy} from "@ionic-native/location-accuracy";
import {BackgroundMode} from "@ionic-native/background-mode";
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import {LoginPage} from "../login/login";


/**
 * Generated class for the WalkTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-walk-test',
  templateUrl: 'walk-test.html',
})
export class WalkTestPage {

    timerStarted: boolean = false;

    countDown;
    counter = 361;//(6*60)+1;

    timer: Subscription;

    countZeroAvgDistances: number = 0;

    maxResult: number = -1;

    newUser: boolean = false;

    result: any = {
        formatDate: null,
        user_id: null,
        distance: null,
        street: null,
        city: null,
        maxResult: -1
    };

    place: any = {
        street: 'Unknown',
        city: 'Unknown'
    };

    saving: any;

    currentUserId: any;

    opts = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    watcher: any;
    positionArray: Array<any> = [];
    overallDist: number = 0;
    newDistarray: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public geo: Geolocation,
                private nativeGeocoder: NativeGeocoder, public modalCtrl: ModalController, public http: Http,
                public auth: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
                public diagnostic: Diagnostic, public locationAccuracy: LocationAccuracy, public backgroundMode: BackgroundMode, public appCtrl: App) {

        this.currentUserId = this.auth.getUserInfo().user_id;
    }

    ionViewDidLoad() {
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/has-result?userId=' + this.currentUserId.toString())
            .map(res => res.json()).subscribe(data => {
            this.newUser = data.code === 200;
        });

        this.backgroundMode.setDefaults({
            title: '6MWTest is running the background.',
            text: 'Tap to return to the app.',
            hidden: false
        });
    }

    initiateTest() {
        this.diagnostic.isGpsLocationAvailable().then(isAvailable => {
            if (isAvailable === false) {
                this.diagnostic.isLocationAuthorized().then(isAuthorized => {
                    if (isAuthorized) {
                        this.checkForLocationRequest();
                    } else {
                        this.authorizeLocationAlert();
                    }
                });
            } else {
                this.getInitialLocation();
            }
        });
    };

    checkForLocationRequest() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                // high accuracy uses GPS, wifi and mobile data
                // this will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                    .then(() => this.getInitialLocation())
                    .catch(() => this.enableLocationAlert());
            } else {
                this.enableLocationAlert();
            }
        });
    }

    startTest() {
        if (!this.newUser) {
            //retrieve current max distance here so we know it before saving.
            this.setCurrentMaxDistance();
            this.backgroundMode.enable();
            this.backgroundMode.on('activate').subscribe(() => {
                this.backgroundMode.disableWebViewOptimizations();
                this.backgroundMode.overrideBackButton()
            });

            this.timerStarted = true;
            const tick = 1000;
            this.countDown = Observable.timer(0, tick).take(this.counter).map(() => --this.counter);

            this.watcher = this.geo.watchPosition(this.opts)
                .filter((p) => p !== undefined)
                .subscribe((position) => {
                    this.positionArray.push(position);
                }, () => this.enableLocationAlert());

            let start = Date.now(); // The current date (in miliseconds)
            let end = start + 360000; // 6 minutes afterwords

            this.timer = Observable.interval(20000).subscribe(() => {
                this.initiateCalculateDistance(start, end);
            });
        } else {
            this.showSafetyAndInstructionsModal();
        }
    }

    initiateCalculateDistance(start: any, end: any) {
        start = Date.now();
        let tempDistance = 0;
        if (start > end) {
            this.savingResultsAlert();
            this.watcher.unsubscribe();

            if (this.positionArray.length > 0) {
                this.smoothOutCurrentDistance(tempDistance);
                if (this.countZeroAvgDistances > 0) {
                    if (this.overallDist > 0) {
                        let overallAvg = this.overallDist / this.newDistarray.length;
                        this.overallDist += overallAvg * this.countZeroAvgDistances;
                    }
                }
            }
            this.saveResult();
            this.stopTest();
        } else {
            if (this.positionArray.length > 0) {
                this.smoothOutCurrentDistance(tempDistance);
            }
        }
    }

    smoothOutCurrentDistance(tempDistance: number) {
        for (let i = 0; i < this.positionArray.length; i++) {
            if (i === (this.positionArray.length - 1)) {
                if (tempDistance <= 50) {
                    this.newDistarray.push(tempDistance);
                    this.overallDist += tempDistance;
                } else {
                    if (this.newDistarray.length > 0) {
                        let avgDifference = 0;
                        if (this.overallDist > 0) {
                            avgDifference = this.overallDist / this.newDistarray.length;
                            this.newDistarray.push(avgDifference);
                            this.overallDist += avgDifference;
                        }
                    } else {
                        this.countZeroAvgDistances++;
                    }
                }
                break;
            }
            tempDistance += this.calculateDistanceCovered(this.positionArray[i].coords.latitude,
                this.positionArray[i].coords.longitude,
                this.positionArray[i + 1].coords.latitude,
                this.positionArray[i + 1].coords.longitude);
        }
        this.positionArray = [];
    }

    stopTest() {
        this.timerStarted = false;
        this.countDown = null;
        this.counter = 361;
        this.timer.unsubscribe();
        this.watcher.unsubscribe();
        this.positionArray = [];
        this.newDistarray = [];
        this.countZeroAvgDistances = 0;
    }

    getInitialLocation() {
        //only get location if the timer isn't running
        if (!this.timerStarted) {
            this.geo.getCurrentPosition(this.opts).then((resp) => {
                this.getStreetAndCity(resp.coords.latitude, resp.coords.longitude);
            }).catch(() => this.enableLocationAlert());
        }
    }

    getStreetAndCity(lat: any, long: any) {
        this.nativeGeocoder.reverseGeocode(lat, long)
            .then((result: NativeGeocoderReverseResult[]) => {
                //this.place.street = result.thoroughfare;
                //this.place.city = result.locality;
                this.startTest();
            }).catch(() => {
            this.place.street = 'Unknown';
            this.place.city = 'Unknown';
            this.startTest();
        });
    }

    setCurrentMaxDistance() {
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/max-distance?userId=' + this.currentUserId.toString())
            .map(res => res.json()).subscribe(data => {
            if (data.distance) {
                this.maxResult = data.distance;
            }
        });
    }

    saveResult() {
        let mySqlDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        let formattedDate = moment.utc().format("DD MMM YYYY hh:mm A");

        this.result = {
            date: mySqlDate,
            formatDate: formattedDate,
            user_id: this.currentUserId.toString(),
            distance: this.overallDist.toFixed(0),
            street: this.place.street,
            city: this.place.city,
            maxResult: this.maxResult
        };

        this.http.post('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/save-result',
            {
                userId: this.result.user_id, date: mySqlDate,
                distance: this.result.distance, street: this.result.street,
                city: this.result.city,
            }).retryWhen(errors => errors.delay(10000)).map(res => res.json()).subscribe(data => {
            if (data.code === 200) {
                this.overallDist = 0;
                setTimeout(() => {
                    this.saving.dismiss();
                }, 2500);
            } else {
                this.saving.dismiss();
                this.overallDist = 0;
            }
        }, () => {
            this.saving.dismiss();
            this.overallDist = 0;
        });
    }

    //taken from https://stackoverflow.com/a/21623206
    //uses haversine formula to produce distance between two GPS points in metres
    calculateDistanceCovered(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
        let d = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        let result = d * 1000;

        return +(result.toFixed(2));
    }


    showSafetyAndInstructionsModal() {
        let safetyInstructionModal = this.modalCtrl.create(SafetyPage);
        safetyInstructionModal.onDidDismiss(() => {
            this.newUser = false;
        });
        safetyInstructionModal.present();
    }


    savingResultsAlert() {
        this.saving = this.loadingCtrl.create({
            content: `<h3>Well done!</h3>
                <p>Hold on a sec while your results are finalised and saved...</p>`
        });

        this.saving.onDidDismiss(() => {
            this.navCtrl.push(PreviousResultPage, this.result);
        });

        this.saving.present();
    }

    initiatieStopTest() {
        let alert = this.alertCtrl.create({
            title: "Warning",
            message: `
        <p>Stopping the test before the full 6 minutes will mean your result won't be recorded.</p>
        <p>If you need a rest but feel you may be able to continue then please continue the test and start walking again when you're ready.</p>
        <p>If you need to stop the test completely for any reason then please do so.</p>
      `,
            buttons: [
                {
                    text: 'I wish to continue'
                },
                {
                    text: 'I wish to stop',
                    handler: () => {
                        this.stopTest();
                        this.overallDist = 0;
                        this.backgroundMode.disable();
                    }
                }
            ]
        });
        alert.present();
    }

    enableLocationAlert() {
        let alert = this.alertCtrl.create({
            title: "Location Services Required",
            message: `<p>There was a problem detecting your location.<br/>
                Please ensure the app has location permissions, location services are turned on and 'High Accuracy' mode is enabled.</p>`,
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.diagnostic.switchToLocationSettings();
                    }
                }
            ]
        });
        alert.present();
    }

    authorizeLocationAlert() {
        let alert = this.alertCtrl.create({
            title: "Location Permissions Required",
            message: `<p>This app requires location permissions in order to track your distance travelled.</p>
                <p>Grant the app location permissions?</p>`,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.diagnostic.requestLocationAuthorization().then(() => {
                            this.checkForLocationRequest();
                        }, () => this.enableLocationAlert());
                    }
                },
                {
                    text: 'No'
                }
            ]
        });
        alert.present();
    }

    logout() {
        this.auth.logout().subscribe(() => {
            this.appCtrl.getRootNav().setRoot(LoginPage);
        });


    }
}
