import {Component, ViewEncapsulation} from 'angular2/core';

import {ShopComponent} from '../build/shop.component';
import {ChampionComponent} from '../build/champion.component';

@Component({
  selector: 'build',
  directives: [ShopComponent, ChampionComponent],
  styleUrls: [
    './assets/css/build.css'
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <champion></champion>
    <shop></shop>`
})

export class BuildRoute { }
