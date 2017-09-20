import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';

import {ItemSlotComponent} from './item-slot/item-slot.component';
import {ItemComponent} from './item/item.component';
import {ItemsComponent} from './items.component';

@NgModule({
  declarations: [ItemsComponent, ItemComponent, ItemSlotComponent],
  imports: [CommonModule, SharedModule],
  exports: [ItemsComponent]
})
export class ItemsModule {}
