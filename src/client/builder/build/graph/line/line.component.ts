import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {bisector} from 'd3-array';
import {CurveFactory, curveLinear, line} from 'd3-shape';

import {DataScale, TimeScale} from '../scales';

export interface Line {
  enabled: boolean;
  preview: boolean;
  name: string;
  path: Array<{time: number, value: number}>;
  curve: CurveFactory;
  currentValue: number;
}

@Component({
  selector: 'g[lbLine]',
  styleUrls: ['./line.component.scss'],
  template: `
    <svg:path [attr.d]="d"
          class="line {{line?.name}}"
          [ngClass]="{enabled: line?.enabled, preview: line?.preview}"
          shape-rendering="geometricPrecision">
    </path>
    <svg:g class="focus"
           [ngClass]="{enabled: line?.enabled}"
           [attr.transform]="'translate(' + focusPosition.x + ',' + focusPosition.y + ')'">
      <circle r="3"></circle>
    </g>
  `
})
export class LineComponent implements OnChanges, OnInit {
  @Input() line: Line;
  d: string;

  focusPosition = {x: 0, y: 0};

  private xScale = new TimeScale([0, 1420]);
  private yScale = new DataScale([380, 0], [0, 4000]);
  private bisectTime = bisector(d => d['time']).left;

  private domains: Array<[number, number]> = [
    [0, 100],
    [0, 300],
    [0, 3000],
    [0, 30000],
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['line'] || !changes['line'].currentValue) {
      return;
    }

    const path: Array<{time: number, value: number}> = changes['line'].currentValue.path;

    if (path && (!changes['line'].previousValue || path !== changes['line'].previousValue.path)) {
      this.update();
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.move(1420, this.xScale.get().invert(1420));
  }

  move(offsetX: number, offsetXScaled: number) {
    if (!this.line.enabled) {
      return;
    }
    const left = this.bisectTime(this.line.path, offsetXScaled, 1);
    const dLeft = this.line.path[left - 1];
    const dRight = this.line.path[left];
    let value = dLeft.value;

    // add linear intermediate offset
    if (this.line.curve === curveLinear && dRight) {
      const timeInterval = dRight.time - dLeft.time;
      const timeOffset = offsetXScaled - dLeft.time;
      const valueInterval = dRight.value - dLeft.value;
      const valueOffset = valueInterval * (timeOffset / timeInterval);
      value += valueOffset;
    }

    this.focusPosition.x = offsetX;
    this.focusPosition.y = this.yScale.get()(value);
    this.line.currentValue = Math.round(value);
  }

  // mouseover() {
  //   this.focus.visible = true;
  // }

  // mouseout() {
  //   this.focus.visible = false;
  // }

  update() {
    this.yScale.update(this.findDomain(this.line.path));

    const l = line()
                  .x((d) => {
                    return this.xScale.get()(d['time']);
                  })
                  .y((d) => {
                    return this.yScale.get()(d['value']);
                  })
                  .curve(this.line.curve);

    this.d = l(<any>this.line.path);
  }

  private findDomain(path: Array<{time: number, value: number}>): [number, number] {
    const last = path[path.length - 1].value;
    return this.domains.find(domain => {
      return last < domain[1];
    });
  }
}
