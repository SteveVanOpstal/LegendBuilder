import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared/shared.module';

import {RegionComponent} from './region.component';

@NgModule({
  declarations: [RegionComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [RegionComponent]
})
export class RegionModule {
}
