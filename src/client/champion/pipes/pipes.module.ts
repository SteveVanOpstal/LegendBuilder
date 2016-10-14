import {NgModule} from '@angular/core';

import {NamePipe} from './name.pipe';
import {SortPipe} from './sort.pipe';
import {TagsPipe} from './tags.pipe';

@NgModule({declarations: [NamePipe, SortPipe, TagsPipe], exports: [NamePipe, SortPipe, TagsPipe]})
export class PipesModule {
}
