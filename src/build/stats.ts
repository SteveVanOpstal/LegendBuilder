/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, NgFor, Input} from 'angular2/angular2';

import {tim} from 'tinytim/lib/tinytim';

import {ErrorComponent} from 'app/error';
import {DDragonImageComponent} from 'app/ddragonImage';

@Component({
  selector: 'stats'
})
@View({
  templateUrl: '/html/build/stats.html'
})

export class StatsComponent {
  @Input() private champion: any;
  
  constructor() {
    this.champion = { image: {full: null}, spells: null, name:null };
  }
    
    
}