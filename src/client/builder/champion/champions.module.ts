import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgPipesModule} from 'ng-pipes';

import {SharedModule} from '../../shared/shared.module';

import {BarModule} from './bar/bar.module';
import {ChampionComponent} from './champion.component';
import {ChampionsComponent} from './champions.component';
import {ChampionsSandbox} from './champions.sandbox';
import {FiltersModule} from './filters/filters.module';
import {PipesModule} from './pipes/pipes.module';

@NgModule({
  providers: [ChampionsSandbox],
  declarations: [ChampionsComponent, ChampionComponent],
  imports: [
    CommonModule, NgPipesModule, RouterModule, SharedModule, BarModule, FiltersModule, PipesModule
  ],
  exports: [ChampionsComponent]
})
export class ChampionsModule {}
