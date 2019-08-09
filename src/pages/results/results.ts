import { Component, ViewChild } from '@angular/core';
import {App, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import { Chart } from 'chart.js';
import {Http} from "@angular/http";
import {AuthService} from "../../providers/auth-service/auth-service";
import {PreviousResultPage} from "../previous-result/previous-result";
import {LoginPage} from "../login/login";

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  holder: string = 'results page';
  @ViewChild('resultsGraph') resultsGraph;

  resultsChart: any;
  userId: number;
  previousResults: any = [];
  bestDistance: number;
  worstDistance: number;

  hasPreviousResults = false;

  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public auth: AuthService,private loadingCtrl: LoadingController, public appCtrl: App) {
    let info = this.auth.getUserInfo();
    this.userId = info.user_id;
  }

  ionViewDidEnter() {
    this.showLoading();
    this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/previous-results?userId=' + this.userId.toString())
      .map(res => res.json()).subscribe(data => {

      this.hasPreviousResults = data.code !== 204;

      if (this.hasPreviousResults) {
        let distances = [];
        data.forEach(function (item) {
          distances.push(item.distance);
        });

        this.previousResults = data;

        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/last-ten-results?userId=' + this.userId.toString())
          .map(res => res.json()).subscribe(data => {
          let graphData = {graphLabels: [], graphContent: []};
          if (this.hasPreviousResults) {
            data.forEach(function (item) {
              graphData.graphLabels.push(item.formatDate);
              graphData.graphContent.push(item.distance);
            });
            this.initializeChart(graphData);
          }
        });

        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/max-distance?userId=' + this.userId.toString())
          .map(res => res.json()).subscribe(data => {
          this.bestDistance = data.distance;
        });


        this.http.get('https://devweb3000.cis.strath.ac.uk/xmb17105-nodejs/api/min-distance?userId=' + this.userId.toString())
          .map(res => res.json()).subscribe(data => {
          this.worstDistance = data.distance;
        });
      }
      this.loading.dismiss();
      this.loading = null;
    });
  }

  ionViewDidLoad() {

  }

  showPreviousResult(result) {
    result.userId = this.userId;
    this.navCtrl.push(PreviousResultPage, result);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching results...'
    });
    this.loading.present();
  }

    logout() {
        this.auth.logout().subscribe(() => {
            this.appCtrl.getRootNav().setRoot(LoginPage);
        });
  }

  initializeChart(graphData) {

    this.resultsChart = new Chart(this.resultsGraph.nativeElement, {
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
              callback: function(data) {
                return data.substr(0, 11);
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, d){
              return d.labels[tooltipItem[0].index].substr(0,11) +
                d.labels[tooltipItem[0].index].substr(11,9);
            }
          }
        }
      }

    });
  }

}
