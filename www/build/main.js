webpackJsonp([0],{

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreviousResultPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__results_results__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_local_notifications__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_background_mode__ = __webpack_require__(137);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the PreviousResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PreviousResultPage = /** @class */ (function () {
    function PreviousResultPage(navCtrl, navParams, http, auth, localNotification, backgroundMode) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.auth = auth;
        this.localNotification = localNotification;
        this.backgroundMode = backgroundMode;
        this.belowUserAvg = false;
        this.aboveUserAvg = false;
        this.onUserAvg = false;
        this.belowAvg = false;
        this.aboveAvg = false;
        this.onAvg = false;
        this.avgThreshold = 15.00;
        this.hasPrevious = true;
        this.gotPreviousResults = false;
        this.gotAvgResults = false;
        this.previousResult = this.navParams.data;
        this.previousResult.avgDistance = this.getAvgDistancePerMinute(this.previousResult.distance);
        this.gotPreviousResults = false;
        this.gotAvgResults = false;
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/user-result-mean?userDOB=' + this.auth.getUserInfo().dob)
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            _this.ageGroupAvg = data.message.toFixed(0);
            _this.ageGroupPercentage();
            _this.gotAvgResults = true;
        });
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/user-all-result-mean?userId=' + this.auth.getUserInfo().user_id.toString())
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            if (data.code === 200) {
                _this.userAvg = data.message.toFixed(0);
                if (_this.userAvg > 0) {
                    _this.previousResultPercentage();
                }
                else {
                    _this.hasPrevious = false;
                }
            }
            else {
                _this.hasPrevious = false;
            }
            _this.gotPreviousResults = true;
        });
    }
    PreviousResultPage.prototype.ionViewDidLoad = function () {
        this.overrideBackButton();
        if (this.previousResult.maxResult) {
            this.showTestCompleteNotification();
            if (this.previousResult.maxResult > -1) {
                if (parseFloat(this.previousResult.distance) > this.previousResult.maxResult) {
                    this.showBestDistanceNotification();
                }
            }
            else {
                this.showBestDistanceNotification();
            }
        }
        if (this.backgroundMode.isEnabled()) {
            this.backgroundMode.disable();
        }
    };
    PreviousResultPage.prototype.showBestDistanceNotification = function () {
        var _this = this;
        this.localNotification.clear(0).then(function () {
            _this.localNotification.schedule({
                id: 0,
                title: "Congratulations, " + _this.auth.getUserInfo().forename + " \uD83C\uDF89",
                text: "You have a new best distance of " + _this.previousResult.distance + " metres!\nKeep up the good work \uD83D\uDC4D!"
            });
        });
    };
    PreviousResultPage.prototype.showTestCompleteNotification = function () {
        var _this = this;
        this.localNotification.clear(1).then(function () {
            _this.localNotification.schedule({
                id: 1,
                title: "6MWTest complete",
                text: "Overall distance travelled: " + _this.previousResult.distance + " metres!\nWell done, " + _this.auth.getUserInfo().forename + " \uD83D\uDC4D!"
            });
        });
    };
    PreviousResultPage.prototype.calculateAverage = function (avg) {
        var difference = this.previousResult.distance - avg;
        return parseFloat((difference / avg * 100).toFixed(2));
    };
    PreviousResultPage.prototype.previousResultPercentage = function () {
        var percentDifference = this.calculateAverage(this.userAvg);
        if (percentDifference > this.avgThreshold) {
            this.aboveUserAvg = true;
            this.avgUserMessage = "This result is " + percentDifference + "% above the average of your previous results!";
        }
        else if (percentDifference < -this.avgThreshold) {
            this.belowUserAvg = true;
            this.avgUserMessage = "This result is " + Math.abs(percentDifference) + "% below the average of your previous results!";
        }
        else if (percentDifference > -this.avgThreshold && percentDifference < this.avgThreshold) {
            this.onUserAvg = true;
            this.avgUserMessage = "This result is around the average of your previous results!";
        }
    };
    PreviousResultPage.prototype.ageGroupPercentage = function () {
        var percentDifference = this.calculateAverage(this.ageGroupAvg);
        if (percentDifference > this.avgThreshold) {
            this.aboveAvg = true;
            this.avgMessage = "This result is " + percentDifference + "% above the average in your age group!";
        }
        else if (percentDifference < -this.avgThreshold) {
            this.belowAvg = true;
            this.avgMessage = "This result is " + Math.abs(percentDifference) + "% below the average in your age group!";
        }
        else if (percentDifference > -this.avgThreshold && percentDifference < this.avgThreshold) {
            this.onAvg = true;
            this.avgMessage = "This result is around the average in your age group!";
        }
    };
    PreviousResultPage.prototype.getAvgDistancePerMinute = function (distance) {
        return ((distance / 360) * 60).toFixed(2);
    };
    PreviousResultPage.prototype.overrideBackButton = function () {
        var _this = this;
        //override default back button click for when coming to this page from
        //walk-test ending
        this.navBar.backButtonClick = function () {
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__results_results__["a" /* ResultsPage */]);
        };
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Navbar */])
    ], PreviousResultPage.prototype, "navBar", void 0);
    PreviousResultPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-previous-result',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\previous-result\previous-result.html"*/'<!--\n\n  Generated template for the PreviousResultPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Back</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding text-center>\n\n  <div>\n\n    <h2>{{previousResult.formatDate.substr(0,11)}} @{{previousResult.formatDate.substr(11,9)}}</h2>\n\n    <h3>{{previousResult.street || \'Unknown\'}}, {{previousResult.city || \'Unknown\'}}</h3>\n\n  </div>\n\n  <hr/>\n\n  <div padding text-center>\n\n    <h4>Test Results</h4>\n\n    <p>Overall distance travelled: {{previousResult.distance}} metres</p>\n\n    <p>Average distance per minute: {{previousResult.avgDistance}} metres</p>\n\n  </div>\n\n  <hr/>\n\n  <div padding text-center>\n\n    <h4>Previous Results Comparison</h4>\n\n    <div *ngIf="gotPreviousResults && hasPrevious">\n\n      <ion-icon name="happy" class="avg-icon above" *ngIf="aboveUserAvg"></ion-icon>\n\n      <ion-icon name="sad" class="avg-icon below" *ngIf="belowUserAvg"></ion-icon>\n\n      <ion-icon name="happy" class="avg-icon on" *ngIf="onUserAvg"></ion-icon>\n\n      <p>{{avgUserMessage}}</p>\n\n    </div>\n\n    <div *ngIf="gotPreviousResults && !hasPrevious">\n\n      <ion-icon name="thumbs-up" class="avg-icon above"></ion-icon>\n\n      <p>Looks like this result is your only one or your other distances are zero!<br/>Why don\'t you change this by taking a new test?</p>\n\n    </div>\n\n    <div *ngIf="!gotPreviousResults">\n\n      <ion-spinner></ion-spinner>\n\n    </div>\n\n  </div>\n\n  <hr/>\n\n  <div padding text-center>\n\n    <h4>Age Group Comparison</h4>\n\n    <div *ngIf="gotAvgResults">\n\n      <ion-icon name="happy" class="avg-icon above" *ngIf="aboveAvg"></ion-icon>\n\n      <ion-icon name="sad" class="avg-icon below" *ngIf="belowAvg"></ion-icon>\n\n      <ion-icon name="happy" class="avg-icon on" *ngIf="onAvg"></ion-icon>\n\n      <p>{{avgMessage}}</p>\n\n    </div>\n\n    <div *ngIf="!gotAvgResults">\n\n      <ion-spinner></ion-spinner>\n\n    </div>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\previous-result\previous-result.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_local_notifications__["a" /* LocalNotifications */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_background_mode__["a" /* BackgroundMode */]])
    ], PreviousResultPage);
    return PreviousResultPage;
}());

