import * as d3 from 'd3-scale';

import {Samples} from '../../samples';
import {Scale} from './scale';

export class LevelScale implements Scale {
  public scale: d3.ScaleLinear<number, number>;

  constructor(private range: [number, number]) {}

  create() {
    this.scale = d3.scaleLinear().range(this.range);
  }

  get() {
    return this.scale;
  }

  update(samples: Samples) {
    const lastXpMark = samples.xp[samples.xp.length - 1];
    this.scale.domain([0, lastXpMark]);
  }
}
