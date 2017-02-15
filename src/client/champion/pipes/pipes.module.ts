import {NgModule} from '@angular/core';

import {SortPipe} from './sort.pipe';
import {TagsPipe} from './tags.pipe';

@NgModule({declarations: [SortPipe, TagsPipe], exports: [SortPipe, TagsPipe]})
export class PipesModule {
}
