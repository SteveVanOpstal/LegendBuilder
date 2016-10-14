import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';

import {BarModule} from './bar/bar.module';
import {ChampionComponent} from './champion.component';
import {FiltersModule} from './filters/filters.module';
import {PipesModule} from './pipes/pipes.module';

@NgModule({
  declarations: [ChampionComponent],
  imports: [CommonModule, RouterModule, SharedModule, BarModule, FiltersModule, PipesModule],
  exports: [ChampionComponent]
})
export class ChampionModule {
}
