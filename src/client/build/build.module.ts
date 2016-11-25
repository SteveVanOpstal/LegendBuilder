import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {StatsService} from '../services/stats.service';
import {SharedModule} from '../shared/shared.module';

import {AbilitiesComponent} from './abilities/abilities.component';
import {BuildComponent} from './build.component';
import {GraphModule} from './graph/graph.module';
import {ItemsModule} from './items/items.module';
import {MasteriesModule} from './masteries/masteries.module';
import {ShopModule} from './shop/shop.module';

@NgModule({
  providers: [StatsService],
  declarations: [BuildComponent, AbilitiesComponent],
  imports: [CommonModule, SharedModule, GraphModule, ItemsModule, MasteriesModule, ShopModule],
  exports: [BuildComponent]
})
export class BuildModule {
}
