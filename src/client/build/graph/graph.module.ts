import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AbilitySequenceModule} from './ability-sequence/ability-sequence.module';
import {GraphComponent} from './graph.component';
import {LegendModule} from './legend/legend.module';

@NgModule({
  declarations: [GraphComponent],
  imports: [CommonModule, LegendModule, AbilitySequenceModule],
  exports: [GraphComponent]
})
export class GraphModule {
}
