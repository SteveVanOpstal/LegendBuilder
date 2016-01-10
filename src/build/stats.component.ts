/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {LineGraphComponent} from 'app/line-graph.component';

@Component({
  selector: 'stats',
  templateUrl: '/html/build/stats.component.html',
  directives: [LineGraphComponent]  
})

export class StatsComponent {
  @Input() private champion: any;
}