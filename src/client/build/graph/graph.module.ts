import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {GraphComponent} from './graph.component';
import {LegendModule} from './legend/legend.module';
import {LineComponent} from './line.component';

@NgModule({
  declarations: [GraphComponent, LineComponent],
  imports: [CommonModule, LegendModule],
  exports: [GraphComponent]
})
export class GraphModule {
}
