import { Component, ViewChild  } from '@angular/core';
import {Nav, Platform, Toast, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {Network} from "@ionic-native/network";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  networkToast: Toast;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, network: Network, public toast: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // watch network for a disconnect
      network.onDisconnect().subscribe(() => {
        this.showNoNetworkToast();
      });

      network.onConnect().subscribe(() => {
        this.showNetworkEstablishedToast();
      });
    });
  }

  showNoNetworkToast() {
    this.networkToast ? this.networkToast.dismiss() : false;
    this.networkToast = this.toast.create({
      message: `No Internet connection. Some data may be lost.`,
      position: 'bottom'
    });
    this.networkToast.present();
  }

  showNetworkEstablishedToast() {
    this.networkToast ? this.networkToast.dismiss() : false;
    this.networkToast = this.toast.create({
      message: `Connection re-established.`,
      duration: 2000,
      position: 'bottom'
    });
    this.networkToast.present();
  }



}
