import { AuthService } from '../providers/auth-service/auth-service';
import {NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import {SafetyPage} from '../pages/safety/safety';
import {ResultsPage} from '../pages/results/results';
import {WalkTestPage} from '../pages/walk-test/walk-test';
import {ProfilePage} from '../pages/profile/profile';
import {DatePicker} from '@ionic-native/date-picker';
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {ResetPage} from "../pages/reset/reset";
import {TimerPipe} from "../pipes/timer/timer";
import {PreviousResultPage} from "../pages/previous-result/previous-result";
import {TabsPage} from "../pages/tabs/tabs";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {LocationAccuracy} from "@ionic-native/location-accuracy";
import {Diagnostic} from "@ionic-native/diagnostic";
import {ProfileModalPage} from "../pages/profile-modal/profile-modal";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {Network} from "@ionic-native/network";
import { GeocoderProvider } from '../providers/geocoder/geocoder';


@NgModule({
  declarations: [
    MyApp,
    SafetyPage,
    ResultsPage,
    WalkTestPage,
    ProfilePage,
    LoginPage,
    RegisterPage,
    ResetPage,
    TimerPipe,
    PreviousResultPage,
    TabsPage,
    ProfileModalPage


  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  exports: [TimerPipe],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SafetyPage,
    ResultsPage,
    WalkTestPage,
    ProfilePage,
    LoginPage,
    RegisterPage,
    ResetPage,
    PreviousResultPage,
    TabsPage,
    ProfileModalPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    BackgroundMode,
    LocalNotifications,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    NativeGeocoder,
    Diagnostic,
    LocationAccuracy,
    Network,
    GeocoderProvider

  ]
})
export class AppModule {}
