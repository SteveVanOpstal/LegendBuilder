/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, EventEmitter} from 'angular2/core';
import {NgFor} from 'angular2/common';
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
  templateUrl: '/html/routes/region.route.html',
  directives: [NgFor, RouterLink]
})

export class RegionRoute {  
}