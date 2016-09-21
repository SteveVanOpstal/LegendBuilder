import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';

import {BarComponent} from './bar/bar.component';
import {ChampionComponent} from './champion.component';
import {FiltersComponent} from './filters/filters.component';
import {NamePipe} from './pipes/name.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {TagsPipe} from './pipes/tags.pipe';

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [ChampionComponent, FiltersComponent, BarComponent, NamePipe, SortPipe, TagsPipe],
  exports: [ChampionComponent],
  providers: []
})
export class ChampionModule {
}
