/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';

import {ShopComponent} from 'app/shop.component'
import {ChampionComponent} from 'app/champion.component'

@Component({
  selector: 'build',
  template: `
    <champion></champion>
    <shop></shop>`,
  directives: [ShopComponent, ChampionComponent]
})

export class BuildRoute {}