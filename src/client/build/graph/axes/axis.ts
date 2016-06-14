import * as d3 from 'd3';

import {Scale} from './scale';

export interface Axis {
  create(scale: Scale): void;
  get(): d3.svg.Axis;
}
