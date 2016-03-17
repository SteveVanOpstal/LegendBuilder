import {Component} from 'angular2/core';

import {ShopComponent} from '../build/shop.component'
import {ChampionComponent} from '../build/champion.component'

@Component({
  selector: 'build',
  directives: [ShopComponent, ChampionComponent],
  template: `
    <champion></champion>
    <shop></shop>`
})

export class BuildRoute { }