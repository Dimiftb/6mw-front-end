import { Component } from '@angular/core';

import {WalkTestPage} from "../walk-test/walk-test";
import {ResultsPage} from "../results/results";
import {ProfilePage} from "../profile/profile";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = WalkTestPage;
  logRoot = ResultsPage;
  profileRoot = ProfilePage;

  constructor() {

  }

}
