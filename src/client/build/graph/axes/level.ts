import {axisBottom} from 'd3-axis';

import {Samples} from '../../samples';
import {config} from '../config';
import {LevelScale} from '../scales/level';
import {Axis} from './axis';

export class LevelAxisLine implements Axis {
  private axis: any;

  create(scale: LevelScale) {
    this.axis = axisBottom(scale.get())
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
    this.axis =
        axisBottom(scale.get()).tickSize(-config.height + config.margin.top + config.margin.bottom);
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
