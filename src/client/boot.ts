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

import {CommonModule} from '@angular/common';
import {enableProdMode, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {RouterModule} from '@angular/router';

import {ActionsComponent} from './actions.component';
import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {IconErrorComponent} from './assets/icon-error.component';
import {IconEyeComponent} from './assets/icon-eye.component';
import {IconLoadComponent} from './assets/icon-load.component';
import {IconRankComponent} from './assets/icon-rank.component';
import {IconRefreshComponent} from './assets/icon-refresh.component';
import {BuildComponent} from './build/build.component';
import {AbilitySequenceComponent} from './build/graph/ability-sequence.component';
import {GraphComponent} from './build/graph/graph.component';
import {LegendComponent} from './build/graph/legend.component';
import {ItemSlotComponent} from './build/items/item-slot.component';
import {ItemComponent} from './build/items/item.component';
import {ItemsComponent} from './build/items/items.component';
import {MasteriesComponent} from './build/masteries/masteries.component';
import {MasteryCategoryComponent} from './build/masteries/mastery-category.component';
import {MasteryTierComponent} from './build/masteries/mastery-tier.component';
import {MasteryComponent} from './build/masteries/mastery.component';
import {ChampionPipe} from './build/shop/pipes/champion.pipe';
import {HidePipe} from './build/shop/pipes/hide.pipe';
import {MapPipe} from './build/shop/pipes/map.pipe';
import {TranslatePipe} from './build/shop/pipes/translate.pipe';
import {ItemsFromComponent} from './build/shop/preview/items-from.component';
import {PreviewComponent} from './build/shop/preview/preview.component';
import {ShopComponent} from './build/shop/shop.component';
import {BarComponent} from './champion/bar/bar.component';
import {ChampionComponent} from './champion/champion.component';
import {FiltersComponent} from './champion/filters/filters.component';
import {NamePipe} from './champion/pipes/name.pipe';
import {SortPipe} from './champion/pipes/sort.pipe';
import {TagsPipe} from './champion/pipes/tags.pipe';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {CapitalizePipe} from './misc/capitalize.pipe';
import {DDragonDirective} from './misc/ddragon.directive';
import {ErrorComponent} from './misc/error.component';
import {LoadingComponent} from './misc/loading.component';
import {RetryComponent} from './misc/retry.component';
import {ToIterablePipe} from './misc/to-iterable.pipe';
import {RegionComponent} from './region/region.component';
import {SignupComponent} from './signup/signup.component';
import {SummonerComponent} from './summoner/summoner.component';

if (ENV === 'production') {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    ActionsComponent,
    BuildComponent,
    ChampionComponent,
    RegionComponent,
    SummonerComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    DDragonDirective,
    GraphComponent,
    MasteriesComponent,
    ItemsComponent,
    ShopComponent,
    LoadingComponent,
    RetryComponent,
    FiltersComponent,
    TagsPipe,
    SortPipe,
    NamePipe,
    CapitalizePipe,
    ToIterablePipe,
    BarComponent,
    ErrorComponent,
    LegendComponent,
    AbilitySequenceComponent,
    MasteryCategoryComponent,
    MasteryTierComponent,
    ItemComponent,
    MasteryComponent,
    ItemSlotComponent,
    IconErrorComponent,
    IconEyeComponent,
    IconLoadComponent,
    IconRankComponent,
    IconRefreshComponent,
    ChampionPipe,
    HidePipe,
    MapPipe,
    TranslatePipe,
    PreviewComponent,
    ItemsFromComponent
  ],
  imports: [BrowserModule, CommonModule, RouterModule.forRoot(ROUTES), HttpModule],
  bootstrap: [AppComponent, ActionsComponent]
})
class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