//# sourceMappingURL=previous-result.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResultsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(716);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__previous_result_previous_result__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ResultsPage = /** @class */ (function () {
    function ResultsPage(navCtrl, navParams, http, auth, loadingCtrl, appCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.auth = auth;
        this.loadingCtrl = loadingCtrl;
        this.appCtrl = appCtrl;
        this.holder = 'results page';
        this.previousResults = [];
        this.hasPreviousResults = false;
        var info = this.auth.getUserInfo();
        this.userId = info.user_id;
    }
    ResultsPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.showLoading();
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/previous-results?userId=' + this.userId.toString())
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            _this.hasPreviousResults = data.code !== 204;
            if (_this.hasPreviousResults) {
                var distances_1 = [];
                data.forEach(function (item) {
                    distances_1.push(item.distance);
                });
                _this.previousResults = data;
                _this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/last-ten-results?userId=' + _this.userId.toString())
                    .map(function (res) { return res.json(); }).subscribe(function (data) {
                    var graphData = { graphLabels: [], graphContent: [] };
                    if (_this.hasPreviousResults) {
                        data.forEach(function (item) {
                            graphData.graphLabels.push(item.formatDate);
                            graphData.graphContent.push(item.distance);
                        });
                        _this.initializeChart(graphData);
                    }
                });
                _this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/max-distance?userId=' + _this.userId.toString())
                    .map(function (res) { return res.json(); }).subscribe(function (data) {
                    _this.bestDistance = data.distance;
                });
                _this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/min-distance?userId=' + _this.userId.toString())
                    .map(function (res) { return res.json(); }).subscribe(function (data) {
                    _this.worstDistance = data.distance;
                });
            }
            _this.loading.dismiss();
            _this.loading = null;
        });
    };
    ResultsPage.prototype.ionViewDidLoad = function () {
    };
    ResultsPage.prototype.showPreviousResult = function (result) {
        result.userId = this.userId;
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__previous_result_previous_result__["a" /* PreviousResultPage */], result);
    };
    ResultsPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Fetching results...'
        });
        this.loading.present();
    };
    ResultsPage.prototype.logout = function () {
        var _this = this;
        this.auth.logout().subscribe(function () {
            _this.appCtrl.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
        });
    };
    ResultsPage.prototype.initializeChart = function (graphData) {
        this.resultsChart = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.resultsGraph.nativeElement, {
            type: 'line',
            data: {
                labels: graphData.graphLabels,
                datasets: [
                    {
                        label: false,
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "#488aff",
                        borderColor: "#407ce5",
                        borderCapStyle: 'round',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "#407ce5",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "#407ce5",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: graphData.graphContent,
                        spanGaps: false,
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                            ticks: {
                                stepSize: 1,
                                min: 0,
                                autoSkip: false,
                                minRotation: 80,
                                callback: function (data) {
                                    return data.substr(0, 11);
                                }
                            }
                        }]
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, d) {
                            return d.labels[tooltipItem[0].index].substr(0, 11) +
                                d.labels[tooltipItem[0].index].substr(11, 9);
                        }
                    }
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('resultsGraph'),
        __metadata("design:type", Object)
    ], ResultsPage.prototype, "resultsGraph", void 0);
    ResultsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-results',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\results\results.html"*/'<!--\n\n  Generated template for the ResultsPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <img src="assets/imgs/header.png" height="44" style="padding-left:2%"/>\n\n    <ion-buttons end>\n\n      <ion-label stacked>Logout</ion-label>\n\n      <button ion-button icon-only (click)="logout()"><ion-icon name="log-out"></ion-icon></button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <h4 class="non-center">\n\n    Last 10 Results\n\n  </h4>\n\n  <div class="results-graph" *ngIf="hasPreviousResults">\n\n    <canvas #resultsGraph></canvas>\n\n  </div>\n\n  <p *ngIf="!hasPreviousResults">No previous results found.</p>\n\n  <div padding *ngIf="hasPreviousResults">\n\n    <hr/>\n\n    <div padding>\n\n      <h4 text-center>Best Distance Travelled</h4>\n\n      <h4 text-center class="best-distance">{{bestDistance || 0}} metres</h4>\n\n    </div>\n\n    <hr/>\n\n    <div padding>\n\n      <h4 text-center>Worst Distance Travelled</h4>\n\n      <h4 text-center class="worst-distance">{{worstDistance || 0}} metres</h4>\n\n    </div>\n\n    <hr/>\n\n  </div>\n\n  <h4 class="non-center">\n\n    All Previous Results\n\n  </h4>\n\n  <div>\n\n    <ion-list>\n\n        <button ion-item *ngFor="let result of previousResults" no-lines style="border-top:1px solid rgba(129,129,129,0.39);" (click)="showPreviousResult(result)">\n\n          {{ result.formatDate.substr(0,11) + \' - \' + result.formatDate.substr(11,9) }}\n\n          <br/>\n\n          <span class="address-text">{{result.street || \'Unknown\'}}, {{result.city || \'Unknown\'}}</span>\n\n          <ion-icon name="arrow-forward" item-end></ion-icon>\n\n        </button>\n\n    </ion-list>\n\n  </div>\n\n  <p *ngIf="!hasPreviousResults">No previous results found.</p>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\results\results.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], ResultsPage);
    return ResultsPage;
}());

//# sourceMappingURL=results.js.map

/***/ }),

/***/ 147:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 147;

/***/ }),

