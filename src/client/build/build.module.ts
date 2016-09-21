import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {BuildComponent} from './build.component';
import {GraphModule} from './graph/graph.module';
import {ItemsModule} from './items/items.module';
import {MasteriesModule} from './masteries/masteries.module';
import {ShopModule} from './shop/shop.module';

@NgModule({
  imports: [CommonModule, SharedModule, GraphModule, ItemsModule, MasteriesModule, ShopModule],
  declarations: [BuildComponent],
  exports: [BuildComponent],
  providers: []
})
export class BuildModule {
}
