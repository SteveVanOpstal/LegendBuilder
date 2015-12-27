/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, Input} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {tim} from 'tinytim/lib/tinytim';

import {ErrorComponent} from 'app/error.component';
import {DDragonImageComponent} from 'app/ddragonImage.component';

@Component({
  selector: 'stats'
})
@View({
  templateUrl: '/html/build/stats.component.html'
})

export class StatsComponent {
  @Input() private champion: any;
  
  constructor() {
    this.champion = { image: {full: null}, spells: null, name:null };
  }
    
    
}