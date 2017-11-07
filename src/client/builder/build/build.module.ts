import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {ItemsStoreModule} from '../../store/items/items-store.module';

import {AbilitiesComponent} from './abilities/abilities.component';
import {BuildComponent} from './build.component';
import {BuildSandbox} from './build.sandbox';
import {GraphModule} from './graph/graph.module';
import {InventoryModule} from './inventory/inventory.module';
import {MasteriesModule} from './masteries/masteries.module';
import {PickedItemsService} from './services/picked-items.service';
import {QueryService} from './services/query.service';
import {StatsService} from './services/stats.service';
import {ShopModule} from './shop/shop.module';

@NgModule({
  providers: [StatsService, BuildSandbox, PickedItemsService, QueryService],
  declarations: [BuildComponent, AbilitiesComponent],
  imports: [
    CommonModule, SharedModule, ItemsStoreModule, GraphModule, InventoryModule, MasteriesModule,
    ShopModule
  ],
  exports: [BuildComponent]
})
export class BuildModule {}
