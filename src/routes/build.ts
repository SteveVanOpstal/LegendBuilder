/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/angular2';

@Component({
  selector: 'build'
})
@View({
  templateUrl: '/html/routes/build.html'
})

export class BuildComponent {
  constructor() {
  }
}