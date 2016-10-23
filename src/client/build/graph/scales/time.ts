import * as d3 from 'd3-scale';

import {settings} from '../../../../../config/settings';
import {Scale} from './scale';

export class TimeScale implements Scale {
  public scale: d3.ScaleLinear<number, number>;

  constructor(private range: number[]) {}

  create() {
    this.scale = d3.scaleLinear().domain([0, settings.gameTime]).range(this.range);
  }

  get() {
    return this.scale;
  }
}
