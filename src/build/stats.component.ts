/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, Input} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {LineGraphComponent} from 'app/line-graph.directive';

@Component({
  selector: 'stats'
})
@View({
  templateUrl: '/html/build/stats.component.html',
  directives: [LineGraphComponent]  
})

export class StatsComponent {
  @Input() private champion: any;
  
  constructor() {
    this.champion = { image: {full: null}, spells: null, name:null };
  }
}