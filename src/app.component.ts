/// <reference path="typings/angular2/angular2.d.ts" />

import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {RegionRoute} from 'app/region.component'
import {ChooseRoute} from 'app/choose.component';
import {BuildRoute} from 'app/build.component';

@Component({
  selector: 'app',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: RegionRoute, as: 'Region' },
  { path: '/:region/', component: ChooseRoute, as: 'Choose' },
  { path: '/:region/:champion', component: BuildRoute, as: 'Build' }
])

export class AppComponent { }