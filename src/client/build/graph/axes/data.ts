import * as d3 from 'd3';

import {config} from '../config';

import {Axis} from './axis';
import {Scale} from './scale';

export class DataScale implements Scale {
  private scale;

  create() {
    this.scale = d3.scale.linear().domain([0, 30000]).range([config.graphHeight, 0]);
  }

  get() {
    return this.scale;
  }
}

export class DataAxis implements Axis {
  private axis: any;

  create(scale: DataScale) {
    this.axis = d3.svg.axis().scale(scale.get()).orient('left');
  }

  get() {
    return this.axis;
  }
}
