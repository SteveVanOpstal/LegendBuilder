/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, NgFor, EventEmitter} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

export enum Regions
{
  br,
  eune,
  euw,
  kr,
  lan,
  las,
  na,
  oce,
  pbe,
  ru,
  tr
}

@Component({
  selector: 'region'
})
@View({
  templateUrl: '/html/routes/region.html',
  directives: [NgFor, RouterLink]
})

export class RegionComponent {  
}