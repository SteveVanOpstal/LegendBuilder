/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {RegionRoute} from 'app/region.route'
import {ChooseRoute} from 'app/choose.route';
import {BuildRoute} from 'app/build.route';

@Component({
  selector: 'app'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: RegionRoute, as: 'Region'},
  { path: '/:region/', component: ChooseRoute, as: 'Choose'},
  { path: '/:region/:champion', component: BuildRoute, as: 'Build' }
])

export class AppComponent {}