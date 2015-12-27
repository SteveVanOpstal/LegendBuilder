/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/core';

import {ShopComponent} from 'app/shop.component'
import {ChampionComponent} from 'app/champion.component'

@Component({
  selector: 'build'
})
@View({
  templateUrl: '/html/routes/build.route.html',
  directives: [ShopComponent, ChampionComponent]
})

export class BuildRoute {}