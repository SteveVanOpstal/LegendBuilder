import {RouterConfig, provideRouter} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champions/champions.component';
import {FeaturesComponent} from './features/features.component';
import {RegionsComponent} from './region/region.component';

export const routes: RouterConfig = [
  {path: ':region/:champion/summoner/:summoner', component: BuildComponent}, {path: ':region/:champion/build', component: BuildComponent}, {path: ':region/:champion', component: FeaturesComponent},
  {path: ':region', component: ChampionsComponent}, {path: '', component: RegionsComponent}
];

export const APP_ROUTER_PROVIDERS = [provideRouter(routes)];
