import {scaleLinear} from 'd3-scale';

import {config} from '../config';
import {Scale} from './scale';

export class DataScale implements Scale {
  private scale;

  create() {
    this.scale = scaleLinear().domain([0, 30000]).range([config.graphHeight, 0]);
  }

  get() {
    return this.scale;
  }
}
