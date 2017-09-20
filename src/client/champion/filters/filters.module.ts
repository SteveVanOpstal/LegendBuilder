import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FiltersComponent} from './filters.component';
import {SortFilterComponent} from './sort-filter/sort-filter.component';
import {TagsFilterComponent} from './tags-filter/tags-filter.component';

@NgModule({
  declarations: [FiltersComponent, SortFilterComponent, TagsFilterComponent],
  imports: [CommonModule],
  exports: [FiltersComponent, SortFilterComponent, TagsFilterComponent]
})
export class FiltersModule {}
