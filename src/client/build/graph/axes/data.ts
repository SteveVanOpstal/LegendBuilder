import {axisLeft} from 'd3-axis';

import {DataScale} from '../scales/data';
import {Axis} from './axis';

export class DataAxis implements Axis {
  private axis: any;

  create(scale: DataScale) {
    this.axis = axisLeft(scale.get());
  }

  get() {
    return this.axis;
  }
}
