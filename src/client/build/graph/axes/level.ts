import * as d3 from 'd3';

import {Samples} from '../../samples';
import {config} from '../config';

import {Axis} from './axis';
import {Scale} from './scale';

export class LevelScale implements Scale {
  private scale;

  create() {
    this.scale = d3.scale.linear().range([0, config.graphWidth]);
  }

  get() {
    return this.scale;
  }

  update(samples: Samples) {
    let lastXpMark = samples.xp[samples.xp.length - 1];
    this.scale.domain([0, lastXpMark]);
  }
}

export class LevelAxisLine implements Axis {
  private axis: any;

  create(scale: LevelScale) {
    this.axis = d3.svg.axis()
                    .scale(scale.get())
                    .tickSize(-config.height + config.margin.top + config.margin.bottom)
                    .tickValues(config.levelXp);
  }

  get() {
    return this.axis;
  }
}

export class LevelAxisText implements Axis {
  private axis: any;

  create(scale: LevelScale) {
    this.axis = d3.svg.axis()
                    .scale(scale.get())
                    .tickSize(-config.height + config.margin.top + config.margin.bottom);
  }

  get() {
    return this.axis;
  }

  update(samples: Samples) {
    let lastXpMark = samples.xp[samples.xp.length - 1];

    let values = [];
    config.levelXp.forEach((v, i, a) => {
      values[i] = v + (((a[i + 1] ? a[i + 1] : lastXpMark) - v) / 2);
    });

    this.axis.tickValues(values).tickFormat((t) => {
      return (values.indexOf(t) + 1).toString();
    });
  }
}
