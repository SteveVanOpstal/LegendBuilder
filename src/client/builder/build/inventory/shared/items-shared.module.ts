import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../../../shared/shared.module';

import {ItemComponent} from './item/item.component';

@NgModule({
  declarations: [ItemComponent],
  imports: [CommonModule, SharedModule],
  exports: [ItemComponent]
})
export class ItemsSharedModule {}
