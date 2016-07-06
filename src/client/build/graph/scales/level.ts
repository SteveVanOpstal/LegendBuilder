import {scaleLinear} from 'd3-scale';

import {Samples} from '../../samples';
import {config} from '../config';
import {Scale} from './scale';

export class LevelScale implements Scale {
  private scale;

  create() {
    this.scale = scaleLinear().range([0, config.graphWidth]);
  }

  get() {
    return this.scale;
  }

  update(samples: Samples) {
    let lastXpMark = samples.xp[samples.xp.length - 1];
    this.scale.domain([0, lastXpMark]);
  }
}
