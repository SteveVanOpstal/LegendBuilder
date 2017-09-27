import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champion/champions.component';
import {RegionComponent} from './region/region.component';
import {SummonerComponent} from './summoner/summoner.component';

export const routes: Routes = [
  {path: '', component: RegionComponent}, {path: ':region', component: SummonerComponent},
  {path: ':region/:summoner', component: ChampionsComponent},
  {path: ':region/:summoner/:champion', component: BuildComponent}
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class BuilderRoutingModule {}