/***/ 190:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 190;

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, navParams, auth, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.createSuccess = false;
        this.registerCredentials = { forename: '', surname: '', dob: '', email: '', password: '' };
        this.mylog("Constructor");
    }
    RegisterPage.prototype.mylog = function (s) {
        console.log("   >>>>>  RegisterPage: " + s + "  <<<<<   "); //comment out to turn off debug logging
    };
    RegisterPage.prototype.ionViewDidLoad = function () {
        this.mylog("ionViewDidLoad");
        console.log('ionViewDidLoad RegisterPage');
    };
    RegisterPage.prototype.register = function () {
        var _this = this;
        this.mylog("register");
        this.showLoading();
        this.registerCredentials.dob = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.registerCredentials.dob).format("YYYY-MM-DD");
        this.auth.register(this.registerCredentials).subscribe(function (success) {
            if (success) {
                _this.createSuccess = true;
                _this.showPopup("Account created", _this.auth.getMessage());
            }
            else {
                _this.showPopup("Error creating account", _this.auth.getMessage());
            }
        }, function () {
            _this.showPopup("Error creating account", "Please try again.");
        });
    };
    RegisterPage.prototype.showLoading = function () {
        this.mylog("showLoading");
        this.loading = this.loadingCtrl.create({
            content: 'Registering your account...',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    RegisterPage.prototype.showPopup = function (title, text) {
        var _this = this;
        this.mylog("showPopup");
        this.loading.dismiss();
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function () {
                        if (_this.createSuccess) {
                            _this.navCtrl.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\register\register.html"*/'<!--\n\n  Generated template for the LoginPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Back</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content class="login-content" padding>\n\n  <ion-row class="logo-row">\n\n    <ion-col></ion-col>\n\n    <ion-col width-67>\n\n      <img src="assets/imgs/icon.png"/>\n\n    </ion-col>\n\n    <ion-col></ion-col>\n\n  </ion-row>\n\n  <div class="login-box">\n\n    <form (ngSubmit)="register()" #registerForm="ngForm">\n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n            <ion-item>\n\n              <ion-label stacked>Forename</ion-label>\n\n              <ion-input type="text" name="forename" [(ngModel)]="registerCredentials.forename" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Surname</ion-label>\n\n              <ion-input type="text" name="surname" [(ngModel)]="registerCredentials.surname" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>DOB</ion-label>\n\n              <ion-datetime displayFormat="DD/MM/YYYY" name="dob" [(ngModel)]="registerCredentials.dob" required></ion-datetime>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Email</ion-label>\n\n              <ion-input type="email" name="email" [(ngModel)]="registerCredentials.email" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Password</ion-label>\n\n              <ion-input type="password" name="password" [(ngModel)]="registerCredentials.password" required></ion-input>\n\n            </ion-item>\n\n\n\n          </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col class="signup-col">\n\n          <button ion-button class="submit-btn" full [disabled]="!registerForm.form.valid">Register</button>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n    </form>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\register\register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.login = function (credentials) {
        var _this = this;
        if (credentials.email === null || credentials.password === null) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].throw("Please insert credentials");
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/login', { email: credentials.email, password: credentials.password }).map(function (res) { return res.json(); }).subscribe(function (data) {
                    if (data.code === 200) {
                        _this.currentUser = data.message;
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("email", _this.currentUser.email);
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        _this.message = data.message;
                        observer.next(false);
                        observer.complete();
                    }
                }, function (err) { return console.log(err); });
            });
        }
    };
    AuthService.prototype.checkLoggedIn = function (credentials) {
        var _this = this;
        if (credentials.email === null || credentials.token === null) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].throw("Please insert credentials");
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/get-details', { email: credentials.email, token: credentials.token }).map(function (res) { return res.json(); }).subscribe(function (data) {
                    if (data.code === 200) {
                        _this.currentUser = data.message;
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        _this.message = data.message;
                        observer.next(false);
                        observer.complete();
                    }
                }, function (err) { return console.log(err); });
            });
        }
    };
    AuthService.prototype.register = function (credentials) {
        var _this = this;
        if (credentials.forename === null || credentials.surname === null || credentials.dob === null
            || credentials.email === null || credentials.password === null) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].throw("Please fill in all fields.");
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/register', { forename: credentials.forename,
                    surname: credentials.surname,
                    dob: credentials.dob,
                    email: credentials.email,
                    password: credentials.password }).map(function (res) { return res.json(); }).subscribe(function (data) {
                    if (data.code === 200) {
                        _this.message = data.message;
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        _this.message = data.message;
                        observer.next(false);
                        observer.complete();
                    }
                }, function (err) { return console.log(err); });
            });
        }
    };
    AuthService.prototype.resetPassword = function (credentials) {
        var _this = this;
        if (credentials.email === null || credentials.password === null || credentials.confirmPassword === null) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].throw("Please fill in all fields.");
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.post('https://devweb2018.cis.strath.ac.uk/gbb15154-nodejs/api/reset-password', { email: credentials.email, password: credentials.password, confirmPassword: credentials.confirmPassword })
                    .map(function (res) { return res.json(); }).subscribe(function (data) {
                    if (data.code === 200) {
                        _this.message = data.message;
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        _this.message = data.message;
                        observer.next(false);
                        observer.complete();
                    }
                }, function (err) { return console.log(err); });
            });
        }
    };
    AuthService.prototype.getUserInfo = function () {
        return this.currentUser;
    };
    AuthService.prototype.getMessage = function () {
        return this.message;
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.currentUser = null;
            localStorage.clear();
            observer.next(true);
            observer.complete();
        });
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
    ], AuthService);
    return AuthService;
}());

//# sourceMappingURL=auth-service.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResetPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular_util_util__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the ResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ResetPage = /** @class */ (function () {
    function ResetPage(navCtrl, navParams, alertCtrl, auth, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.auth = auth;
        this.loadingCtrl = loadingCtrl;
        this.resetCredentials = { email: '', password: '', confirmPassword: '' };
    }
    ResetPage.prototype.ionViewDidLoad = function () {
    };
    ResetPage.prototype.reset = function () {
        var _this = this;
        if (this.resetCredentials.password !== this.resetCredentials.confirmPassword) {
            this.showError("Please ensure both passwords match.");
        }
        else {
            this.showLoading();
            this.auth.resetPassword(this.resetCredentials).subscribe(function (allowed) {
                if (allowed) {
                    _this.showError(_this.auth.getMessage());
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
                }
                else {
                    _this.showError(_this.auth.getMessage());
                    _this.resetCredentials.email = '';
                    _this.resetCredentials.password = '';
                    _this.resetCredentials.confirmPassword = '';
                }
            }, function () {
                _this.showError("We had a problem trying to reset your password.\nPlease try again");
            });
        }
    };
    ResetPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Resetting password...',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    ResetPage.prototype.showError = function (text) {
        if (Object(__WEBPACK_IMPORTED_MODULE_4_ionic_angular_util_util__["h" /* isDefined */])(this.loading)) {
            this.loading.dismiss();
        }
        var alert = this.alertCtrl.create({
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    ResetPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-reset',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\reset\reset.html"*/'<!--\n\n  Generated template for the LoginPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Back</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content class="login-content" padding>\n\n  <ion-row class="logo-row">\n\n    <ion-col></ion-col>\n\n    <ion-col width-67>\n\n      <img src="assets/imgs/icon.png"/>\n\n    </ion-col>\n\n    <ion-col></ion-col>\n\n  </ion-row>\n\n  <div class="login-box">\n\n    <form (ngSubmit)="reset()" #resetForm="ngForm">\n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n            <ion-item>\n\n              <ion-label stacked>Email</ion-label>\n\n              <ion-input type="email" name="email" [(ngModel)]="resetCredentials.email" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Password</ion-label>\n\n              <ion-input type="password" name="password" [(ngModel)]="resetCredentials.password" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Confirm Password</ion-label>\n\n              <ion-input type="password" name="password" [(ngModel)]="resetCredentials.confirmPassword" required></ion-input>\n\n            </ion-item>\n\n          </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col class="signup-col">\n\n          <button ion-button class="submit-btn" full [disabled]="!resetForm.form.valid">Reset password</button>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n    </form>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\reset\reset.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], ResetPage);
    return ResetPage;
}());

