import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgPipesModule} from 'ng-pipes';

import {SharedModule} from '../shared/shared.module';

import {RegionComponent} from './region.component';
import {RegionsSandbox} from './regions.sandbox';

@NgModule({
  providers: [RegionsSandbox],
  declarations: [RegionComponent],
  imports: [CommonModule, NgPipesModule, RouterModule, SharedModule],
  exports: [RegionComponent]
})
export class RegionModule {
}
