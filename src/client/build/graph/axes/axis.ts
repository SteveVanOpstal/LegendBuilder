import {Axis} from 'd3-axis';

import {Scale} from '../scales/scale';

export interface Axis {
  create(scale: Scale): void;
  get(): Axis;
}