//# sourceMappingURL=reset.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__walk_test_walk_test__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__results_results__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profile_profile__ = __webpack_require__(397);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.homeRoot = __WEBPACK_IMPORTED_MODULE_1__walk_test_walk_test__["a" /* WalkTestPage */];
        this.logRoot = __WEBPACK_IMPORTED_MODULE_2__results_results__["a" /* ResultsPage */];
        this.profileRoot = __WEBPACK_IMPORTED_MODULE_3__profile_profile__["a" /* ProfilePage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\tabs\tabs.html"*/'<ion-tabs selectedIndex="1">\n\n  <ion-tab [root]="logRoot" tabTitle="Log" tabIcon="stats"></ion-tab>\n\n  <ion-tab [root]="homeRoot" tabTitle="Home" tabIcon="home"></ion-tab>\n\n  <ion-tab [root]="profileRoot" tabTitle="Profile" tabIcon="person"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalkTestPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(451);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_geocoder__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__safety_safety__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__previous_result_previous_result__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_diagnostic__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_location_accuracy__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_background_mode__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_rxjs_add_operator_retry__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_rxjs_add_operator_retry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_rxjs_add_operator_retry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_add_operator_retryWhen__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_add_operator_retryWhen___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_rxjs_add_operator_retryWhen__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs_add_operator_delay__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs_add_operator_delay___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_rxjs_add_operator_delay__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__login_login__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


















/**
 * Generated class for the WalkTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var WalkTestPage = /** @class */ (function () {
    function WalkTestPage(navCtrl, navParams, geo, nativeGeocoder, modalCtrl, http, auth, alertCtrl, loadingCtrl, diagnostic, locationAccuracy, backgroundMode, appCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geo = geo;
        this.nativeGeocoder = nativeGeocoder;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.diagnostic = diagnostic;
        this.locationAccuracy = locationAccuracy;
        this.backgroundMode = backgroundMode;
        this.appCtrl = appCtrl;
        this.timerStarted = false;
        this.counter = 361; //(6*60)+1;
        this.countZeroAvgDistances = 0;
        this.maxResult = -1;
        this.newUser = false;
        this.result = {
            formatDate: null,
            user_id: null,
            distance: null,
            street: null,
            city: null,
            maxResult: -1
        };
        this.place = {
            street: 'Unknown',
            city: 'Unknown'
        };
        this.opts = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        this.positionArray = [];
        this.overallDist = 0;
        this.newDistarray = [];
        this.currentUserId = this.auth.getUserInfo().user_id;
    }
    WalkTestPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/has-result?userId=' + this.currentUserId.toString())
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            _this.newUser = data.code === 200;
        });
        this.backgroundMode.setDefaults({
            title: '6MWTest is running the background.',
            text: 'Tap to return to the app.',
            hidden: false
        });
    };
    WalkTestPage.prototype.initiateTest = function () {
        var _this = this;
        this.diagnostic.isGpsLocationAvailable().then(function (isAvailable) {
            if (isAvailable === false) {
                _this.diagnostic.isLocationAuthorized().then(function (isAuthorized) {
                    if (isAuthorized) {
                        _this.checkForLocationRequest();
                    }
                    else {
                        _this.authorizeLocationAlert();
                    }
                });
            }
            else {
                _this.getInitialLocation();
            }
        });
    };
    ;
    WalkTestPage.prototype.checkForLocationRequest = function () {
        var _this = this;
        this.locationAccuracy.canRequest().then(function (canRequest) {
            if (canRequest) {
                // high accuracy uses GPS, wifi and mobile data
                // this will be ignored by iOS
                _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
                    .then(function () { return _this.getInitialLocation(); })
                    .catch(function () { return _this.enableLocationAlert(); });
            }
            else {
                _this.enableLocationAlert();
            }
        });
    };
    WalkTestPage.prototype.startTest = function () {
        var _this = this;
        if (!this.newUser) {
            //retrieve current max distance here so we know it before saving.
            this.setCurrentMaxDistance();
            this.backgroundMode.enable();
            this.backgroundMode.on('activate').subscribe(function () {
                _this.backgroundMode.disableWebViewOptimizations();
                _this.backgroundMode.overrideBackButton();
            });
            this.timerStarted = true;
            var tick = 1000;
            this.countDown = __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].timer(0, tick).take(this.counter).map(function () { return --_this.counter; });
            this.watcher = this.geo.watchPosition(this.opts)
                .filter(function (p) { return p !== undefined; })
                .subscribe(function (position) {
                _this.positionArray.push(position);
            }, function () { return _this.enableLocationAlert(); });
            var start_1 = Date.now(); // The current date (in miliseconds)
            var end_1 = start_1 + 360000; // 6 minutes afterwords
            this.timer = __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__["Observable"].interval(20000).subscribe(function () {
                _this.initiateCalculateDistance(start_1, end_1);
            });
        }
        else {
            this.showSafetyAndInstructionsModal();
        }
    };
    WalkTestPage.prototype.initiateCalculateDistance = function (start, end) {
        start = Date.now();
        var tempDistance = 0;
        if (start > end) {
            this.savingResultsAlert();
            this.watcher.unsubscribe();
            if (this.positionArray.length > 0) {
                this.smoothOutCurrentDistance(tempDistance);
                if (this.countZeroAvgDistances > 0) {
                    if (this.overallDist > 0) {
                        var overallAvg = this.overallDist / this.newDistarray.length;
                        this.overallDist += overallAvg * this.countZeroAvgDistances;
                    }
                }
            }
            this.saveResult();
            this.stopTest();
        }
        else {
            if (this.positionArray.length > 0) {
                this.smoothOutCurrentDistance(tempDistance);
            }
        }
    };
    WalkTestPage.prototype.smoothOutCurrentDistance = function (tempDistance) {
        for (var i = 0; i < this.positionArray.length; i++) {
            if (i === (this.positionArray.length - 1)) {
                if (tempDistance <= 50) {
                    this.newDistarray.push(tempDistance);
                    this.overallDist += tempDistance;
                }
                else {
                    if (this.newDistarray.length > 0) {
                        var avgDifference = 0;
                        if (this.overallDist > 0) {
                            avgDifference = this.overallDist / this.newDistarray.length;
                            this.newDistarray.push(avgDifference);
                            this.overallDist += avgDifference;
                        }
                    }
                    else {
                        this.countZeroAvgDistances++;
                    }
                }
                break;
            }
            tempDistance += this.calculateDistanceCovered(this.positionArray[i].coords.latitude, this.positionArray[i].coords.longitude, this.positionArray[i + 1].coords.latitude, this.positionArray[i + 1].coords.longitude);
        }
        this.positionArray = [];
    };
    WalkTestPage.prototype.stopTest = function () {
        this.timerStarted = false;
        this.countDown = null;
        this.counter = 361;
        this.timer.unsubscribe();
        this.watcher.unsubscribe();
        this.positionArray = [];
        this.newDistarray = [];
        this.countZeroAvgDistances = 0;
    };
    WalkTestPage.prototype.getInitialLocation = function () {
        var _this = this;
        //only get location if the timer isn't running
        if (!this.timerStarted) {
            this.geo.getCurrentPosition(this.opts).then(function (resp) {
                _this.getStreetAndCity(resp.coords.latitude, resp.coords.longitude);
            }).catch(function () { return _this.enableLocationAlert(); });
        }
    };
    WalkTestPage.prototype.getStreetAndCity = function (lat, long) {
        var _this = this;
        this.nativeGeocoder.reverseGeocode(lat, long)
            .then(function (result) {
            //this.place.street = result.thoroughfare;
            //this.place.city = result.locality;
            _this.startTest();
        }).catch(function () {
            _this.place.street = 'Unknown';
            _this.place.city = 'Unknown';
            _this.startTest();
        });
    };
    WalkTestPage.prototype.setCurrentMaxDistance = function () {
        var _this = this;
        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/max-distance?userId=' + this.currentUserId.toString())
            .map(function (res) { return res.json(); }).subscribe(function (data) {
            if (data.distance) {
                _this.maxResult = data.distance;
            }
        });
    };
    WalkTestPage.prototype.saveResult = function () {
        var _this = this;
        var mySqlDate = __WEBPACK_IMPORTED_MODULE_10_moment__["utc"]().format("YYYY-MM-DD HH:mm:ss");
        var formattedDate = __WEBPACK_IMPORTED_MODULE_10_moment__["utc"]().format("DD MMM YYYY hh:mm A");
        this.result = {
            date: mySqlDate,
            formatDate: formattedDate,
            user_id: this.currentUserId.toString(),
            distance: this.overallDist.toFixed(0),
            street: this.place.street,
            city: this.place.city,
            maxResult: this.maxResult
        };
        this.http.post('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/save-result', {
            userId: this.result.user_id, date: mySqlDate,
            distance: this.result.distance, street: this.result.street,
            city: this.result.city,
        }).retryWhen(function (errors) { return errors.delay(10000); }).map(function (res) { return res.json(); }).subscribe(function (data) {
            if (data.code === 200) {
                _this.overallDist = 0;
                setTimeout(function () {
                    _this.saving.dismiss();
                }, 2500);
            }
            else {
                _this.saving.dismiss();
                _this.overallDist = 0;
            }
        }, function () {
            _this.saving.dismiss();
            _this.overallDist = 0;
        });
    };
    //taken from https://stackoverflow.com/a/21623206
    //uses haversine formula to produce distance between two GPS points in metres
    WalkTestPage.prototype.calculateDistanceCovered = function (lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;
        var d = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        var result = d * 1000;
        return +(result.toFixed(2));
    };
    WalkTestPage.prototype.showSafetyAndInstructionsModal = function () {
        var _this = this;
        var safetyInstructionModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__safety_safety__["a" /* SafetyPage */]);
        safetyInstructionModal.onDidDismiss(function () {
            _this.newUser = false;
        });
        safetyInstructionModal.present();
    };
    WalkTestPage.prototype.savingResultsAlert = function () {
        var _this = this;
        this.saving = this.loadingCtrl.create({
            content: "<h3>Well done!</h3>\n                <p>Hold on a sec while your results are finalised and saved...</p>"
        });
        this.saving.onDidDismiss(function () {
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__previous_result_previous_result__["a" /* PreviousResultPage */], _this.result);
        });
        this.saving.present();
    };
    WalkTestPage.prototype.initiatieStopTest = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Warning",
            message: "\n        <p>Stopping the test before the full 6 minutes will mean your result won't be recorded.</p>\n        <p>If you need a rest but feel you may be able to continue then please continue the test and start walking again when you're ready.</p>\n        <p>If you need to stop the test completely for any reason then please do so.</p>\n      ",
            buttons: [
                {
                    text: 'I wish to continue'
                },
                {
                    text: 'I wish to stop',
                    handler: function () {
                        _this.stopTest();
                        _this.overallDist = 0;
                        _this.backgroundMode.disable();
                    }
                }
            ]
        });
        alert.present();
    };
    WalkTestPage.prototype.enableLocationAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Location Services Required",
            message: "<p>There was a problem detecting your location.<br/>\n                Please ensure the app has location permissions, location services are turned on and 'High Accuracy' mode is enabled.</p>",
            buttons: [
                {
                    text: 'Ok',
                    handler: function () {
                        _this.diagnostic.switchToLocationSettings();
                    }
                }
            ]
        });
        alert.present();
    };
    WalkTestPage.prototype.authorizeLocationAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Location Permissions Required",
            message: "<p>This app requires location permissions in order to track your distance travelled.</p>\n                <p>Grant the app location permissions?</p>",
            buttons: [
                {
                    text: 'Yes',
                    handler: function () {
                        _this.diagnostic.requestLocationAuthorization().then(function () {
                            _this.checkForLocationRequest();
                        }, function () { return _this.enableLocationAlert(); });
                    }
                },
                {
                    text: 'No'
                }
            ]
        });
        alert.present();
    };
    WalkTestPage.prototype.logout = function () {
        var _this = this;
        this.auth.logout().subscribe(function () {
            _this.appCtrl.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_17__login_login__["a" /* LoginPage */]);
        });
    };
    WalkTestPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-walk-test',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\walk-test\walk-test.html"*/'<!--\n\n  Generated template for the WalkTestPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <img src="assets/imgs/header.png" height="44" style="padding-left:2%"/>\n\n    <ion-buttons end>\n\n      <ion-label stacked>Logout</ion-label>\n\n      <button ion-button icon-only (click)="logout()"><ion-icon name="log-out"></ion-icon></button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-row>\n\n    <ion-col>\n\n      <div class="timer-circle">\n\n        <p class="timer-text" ion-text text-center>{{countDown | async | timer}}</p>\n\n      </div>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row class="button-row">\n\n    <ion-col text-center>\n\n      <button ion-button block (click)="initiateTest()" *ngIf="!timerStarted">Start Timer</button>\n\n      <button ion-button block (click)="initiatieStopTest()" *ngIf="timerStarted">Stop Timer</button>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row>\n\n    <ion-col>\n\n      <p text-center class="instruction-text" (click)="showSafetyAndInstructionsModal()">Safety & Instructions</p>\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\walk-test\walk-test.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_geocoder__["a" /* NativeGeocoder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_7__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_8__providers_auth_service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_location_accuracy__["a" /* LocationAccuracy */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_background_mode__["a" /* BackgroundMode */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], WalkTestPage);
    return WalkTestPage;
}());

