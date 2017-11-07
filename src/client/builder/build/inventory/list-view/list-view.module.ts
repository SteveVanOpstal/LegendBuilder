import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../../../shared/shared.module';
import {ItemsSharedModule} from '../shared/items-shared.module';

import {ItemContainedComponent} from './item-contained.component';
import {ListViewItemComponent} from './list-view-item.component';
import {ListViewComponent} from './list-view.component';

@NgModule({
  declarations: [ItemContainedComponent, ListViewComponent, ListViewItemComponent],
  imports: [CommonModule, SharedModule, ItemsSharedModule],
  exports: [ListViewComponent]
})
export class ListViewModule {}
