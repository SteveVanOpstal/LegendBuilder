import {NgModule} from '@angular/core';

import {ChampionPipe} from './champion.pipe';
import {HidePipe} from './hide.pipe';
import {MapPipe} from './map.pipe';
import {NamePipe} from './name.pipe';
import {SortPipe} from './sort.pipe';
import {TagsPipe} from './tags.pipe';
import {TranslatePipe} from './translate.pipe';

@NgModule({
  declarations: [ChampionPipe, HidePipe, MapPipe, NamePipe, SortPipe, TagsPipe, TranslatePipe],
  exports: [ChampionPipe, HidePipe, MapPipe, NamePipe, SortPipe, TagsPipe, TranslatePipe]
})
export class PipesModule {
}