//# sourceMappingURL=walk-test.js.map

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SafetyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the SafetyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SafetyPage = /** @class */ (function () {
    function SafetyPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    SafetyPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    SafetyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-safety',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\safety\safety.html"*/'<!--\n\n  Generated template for the SafetyPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <img src="assets/imgs/header.png" height="44" style="padding-left:2%"/>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h2>Safety</h2>\n\n  <ul>\n\n    <li>Please ensure that you are wearing comfortable and appropriate clothing and footwear before carrying out a test.</li>\n\n    <li>If at any point you feel like you need a break then please stop and rest. The timer will continue to count down\n\n    unless you explicitly stop the test, allowing you to continue at any time.</li>\n\n    <li>If you feel any shortness of breath, dizziness, or any other symptoms out of the ordinary, or you feel like\n\n      you can\'t continue the test for any other reason then please stop the test immediately and seek medical advice if necessary.</li>\n\n    <li>It is at the user\'s discretion where they carry out a test, but ideally the test should be carried out on flat ground. please be aware when crossing roads, walkways, and paths.\n\n    Ideally you should carry out a test in a clear, traffic free area as per the instructions below.</li>\n\n  </ul>\n\n  <hr/>\n\n  <h2>Instructions</h2>\n\n  <ul>\n\n    <li>On pressing the \'Start Test\' button the test will start immediately.</li>\n\n    <li>If you have never carried out a test before then the app will first show you this safety and instructions dialogue. On closing\n\n    the dialogue, simply click \'Start Test\' again to begin.</li>\n\n    <li>The app will calculate your distance by tracking your GPS location so please carry out the test in a clear, open and traffic free environment with your location services\n\n      turned on, high accuracy enabled, and please ensure the app has location permissions.</li>\n\n    <li>You should walk for the duration of the 6 minutes, taking any breaks as required. A result will only be recorded if you complete the full\n\n      6 minutes without stopping the test.</li>\n\n    <li>The test can be stopped at any time by clicking the \'Stop Test\' button, followed by the \'Confirm\' button in the corresponding popup.</li>\n\n    <li>The timer will continue to countdown until you click the \'Confirm\' button on the aforementioned popup.</li>\n\n    <li>On completion of a full 6 minutes, you will be shown your results along side some comparisons of your previous results and how your latest result\n\n      compares with people of a similar age.</li>\n\n    <li>You can view all your previous results at any time in the \'Log\' section of the app.</li>\n\n  </ul>\n\n  <hr/>\n\n  <button ion-button block (click)="dismiss()">OK, I understand</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\safety\safety.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */]])
    ], SafetyPage);
    return SafetyPage;
}());

//# sourceMappingURL=safety.js.map

