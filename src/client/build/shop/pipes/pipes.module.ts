import {NgModule} from '@angular/core';

import {ChampionPipe} from './champion.pipe';
import {HidePipe} from './hide.pipe';
import {MapPipe} from './map.pipe';
import {NamePipe} from './name.pipe';
import {SortPipe} from './sort.pipe';
import {TagsPipe} from './tags.pipe';

@NgModule({
  declarations: [ChampionPipe, HidePipe, MapPipe, NamePipe, SortPipe, TagsPipe],
  exports: [ChampionPipe, HidePipe, MapPipe, NamePipe, SortPipe, TagsPipe]
})
export class PipesModule {}
