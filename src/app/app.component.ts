import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {RegionRoute} from './routes/region.component';
import {ChooseRoute} from './routes/choose.component';
import {BuildRoute} from './routes/build.component';

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