/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__profile_modal_profile_modal__ = __webpack_require__(398);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, navParams, auth, appCtrl, http, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.auth = auth;
        this.appCtrl = appCtrl;
        this.http = http;
        this.modalCtrl = modalCtrl;
        this.holder = 'profile page';
        this.cmArray = [];
        this.ftArray = [];
        this.inArray = [];
        this.kgArray = [];
        this.stArray = [];
        this.lbsArray = [];
        this.saveComplete = true;
        this.currentUser = auth.getUserInfo();
        this.convertCmToFt(this.currentUser.height);
        this.convertKgToStone(this.currentUser.weight);
        this.inArray = Array.from(Array(12).keys());
        this.lbsArray = Array.from(Array(14).keys());
        for (var i = 0; i < 299; i++) {
            this.kgArray.push(i);
        }
        for (var i = 0; i < 47; i++) {
            this.stArray.push(i);
        }
        for (var i = 91; i < 242; i++) {
            this.cmArray.push(i);
        }
        for (var i = 3; i < 8; i++) {
            this.ftArray.push(i);
        }
    }
    ProfilePage.prototype.convertCmToFt = function (cm) {
        var inches = +((cm * 0.39370).toFixed(0));
        var feet = Math.floor(inches / 12);
        inches %= 12;
        this.currentUserFt = feet;
        this.currentUserIn = inches;
    };
    ProfilePage.prototype.convertFtToCm = function (ft, inch) {
        var inches = +(ft) * 12;
        var totalInches = inches + +(inch);
        this.currentUser.height = Math.floor(totalInches / 0.39370);
    };
    ProfilePage.prototype.convertKgToStone = function (kg) {
        var lbs = +((kg * 2.20462).toFixed(0));
        var stone = Math.floor(lbs / 14);
        lbs %= 14;
        this.currentUserSt = stone;
        this.currentUserLbs = lbs;
    };
    ProfilePage.prototype.convertStoneToKg = function (st, lbs) {
        var lb = +(st) * 14;
        var totalLbs = lb + +(lbs);
        this.currentUser.weight = Math.floor(totalLbs / 2.20462);
    };
    ProfilePage.prototype.saveChangedValue = function (dataToSet, fieldToUpdate) {
        var _this = this;
        this.saveComplete = false;
        if (fieldToUpdate === 'dob') {
            dataToSet = __WEBPACK_IMPORTED_MODULE_5_moment__["utc"](dataToSet).format("YYYY-MM-DD");
        }
        this.http.post('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/update-profile', { updated_data: dataToSet, field_to_update: fieldToUpdate, email: this.currentUser.email }).map(function (res) { return res.json(); }).subscribe(function (data) {
            if (data.code === 200) {
                _this.saveComplete = true;
            }
        });
    };
    ProfilePage.prototype.showInputModal = function (data, type, currentVal) {
        var _this = this;
        var inputModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__profile_modal_profile_modal__["a" /* ProfileModalPage */], { numbers: data, type: type, currentVal: currentVal });
        inputModal.onDidDismiss(function (data) {
            var selectedVal = data.selectedVal;
            var type = data.type;
            if (type === 'Kgs') {
                _this.handleKgInput(selectedVal);
            }
            else if (type === 'Stone') {
                _this.handleStInput(selectedVal);
            }
            else if (type === 'Lbs') {
                _this.handleLbsInput(selectedVal);
            }
            else if (type === 'Cm') {
                _this.handleCmInput(selectedVal);
            }
            else if (type === 'Ft') {
                _this.handleFtInput(selectedVal);
            }
            else if (type === 'Inches') {
                _this.handleInInput(selectedVal);
            }
        });
        inputModal.present();
    };
    ProfilePage.prototype.handleKgInput = function (value) {
        this.currentUser.weight = value;
        this.convertKgToStone(this.currentUser.weight);
        this.saveChangedValue(this.currentUser.weight, 'weight');
    };
    ProfilePage.prototype.handleStInput = function (value) {
        this.currentUserSt = value;
        this.convertStoneToKg(this.currentUserSt, this.currentUserLbs);
        this.saveChangedValue(this.currentUser.weight, 'weight');
    };
    ProfilePage.prototype.handleLbsInput = function (value) {
        this.currentUserLbs = value;
        this.convertStoneToKg(this.currentUserSt, this.currentUserLbs);
        this.saveChangedValue(this.currentUser.weight, 'weight');
    };
    ProfilePage.prototype.handleCmInput = function (value) {
        this.currentUser.height = value;
        this.convertCmToFt(this.currentUser.height);
        this.saveChangedValue(this.currentUser.height, 'height');
    };
    ProfilePage.prototype.handleFtInput = function (value) {
        this.currentUserFt = value;
        this.convertFtToCm(this.currentUserFt, this.currentUserIn);
        this.saveChangedValue(this.currentUser.height, 'height');
    };
    ProfilePage.prototype.handleInInput = function (value) {
        this.currentUserIn = value;
        this.convertFtToCm(this.currentUserFt, this.currentUserIn);
        this.saveChangedValue(this.currentUser.height, 'height');
    };
    ProfilePage.prototype.logout = function () {
        var _this = this;
        this.auth.logout().subscribe(function () {
            _this.appCtrl.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
        });
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-profile',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\profile\profile.html"*/'<!--\n\n  Generated template for the ProfilePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <img src="assets/imgs/header.png" height="44" style="padding-left:2%"/>\n\n    <ion-buttons end>\n\n      <ion-label stacked>Logout</ion-label>\n\n      <button ion-button icon-only (click)="logout()"><ion-icon name="log-out"></ion-icon></button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-spinner *ngIf="!saveComplete" float-right></ion-spinner>\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item>\n\n          <ion-label stacked>Forename:</ion-label>\n\n          <ion-input type="text" [(ngModel)]="currentUser.forename" name="forename" (ionChange)="saveChangedValue(currentUser.forename, \'forename\');"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item>\n\n          <ion-label stacked>Surname:</ion-label>\n\n          <ion-input type="text" [(ngModel)]="currentUser.surname" name="surname" (ionChange)="saveChangedValue(currentUser.surname, \'surname\');"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item>\n\n          <ion-label stacked>DOB:</ion-label>\n\n          <ion-datetime displayFormat="DD/MM/YYYY"  [(ngModel)]="currentUser.dob" (ionChange)="saveChangedValue(currentUser.dob, \'dob\')"></ion-datetime>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item no-lines>\n\n          <ion-label fixed>Height:</ion-label>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col col-4 *ngIf="currentUser.height_unit == \'F\'">\n\n        <ion-item>\n\n          <ion-label stacked>ft</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUserFt" (focus)="showInputModal(ftArray, \'Ft\', currentUserFt)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-4 *ngIf="currentUser.height_unit == \'F\'">\n\n        <ion-item>\n\n          <ion-label stacked>in</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUserIn" (focus)="showInputModal(inArray, \'Inches\', currentUserIn)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n\n\n      <ion-col col-8 *ngIf="currentUser.height_unit == \'C\'">\n\n        <ion-item>\n\n          <ion-label stacked>cm</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUser.height" (focus)="showInputModal(cmArray, \'Cm\', currentUser.height)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n\n\n      <ion-col col-4>\n\n        <ion-item>\n\n          <ion-label stacked>Units:</ion-label>\n\n          <ion-select [(ngModel)]="currentUser.height_unit" interface="action-sheet" (ionChange)="saveChangedValue(currentUser.height_unit, \'height_unit\');">\n\n            <ion-option value="F">Feet</ion-option>\n\n            <ion-option value="C">Cm</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item no-lines>\n\n          <ion-label fixed>Weight:</ion-label>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col col-4 *ngIf="currentUser.weight_unit == \'S\'">\n\n        <ion-item>\n\n          <ion-label stacked>st</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUserSt" (focus)="showInputModal(stArray, \'Stone\', currentUserSt)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n\n\n      <ion-col col-4 *ngIf="currentUser.weight_unit == \'S\'">\n\n        <ion-item>\n\n          <ion-label stacked>lbs</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUserLbs" (focus)="showInputModal(lbsArray, \'Lbs\', currentUserLbs)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n\n\n      <ion-col col-8 *ngIf="currentUser.weight_unit == \'K\'">\n\n        <ion-item>\n\n          <ion-label stacked>Kgs</ion-label>\n\n          <ion-input type="text" readonly [(ngModel)]="currentUser.weight" (focus)="showInputModal(kgArray, \'Kgs\', currentUser.weight)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n\n\n      <ion-col col-4>\n\n        <ion-item>\n\n          <ion-label stacked>Units:</ion-label>\n\n          <ion-select [(ngModel)]="currentUser.weight_unit" interface="action-sheet" (ionChange)="saveChangedValue(currentUser.weight_unit, \'weight_unit\');">\n\n            <ion-option value="S">Stone</ion-option>\n\n            <ion-option value="K">Kg</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col>\n\n        <ion-item>\n\n          <ion-label stacked>Gender:</ion-label>\n\n          <ion-select [(ngModel)]="currentUser.gender" interface="action-sheet" (ionChange)="saveChangedValue(currentUser.gender, \'gender\');">\n\n            <ion-option value="F">Female</ion-option>\n\n            <ion-option value="M">Male</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\profile\profile.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileModalPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the ProfileModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProfileModalPage = /** @class */ (function () {
    function ProfileModalPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.numbers = [];
        this.pickedNumber = 0;
        this.numbers = this.params.get('numbers');
        this.type = this.params.get('type');
        this.pickedNumber = this.params.get('currentVal');
    }
    ProfileModalPage.prototype.dismiss = function (selected) {
        var data = { selectedVal: selected, type: this.type };
        this.viewCtrl.dismiss(data);
    };
    ProfileModalPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-profile-modal',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\profile-modal\profile-modal.html"*/'<!--\n\n  Generated template for the ProfileModalPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-content class="profile-modal">\n\n  <ion-item no-lines>\n\n    <h1 ion-text style="font-size:large">{{type}}</h1>\n\n    <ion-icon name="close" item-right small (click)="dismiss(pickedNumber)"></ion-icon>\n\n  </ion-item>\n\n  <hr/>\n\n  <ion-list radio-group [virtualScroll]="numbers" [(ngModel)]="pickedNumber" approxItemHeight="20px">\n\n    <ion-item *virtualItem="let number" no-lines>\n\n      <ion-label>{{number}}</ion-label>\n\n      <ion-radio item-left [value]="number" (ionSelect)="dismiss(pickedNumber)"></ion-radio>\n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\profile-modal\profile-modal.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], ProfileModalPage);
    return ProfileModalPage;
}());

