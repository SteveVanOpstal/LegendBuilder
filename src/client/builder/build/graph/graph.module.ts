import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../../../shared/shared.module';

import {GraphComponent} from './graph.component';
import {LegendModule} from './legend/legend.module';
import {GraphContainerComponent} from './graph.container';
import {LineComponent} from './line/line.component';
import {TimelineComponent} from './timeline/timeline.component';

@NgModule({
  declarations: [GraphComponent, GraphContainerComponent, LineComponent, TimelineComponent],
  imports: [CommonModule, SharedModule, LegendModule],
  exports: [GraphContainerComponent]
})
export class GraphModule {}
