import * as d3 from 'd3';

import {settings} from '../../../../../config/settings';
import {config} from '../config';

import {Axis} from './axis';
import {Scale} from './scale';

export class TimeScale implements Scale {
  private scale;

  constructor() {}

  create() {
    this.scale = d3.scale.linear().domain([0, settings.gameTime]).range([0, config.graphWidth]);
  }

  get() {
    return this.scale;
  }
}

export class TimeAxis implements Axis {
  private timeMarks: Array<number> = [];
  private axis: any;

  constructor() {}

  create(scale: TimeScale) {
    this.timeMarks = [];

    let i: number = 0;
    while (i <= settings.gameTime) {
      this.timeMarks.push(i);
      i += config.timeInterval;
    }

    this.axis = d3.svg.axis()
                    .scale(scale.get())
                    .tickSize(config.graphHeight)
                    .tickValues(this.timeMarks)
                    .tickFormat((d) => {
                      return d === 0 ? '' :
                                       Math.floor(d / settings.gameTime) + ':' +
                              ('00' + Math.floor((d % settings.gameTime) / 60000)).slice(-2);
                    })
                    .orient('top');
  }

  get() {
    return this.axis;
  }
}
