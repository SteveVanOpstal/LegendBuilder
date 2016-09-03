import {axisLeft, axisRight} from 'd3-axis';

import {DataScale} from '../scales/data';
import {Axis} from './axis';

export class DataAxis implements Axis {
  private axis: any;

  create(scale: DataScale, left: boolean = true) {
    if (left) {
      this.axis = axisLeft(scale.get());
    } else {
      this.axis = axisRight(scale.get());
    }
  }

  get() {
    return this.axis;
  }
}
