import * as d3 from 'd3-axis';

import {Scale} from '../scales/scale';

export interface Axis {
  axis: d3.Axis<any>;
  create(scale: Scale): void;
  get(): d3.Axis<any>;
}
