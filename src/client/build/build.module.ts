import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {BuildComponent} from './build.component';
import {GraphModule} from './graph/graph.module';
import {ItemsModule} from './items/items.module';
import {MasteriesModule} from './masteries/masteries.module';
import {BuildService} from './services/build.service';
import {StatsService} from './services/stats.service';
import {ShopModule} from './shop/shop.module';

@NgModule({
  providers: [BuildService, StatsService],
  declarations: [BuildComponent],
  imports: [CommonModule, SharedModule, GraphModule, ItemsModule, MasteriesModule, ShopModule],
  exports: [BuildComponent]
})
export class BuildModule {
}
