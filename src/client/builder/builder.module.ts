import {NgModule} from '@angular/core';

import {BuildModule} from './build/build.module';
import {BuilderRoutingModule} from './builder.routing';
import {ChampionsModule} from './champion/champions.module';
import {RegionModule} from './region/region.module';
import {SummonerModule} from './summoner/summoner.module';

@NgModule(
    {imports: [BuildModule, BuilderRoutingModule, ChampionsModule, RegionModule, SummonerModule]})
export class BuilderModule {}
