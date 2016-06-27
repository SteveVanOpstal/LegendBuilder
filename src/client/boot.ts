/*
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

import {PLATFORM_DIRECTIVES, enableProdMode, provide} from '@angular/core';
import {HTTP_BINDINGS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_DIRECTIVES, provideRouter} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champions/champions.component';
import {FeaturesComponent} from './features/features.component';
import {RegionsComponent} from './region/region.component';

if (ENV === 'production') {
  enableProdMode();
}

import {AppComponent} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';

bootstrap(AppComponent, [
  HTTP_BINDINGS, APP_ROUTER_PROVIDERS,
  provide(PLATFORM_DIRECTIVES, {useValue: ROUTER_DIRECTIVES, multi: true})
]).catch(err => console.error(err));
