import * as d3 from 'd3-axis';

export interface Axis {
  axis: d3.Axis<any>;
  get();
}
