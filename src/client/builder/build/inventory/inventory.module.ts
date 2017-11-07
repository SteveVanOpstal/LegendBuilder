import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AssetsModule} from '../../../assets/assets.module';

import {InventoryComponent} from './inventory.component';
import {ListViewModule} from './list-view/list-view.module';
import {TreeViewModule} from './tree-view/tree-view.module';

@NgModule({
  declarations: [InventoryComponent],
  imports: [CommonModule, AssetsModule, ListViewModule, TreeViewModule],
  exports: [InventoryComponent]
})
export class InventoryModule {}
