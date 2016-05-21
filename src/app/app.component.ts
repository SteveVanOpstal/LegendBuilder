import {HTTP_BINDINGS} from '@angular/http';
import {Router, Routes} from '@angular/router';
import {Component} from '@angular/core';

import {RegionsComponent} from './routes/region.component';
import {ChampionsComponent} from './routes/champions.component';
import {FeaturesComponent} from './routes/features.component';
import {BuildComponent} from './routes/build.component';

@Component({
  selector: 'app',
  template: '<router-outlet></router-outlet>'
})

@Routes([
  { path: '/:region/:champion/summoner/:summoner', component: BuildComponent },
  { path: '/:region/:champion/build', component: BuildComponent },
  { path: '/:region/:champion', component: FeaturesComponent },
  { path: '/:region', component: ChampionsComponent },
  { path: '/', component: RegionsComponent }
])

export class AppComponent {
  constructor(private router: Router) { }
}
