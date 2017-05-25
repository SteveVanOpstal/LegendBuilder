import * as d3 from 'd3-axis';

import {settings} from '../../../../../config/settings';
import {config} from '../config';
import {TimeScale} from '../scales';
import {Axis} from './axis';

export class TimeAxis implements Axis {
  public axis: d3.Axis<any>;

  constructor(tickSize: number, scale: TimeScale) {
    this.axis = d3.axisTop(scale.get())
                    .tickSize(tickSize)
                    .tickValues(this.createTimeMarks())
                    .tickFormat((d: number) => {
                      return Math.floor(d / settings.gameTime) + ':' +
                          ('00' + Math.floor((d % settings.gameTime) / 60000)).slice(-2);
                    });
  }

  createTimeMarks() {
    let timeMarks: Array<number> = [];
    let i: number = 0;
    while (i <= settings.gameTime) {
      timeMarks.push(i);
      i += config.timeInterval;
    }
    return timeMarks;
  }

  get() {
    return this.axis;
  }
}
