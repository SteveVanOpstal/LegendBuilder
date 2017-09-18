import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {BuildModule} from './build/build.module';
import {ChampionsComponent} from './champion/champions.component';
import {ChampionsModule} from './champion/champions.module';
import {RegionComponent} from './region/region.component';
import {RegionModule} from './region/region.module';
import {SummonerComponent} from './summoner/summoner.component';
import {SummonerModule} from './summoner/summoner.module';

export const routes: Routes = [
  {path: '', component: RegionComponent}, {path: ':region', component: SummonerComponent},
  {path: ':region/:summoner', component: ChampionsComponent},
  {path: ':region/:summoner/:champion', component: BuildComponent}
];

@NgModule({
  imports:
      [RouterModule.forChild(routes), BuildModule, ChampionsModule, RegionModule, SummonerModule],
  exports: [RouterModule]
})
export class BuilderRoutingModule {
}
