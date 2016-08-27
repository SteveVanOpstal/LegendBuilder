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

import {enableProdMode, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champions/champions.component';
import {FeaturesComponent} from './features/features.component';
import {RegionsComponent} from './region/region.component';

if (ENV === 'production') {
  enableProdMode();
}

@NgModule({
  declarations:
      [AppComponent, BuildComponent, ChampionsComponent, FeaturesComponent, RegionsComponent],
  imports: [BrowserModule, RouterModule.forRoot(ROUTES), HttpModule],
  bootstrap: [AppComponent]
})
class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
