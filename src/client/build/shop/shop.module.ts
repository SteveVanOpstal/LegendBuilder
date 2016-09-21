import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AssetsModule} from '../../assets/assets.module';
import {SharedModule} from '../../shared/shared.module';

import {ItemComponent} from './item.component';
import {ChampionPipe} from './pipes/champion.pipe';
import {HidePipe} from './pipes/hide.pipe';
import {MapPipe} from './pipes/map.pipe';
import {NamePipe} from './pipes/name.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {TagsPipe} from './pipes/tags.pipe';
import {TranslatePipe} from './pipes/translate.pipe';
import {PreviewModule} from './preview/preview.module';
import {ShopComponent} from './shop.component';

@NgModule({
  imports: [CommonModule, AssetsModule, SharedModule, PreviewModule],
  declarations: [
    ShopComponent, ItemComponent, ChampionPipe, HidePipe, MapPipe, NamePipe, SortPipe, TagsPipe,
    TranslatePipe
  ],
  exports: [ShopComponent],
  providers: []
})
export class ShopModule {
}
