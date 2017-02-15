import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgPipesModule} from 'ng-pipes';

import {SharedModule} from '../shared/shared.module';

import {RegionComponent} from './region.component';

@NgModule({
  declarations: [RegionComponent],
  imports: [CommonModule, NgPipesModule, RouterModule, SharedModule],
  exports: [RegionComponent]
})
export class RegionModule {
}
