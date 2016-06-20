import {Component} from '@angular/core';
import {HTTP_BINDINGS} from '@angular/http';
import {Router, Routes} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champions/champions.component';
import {FeaturesComponent} from './features/features.component';
import {RegionsComponent} from './region/region.component';

@Component({selector: 'app', template: '<router-outlet></router-outlet>'})

@Routes([
  {path: '/:region/:champion/summoner/:summoner', component: BuildComponent}, {path: '/:region/:champion/build', component: BuildComponent}, {path: '/:region/:champion', component: FeaturesComponent},
  {path: '/:region', component: ChampionsComponent}, {path: '/', component: RegionsComponent}
])

export class AppComponent {
  constructor(private router: Router) {}
}
