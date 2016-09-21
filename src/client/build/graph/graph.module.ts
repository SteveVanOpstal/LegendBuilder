import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';

import {AbilitySequenceComponent} from './ability-sequence/ability-sequence.component';
import {GraphComponent} from './graph.component';
import {LegendComponent} from './legend/legend.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [GraphComponent, AbilitySequenceComponent, LegendComponent],
  exports: [GraphComponent],
  providers: []
})
export class GraphModule {
}
