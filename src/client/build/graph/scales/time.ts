import {scaleLinear} from 'd3-scale';

import {settings} from '../../../../../config/settings';
import {config} from '../config';
import {Scale} from './scale';

export class TimeScale implements Scale {
  private scale;

  constructor() {}

  create() {
    this.scale = scaleLinear().domain([0, settings.gameTime]).range([0, config.graphWidth]);
  }

  get() {
    return this.scale;
  }
}
