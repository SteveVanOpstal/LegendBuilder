import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';

import {CurveComponent} from './curve/curve.component';
import {ItemCurveComponent} from './curve/item-curve.component';
import {ItemSlotComponent} from './item-slot/item-slot.component';
import {ItemComponent} from './item/item.component';
import {ItemsComponent} from './items.component';

@NgModule({
  declarations:
      [CurveComponent, ItemCurveComponent, ItemSlotComponent, ItemComponent, ItemsComponent],
  imports: [CommonModule, SharedModule],
  exports: [ItemsComponent]
})
export class ItemsModule {}
