import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ItemsSharedModule} from '../shared/items-shared.module';

import {CurveComponent} from './curve/curve.component';
import {ItemCurveComponent} from './item-curve/item-curve.component';
import {ItemSlotComponent} from './item-slot/item-slot.component';
import {TreeViewComponent} from './tree-view.component';

@NgModule({
  declarations: [CurveComponent, ItemCurveComponent, ItemSlotComponent, TreeViewComponent],
  imports: [CommonModule, ItemsSharedModule],
  exports: [TreeViewComponent]
})
export class TreeViewModule {}
