import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AssetsModule} from '../assets/assets.module';

import {CapitalizePipe} from './capitalize.pipe';
import {DDragonDirective} from './ddragon.directive';
import {ErrorComponent} from './error.component';
import {LoadingComponent} from './loading.component';
import {RetryComponent} from './retry.component';
import {ToIterablePipe} from './to-iterable.pipe';

@NgModule({
  declarations: [
    CapitalizePipe, DDragonDirective, ErrorComponent, LoadingComponent, RetryComponent,
    ToIterablePipe
  ],
  imports: [CommonModule, AssetsModule],
  exports: [
    CapitalizePipe, DDragonDirective, ErrorComponent, LoadingComponent, RetryComponent,
    ToIterablePipe
  ]
})
export class SharedModule {
}