//# sourceMappingURL=profile-modal.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(405);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_geolocation__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_safety_safety__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_results_results__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_walk_test_walk_test__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_profile_profile__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_date_picker__ = __webpack_require__(717);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_login_login__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_register_register__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_reset_reset__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pipes_timer_timer__ = __webpack_require__(718);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_previous_result_previous_result__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_tabs_tabs__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_native_geocoder__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_location_accuracy__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_diagnostic__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_profile_modal_profile_modal__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_background_mode__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_local_notifications__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_network__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__providers_geocoder_geocoder__ = __webpack_require__(719);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_safety_safety__["a" /* SafetyPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_results_results__["a" /* ResultsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_walk_test_walk_test__["a" /* WalkTestPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_reset_reset__["a" /* ResetPage */],
                __WEBPACK_IMPORTED_MODULE_17__pipes_timer_timer__["a" /* TimerPipe */],
                __WEBPACK_IMPORTED_MODULE_18__pages_previous_result_previous_result__["a" /* PreviousResultPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_profile_modal_profile_modal__["a" /* ProfileModalPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            exports: [__WEBPACK_IMPORTED_MODULE_17__pipes_timer_timer__["a" /* TimerPipe */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_safety_safety__["a" /* SafetyPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_results_results__["a" /* ResultsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_walk_test_walk_test__["a" /* WalkTestPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_reset_reset__["a" /* ResetPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_previous_result_previous_result__["a" /* PreviousResultPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_profile_modal_profile_modal__["a" /* ProfileModalPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_date_picker__["a" /* DatePicker */],
                __WEBPACK_IMPORTED_MODULE_24__ionic_native_background_mode__["a" /* BackgroundMode */],
                __WEBPACK_IMPORTED_MODULE_25__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_geolocation__["a" /* Geolocation */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_0__providers_auth_service_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_native_geocoder__["a" /* NativeGeocoder */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
                __WEBPACK_IMPORTED_MODULE_26__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_27__providers_geocoder_geocoder__["a" /* GeocoderProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 442:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_network__ = __webpack_require__(399);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, network, toast) {
        var _this = this;
        this.toast = toast;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            // watch network for a disconnect
            network.onDisconnect().subscribe(function () {
                _this.showNoNetworkToast();
            });
            network.onConnect().subscribe(function () {
                _this.showNetworkEstablishedToast();
            });
        });
    }
    MyApp.prototype.showNoNetworkToast = function () {
        this.networkToast ? this.networkToast.dismiss() : false;
        this.networkToast = this.toast.create({
            message: "No Internet connection. Some data may be lost.",
            position: 'bottom'
        });
        this.networkToast.present();
    };
    MyApp.prototype.showNetworkEstablishedToast = function () {
        this.networkToast ? this.networkToast.dismiss() : false;
        this.networkToast = this.toast.create({
            message: "Connection re-established.",
            duration: 2000,
            position: 'bottom'
        });
        this.networkToast.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\app\app.html"*/'<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 450:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 236,
	"./af.js": 236,
	"./ar": 237,
	"./ar-dz": 238,
	"./ar-dz.js": 238,
	"./ar-kw": 239,
	"./ar-kw.js": 239,
	"./ar-ly": 240,
	"./ar-ly.js": 240,
	"./ar-ma": 241,
	"./ar-ma.js": 241,
	"./ar-sa": 242,
	"./ar-sa.js": 242,
	"./ar-tn": 243,
	"./ar-tn.js": 243,
	"./ar.js": 237,
	"./az": 244,
	"./az.js": 244,
	"./be": 245,
	"./be.js": 245,
	"./bg": 246,
	"./bg.js": 246,
	"./bm": 247,
	"./bm.js": 247,
	"./bn": 248,
	"./bn.js": 248,
	"./bo": 249,
	"./bo.js": 249,
	"./br": 250,
	"./br.js": 250,
	"./bs": 251,
	"./bs.js": 251,
	"./ca": 252,
	"./ca.js": 252,
	"./cs": 253,
	"./cs.js": 253,
	"./cv": 254,
	"./cv.js": 254,
	"./cy": 255,
	"./cy.js": 255,
	"./da": 256,
	"./da.js": 256,
	"./de": 257,
	"./de-at": 258,
	"./de-at.js": 258,
	"./de-ch": 259,
	"./de-ch.js": 259,
	"./de.js": 257,
	"./dv": 260,
	"./dv.js": 260,
	"./el": 261,
	"./el.js": 261,
	"./en-SG": 262,
	"./en-SG.js": 262,
	"./en-au": 263,
	"./en-au.js": 263,
	"./en-ca": 264,
	"./en-ca.js": 264,
	"./en-gb": 265,
	"./en-gb.js": 265,
	"./en-ie": 266,
	"./en-ie.js": 266,
	"./en-il": 267,
	"./en-il.js": 267,
	"./en-nz": 268,
	"./en-nz.js": 268,
	"./eo": 269,
	"./eo.js": 269,
	"./es": 270,
	"./es-do": 271,
	"./es-do.js": 271,
	"./es-us": 272,
	"./es-us.js": 272,
	"./es.js": 270,
	"./et": 273,
	"./et.js": 273,
	"./eu": 274,
	"./eu.js": 274,
	"./fa": 275,
	"./fa.js": 275,
	"./fi": 276,
	"./fi.js": 276,
	"./fo": 277,
	"./fo.js": 277,
	"./fr": 278,
	"./fr-ca": 279,
	"./fr-ca.js": 279,
	"./fr-ch": 280,
	"./fr-ch.js": 280,
	"./fr.js": 278,
	"./fy": 281,
	"./fy.js": 281,
	"./ga": 282,
	"./ga.js": 282,
	"./gd": 283,
	"./gd.js": 283,
	"./gl": 284,
	"./gl.js": 284,
	"./gom-latn": 285,
	"./gom-latn.js": 285,
	"./gu": 286,
	"./gu.js": 286,
	"./he": 287,
	"./he.js": 287,
	"./hi": 288,
	"./hi.js": 288,
	"./hr": 289,
	"./hr.js": 289,
	"./hu": 290,
	"./hu.js": 290,
	"./hy-am": 291,
	"./hy-am.js": 291,
	"./id": 292,
	"./id.js": 292,
	"./is": 293,
	"./is.js": 293,
	"./it": 294,
	"./it-ch": 295,
	"./it-ch.js": 295,
	"./it.js": 294,
	"./ja": 296,
	"./ja.js": 296,
	"./jv": 297,
	"./jv.js": 297,
	"./ka": 298,
	"./ka.js": 298,
	"./kk": 299,
	"./kk.js": 299,
	"./km": 300,
	"./km.js": 300,
	"./kn": 301,
	"./kn.js": 301,
	"./ko": 302,
	"./ko.js": 302,
	"./ku": 303,
	"./ku.js": 303,
	"./ky": 304,
	"./ky.js": 304,
	"./lb": 305,
	"./lb.js": 305,
	"./lo": 306,
	"./lo.js": 306,
	"./lt": 307,
	"./lt.js": 307,
	"./lv": 308,
	"./lv.js": 308,
	"./me": 309,
	"./me.js": 309,
	"./mi": 310,
	"./mi.js": 310,
	"./mk": 311,
	"./mk.js": 311,
	"./ml": 312,
	"./ml.js": 312,
	"./mn": 313,
	"./mn.js": 313,
	"./mr": 314,
	"./mr.js": 314,
	"./ms": 315,
	"./ms-my": 316,
	"./ms-my.js": 316,
	"./ms.js": 315,
	"./mt": 317,
	"./mt.js": 317,
	"./my": 318,
	"./my.js": 318,
	"./nb": 319,
	"./nb.js": 319,
	"./ne": 320,
	"./ne.js": 320,
	"./nl": 321,
	"./nl-be": 322,
	"./nl-be.js": 322,
	"./nl.js": 321,
	"./nn": 323,
	"./nn.js": 323,
	"./pa-in": 324,
	"./pa-in.js": 324,
	"./pl": 325,
	"./pl.js": 325,
	"./pt": 326,
	"./pt-br": 327,
	"./pt-br.js": 327,
	"./pt.js": 326,
	"./ro": 328,
	"./ro.js": 328,
	"./ru": 329,
	"./ru.js": 329,
	"./sd": 330,
	"./sd.js": 330,
	"./se": 331,
	"./se.js": 331,
	"./si": 332,
	"./si.js": 332,
	"./sk": 333,
	"./sk.js": 333,
	"./sl": 334,
	"./sl.js": 334,
	"./sq": 335,
	"./sq.js": 335,
	"./sr": 336,
	"./sr-cyrl": 337,
	"./sr-cyrl.js": 337,
	"./sr.js": 336,
	"./ss": 338,
	"./ss.js": 338,
	"./sv": 339,
	"./sv.js": 339,
	"./sw": 340,
	"./sw.js": 340,
	"./ta": 341,
	"./ta.js": 341,
	"./te": 342,
	"./te.js": 342,
	"./tet": 343,
	"./tet.js": 343,
	"./tg": 344,
	"./tg.js": 344,
	"./th": 345,
	"./th.js": 345,
	"./tl-ph": 346,
	"./tl-ph.js": 346,
	"./tlh": 347,
	"./tlh.js": 347,
	"./tr": 348,
	"./tr.js": 348,
	"./tzl": 349,
	"./tzl.js": 349,
	"./tzm": 350,
	"./tzm-latn": 351,
	"./tzm-latn.js": 351,
	"./tzm.js": 350,
	"./ug-cn": 352,
	"./ug-cn.js": 352,
	"./uk": 353,
	"./uk.js": 353,
	"./ur": 354,
	"./ur.js": 354,
	"./uz": 355,
	"./uz-latn": 356,
	"./uz-latn.js": 356,
	"./uz.js": 355,
	"./vi": 357,
	"./vi.js": 357,
	"./x-pseudo": 358,
	"./x-pseudo.js": 358,
	"./yo": 359,
	"./yo.js": 359,
	"./zh-cn": 360,
	"./zh-cn.js": 360,
	"./zh-hk": 361,
	"./zh-hk.js": 361,
	"./zh-tw": 362,
	"./zh-tw.js": 362
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 450;

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_register__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reset_reset__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tabs_tabs__ = __webpack_require__(364);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, http, menu, auth, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.menu = menu;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.loginCredentials = { email: '', password: '' };
        this.mylog("constructor");
        this.menu.enable(false, 'sideMenu');
    }
    LoginPage_1 = LoginPage;
    LoginPage.prototype.mylog = function (s) {
        console.log("   >>>>>  LoginPage: " + s + "  <<<<<   "); //comment out to turn off debug logging
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.mylog("ionViewDidLoad");
        if (localStorage.getItem("token")) {
            this.showLoading();
            this.auth.checkLoggedIn({ email: localStorage.getItem("email"), token: localStorage.getItem("token") }).subscribe(function (allowed) {
                if (allowed) {
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__tabs_tabs__["a" /* TabsPage */]);
                }
                else {
                    _this.showError("Login expired. Please login again.");
                    _this.navCtrl.setRoot(LoginPage_1);
                }
            }, function () {
                _this.showError("We had a problem logging you in.\nPlease try again.");
            });
        }
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.mylog("login");
        this.showLoading();
        this.auth.login(this.loginCredentials).subscribe(function (allowed) {
            if (allowed) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__tabs_tabs__["a" /* TabsPage */]);
                _this.menu.enable(true, 'sideMenu');
            }
            else {
                _this.showError(_this.auth.getMessage());
                _this.loginCredentials.email = '';
                _this.loginCredentials.password = '';
            }
        }, function (error) {
            _this.showError(error);
        });
    };
    LoginPage.prototype.createAccount = function () {
        this.mylog("createAccount");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__register_register__["a" /* RegisterPage */]);
    };
    LoginPage.prototype.resetPassword = function () {
        this.mylog("resetPassword");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__reset_reset__["a" /* ResetPage */]);
    };
    LoginPage.prototype.showLoading = function () {
        this.mylog("showLoading");
        this.loading = this.loadingCtrl.create({
            content: 'Logging you in...',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    LoginPage.prototype.showError = function (text) {
        this.mylog("showError");
        this.loading.dismiss();
        var alert = this.alertCtrl.create({
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    var LoginPage_1;
    LoginPage = LoginPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\login\login.html"*/'<!--\n\n  Generated template for the LoginPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n\n\n<ion-content class="login-content" padding>\n\n  <ion-row class="logo-row">\n\n    <ion-col></ion-col>\n\n    <ion-col width-67>\n\n      <img src="assets/imgs/icon.png"/>\n\n    </ion-col>\n\n    <ion-col></ion-col>\n\n  </ion-row>\n\n  <div class="login-box">\n\n    <form (ngSubmit)="login()" #loginForm="ngForm">\n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n            <ion-item>\n\n              <ion-label stacked>Email</ion-label>\n\n              <ion-input type="email" name="email" [(ngModel)]="loginCredentials.email" required></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Password</ion-label>\n\n              <ion-input type="password" name="password" [(ngModel)]="loginCredentials.password" required></ion-input>\n\n            </ion-item>\n\n          </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col class="signup-col">\n\n          <button ion-button class="submit-btn" full [disabled]="!loginForm.form.valid">Login</button>\n\n          <button ion-button class="register-btn"  block clear (click)="createAccount()" type="button">Create New Account</button>\n\n          <button ion-button class="reset-btn"  block clear (click)="resetPassword()" type="button">Forgot password?</button>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n    </form>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Mark2\Documents\Development\6MW\FrontEndApplication\src\pages\login\login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 718:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimerPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Generated class for the TimerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var TimerPipe = /** @class */ (function () {
    function TimerPipe() {
    }
    TimerPipe.prototype.transform = function (value) {
        if (value === null) {
            value = 360;
        }
        var minutes = (Math.floor(value / 60));
        return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    };
    TimerPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'timer',
        })
    ], TimerPipe);
    return TimerPipe;
}());

//# sourceMappingURL=timer.js.map

/***/ }),

/***/ 719:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeocoderProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/*
  Generated class for the GeocoderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var GeocoderProvider = /** @class */ (function () {
    function GeocoderProvider(http) {
        this.http = http;
        console.log('Hello GeocoderProvider Provider');
    }
    GeocoderProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], GeocoderProvider);
    return GeocoderProvider;
}());

//# sourceMappingURL=geocoder.js.map

/***/ })

},[400]);
//# sourceMappingURL=main.js.map