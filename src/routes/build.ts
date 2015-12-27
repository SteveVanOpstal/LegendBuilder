/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/angular2';

import {ShopComponent} from 'app/shop'
import {ChampionComponent} from 'app/champion'

@Component({
  selector: 'build'
})
@View({
  templateUrl: '/html/routes/build.html',
  directives: [ShopComponent, ChampionComponent]
})

export class BuildComponent {
  constructor() {
  }
}