import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';

import {RegionComponent} from './region.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [RegionComponent],
  exports: [RegionComponent],
  providers: []
})
export class RegionModule {
}
