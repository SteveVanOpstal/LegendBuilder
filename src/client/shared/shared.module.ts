import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AssetsModule} from '../assets/assets.module';

import {CapitalizePipe} from './capitalize.pipe';
import {DDragonPipe} from './ddragon.pipe';
import {ErrorComponent} from './error.component';
import {LoadingComponent} from './loading.component';
import {RetryComponent} from './retry.component';

@NgModule({
  declarations: [CapitalizePipe, DDragonPipe, ErrorComponent, LoadingComponent, RetryComponent],
  imports: [CommonModule, AssetsModule],
  exports: [CapitalizePipe, DDragonPipe, ErrorComponent, LoadingComponent, RetryComponent]
})
export class SharedModule {
}
