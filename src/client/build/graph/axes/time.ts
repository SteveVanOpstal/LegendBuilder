import {axisTop} from 'd3-axis';

import {settings} from '../../../../../config/settings';
import {config} from '../config';
import {TimeScale} from '../scales/time';
import {Axis} from './axis';

export class TimeAxis implements Axis {
  private timeMarks: Array<number> = [];
  private axis: any;

  constructor() {
    let i: number = 0;
    while (i <= settings.gameTime) {
      this.timeMarks.push(i);
      i += config.timeInterval;
    }
  }

  create(scale: TimeScale) {
    this.axis = axisTop(scale.get())
                    .tickSize(config.graphHeight)
                    .tickValues(this.timeMarks)
                    .tickFormat((d) => {
                      return d === 0 ? '' :
                                       Math.floor(d / settings.gameTime) + ':' +
                              ('00' + Math.floor((d % settings.gameTime) / 60000)).slice(-2);
                    });
  }

  get() {
    return this.axis;
  }
}
