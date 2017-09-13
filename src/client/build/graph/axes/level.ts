import * as d3 from 'd3-axis';

import {Samples} from '../../samples';
import {config} from '../config';
import {LevelScale} from '../scales/level';
import {Axis} from './axis';

export class LevelAxisLine implements Axis {
  public axis: d3.Axis<any>;

  constructor(private tickSize: number) {}

  create(scale: LevelScale): void {
    this.axis = d3.axisBottom(scale.get()).tickSize(this.tickSize).tickValues(config.levelXp);
  }

  get(): d3.Axis<any> {
    return this.axis;
  }
}

export class LevelAxisText implements Axis {
  public axis: d3.Axis<any>;

  constructor(private tickSize: number) {}

  create(scale: LevelScale): void {
    this.axis = d3.axisBottom(scale.get()).tickSize(this.tickSize);
  }

  get(): d3.Axis<any> {
    return this.axis;
  }

  update(samples: Samples): void {
    const lastXpMark = samples.xp[samples.xp.length - 1];

    const values: Array<number> = [];
    config.levelXp.forEach((v: number, i: number, a: Array<number>) => {
      values[i] = v + (((a[i + 1] ? a[i + 1] : lastXpMark) - v) / 2);
    });

    this.axis.tickValues(values).tickFormat((t) => {
      return (values.indexOf(t) + 1).toString();
    });
  }
}
