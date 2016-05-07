/**
  @license
  Copyright 2015-2016 Steve Van Opstal https://github.com/SteveVanOpstal

  Legend Builder - An advanced League Of Legends champion builder

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along
  with this program; if not, write to the Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

 */

import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_BINDINGS} from '@angular/http';
import {Router, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {Component, OnInit, enableProdMode, provide, PLATFORM_DIRECTIVES} from '@angular/core';

if (ENV === 'production') {
  enableProdMode();
}

import {RegionsComponent} from './routes/region.component';
import {ChampionsComponent} from './routes/champions.component';
import {FeaturesComponent} from './routes/features.component';
import {BuildComponent} from './routes/build.component';
import {Main} from './main';

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

export class AppComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    //this.router.navigate(['/']);
  }
}

bootstrap(AppComponent, [
  HTTP_BINDINGS,
  ROUTER_PROVIDERS,
  provide(PLATFORM_DIRECTIVES, { useValue: ROUTER_DIRECTIVES, multi: true })
]).catch((err) => {
  if (ENV !== 'production') {
    console.error(err);
  }
});
