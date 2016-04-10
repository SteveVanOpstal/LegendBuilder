import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {RegionsComponent} from './routes/region.component';
import {ChampionsComponent} from './routes/champions.component';
import {FeaturesComponent} from './routes/features.component';
import {BuildComponent} from './routes/build.component';

@Component({
  selector: 'app',
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: RegionsComponent, as: 'Regions' },
  { path: '/:region', component: ChampionsComponent, as: 'Champions' },
  { path: '/:region/:champion', component: FeaturesComponent, as: 'Features' },
  { path: '/:region/:champion/build', component: BuildComponent, as: 'Build' },
  { path: '/:region/:champion/summoner/:summoner', component: BuildComponent, as: 'BuildSummoner' }
])

export class AppComponent { }
