import * as d3 from 'd3-axis';

import {Samples} from '../../samples';
import {config} from '../config';
import {LevelScale} from '../scales/level';
import {Axis} from './axis';

export class LevelAxisLine implements Axis {
  private axis: d3.Axis<any>;

  create(scale: LevelScale): void {
    this.axis = d3.axisBottom(scale.get())
                    .tickSize(-config.height + config.margin.top + config.margin.bottom)
                    .tickValues(config.levelXp);
  }

  get(): d3.Axis<any> {
    return this.axis;
  }
}

export class LevelAxisText implements Axis {
  private axis: d3.Axis<any>;

  create(scale: LevelScale): void {
    this.axis = d3.axisBottom(scale.get())
                    .tickSize(-config.height + config.margin.top + config.margin.bottom);
  }

  get(): d3.Axis<any> {
    return this.axis;
  }

  update(samples: Samples): void {
    let lastXpMark = samples.xp[samples.xp.length - 1];

    let values: Array<number> = [];
    config.levelXp.forEach((v: number, i: number, a: Array<number>) => {
      values[i] = v + (((a[i + 1] ? a[i + 1] : lastXpMark) - v) / 2);
    });

    this.axis.tickValues(values).tickFormat((t) => {
      return (values.indexOf(t) + 1).toString();
    });
  }
}
