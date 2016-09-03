import {scaleLinear} from 'd3-scale';

import {config} from '../config';
import {Scale} from './scale';

export class DataScale implements Scale {
  private scale;

  create(domain: [number, number] = [0, 30000]) {
    this.scale = scaleLinear().domain(domain).range([config.graphHeight, 0]);
  }

  get() {
    return this.scale;
  }
}
