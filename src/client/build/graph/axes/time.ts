import * as d3 from 'd3';

import {Axis} from './axis';
import {Scale} from './scale';

import {settings} from '../../../../../config/settings';
import {config} from '../config';

export class TimeScale implements Scale {
  private scale;

  constructor() { }

  create() {
    this.scale = d3.scale.linear()
      .domain([0, settings.gameTime])
      .range([0, config.graphWidth]);
  }

  get() {
    return this.scale;
  }
}

export class TimeAxis implements Axis {
  private timeMarks: Array<number> = [0, 300000, 600000, 900000, 1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 3000000, 3300000, 3600000];
  private axis: any;

  constructor() { }

  create(scale: TimeScale) {
    this.axis = d3.svg.axis()
      .scale(scale.get())
      .tickSize(config.graphHeight)
      .tickValues(this.timeMarks)
      .tickFormat((d) => {
        return d === 0 ? '' : Math.floor(d / 3600000) + ':' + ('00' + Math.floor((d % 3600000) / 60000)).slice(-2);
      })
      .orient('top');
  }

  get() {
    return this.axis;
  }
}