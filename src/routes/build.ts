/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/angular2';

import {ShopComponent} from 'app/shop'
import {AbilitiesComponent} from 'app/abilities'

@Component({
  selector: 'build'
})
@View({
  templateUrl: '/html/routes/build.html',
  directives: [ShopComponent, AbilitiesComponent]
})

export class BuildComponent {
  constructor() {
  }
}