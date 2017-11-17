import * as d3 from 'd3-scale';

import {settings} from '../../../../../../config/settings';
import {Scale} from './scale';

export class TimeScale implements Scale {
  public scale: d3.ScaleLinear<number, number>;

  constructor(range: [number, number]) {
    this.scale = d3.scaleLinear().domain([0, settings.match.gameTime]).range(range);
  }

  get() {
    return this.scale;
  }

  update(range: [number, number]) {
    this.scale.range(range);
  }
}
