import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';

import {ItemSlotComponent} from './item-slot.component';
import {ItemComponent} from './item.component';
import {ItemsComponent} from './items.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ItemsComponent, ItemComponent, ItemSlotComponent],
  exports: [ItemsComponent],
  providers: []
})
export class ItemsModule {
}
