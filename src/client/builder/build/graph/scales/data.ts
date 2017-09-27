import * as d3 from 'd3-scale';

import {Scale} from './scale';

export class DataScale implements Scale {
  public scale: d3.ScaleLinear<number, number>;

  constructor(range: [number, number], domain: [number, number]) {
    this.scale = d3.scaleLinear().range(range).domain(domain);
  }

  get() {
    return this.scale;
  }

  update(domain: [number, number]) {
    this.scale.domain(domain);
  }
}
