import * as d3 from 'd3-scale';

import {Scale} from './scale';

export class DataScale implements Scale {
  public scale: d3.ScaleLinear<number, number>;

  constructor(private range: number[]) {}

  create(domain: [number, number] = [0, 30000]) {
    this.scale = d3.scaleLinear().domain(domain).range(this.range);
  }

  get() {
    return this.scale;
  }
}
