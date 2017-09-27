import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgPipesModule} from 'ng-pipes';

import {AssetsModule} from '../../../assets/assets.module';
import {SharedModule} from '../../../shared/shared.module';

import {ItemComponent} from './item.component';
import {PipesModule} from './pipes/pipes.module';
import {PreviewModule} from './preview/preview.module';
import {ShopComponent} from './shop.component';

@NgModule({
  declarations: [ShopComponent, ItemComponent],
  imports: [CommonModule, NgPipesModule, AssetsModule, SharedModule, PreviewModule, PipesModule],
  exports: [ShopComponent]
})
export class ShopModule {}
