import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {GraphComponent} from './graph.component';
import {LegendModule} from './legend/legend.module';

@NgModule({
  declarations: [GraphComponent],
  imports: [CommonModule, LegendModule],
  exports: [GraphComponent]
})
export class GraphModule {
}
