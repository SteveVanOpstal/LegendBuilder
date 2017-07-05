import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {bisector} from 'd3-array';
import {curveLinear, line} from 'd3-shape';

import {Line} from './graph.component';
import {DataScale, TimeScale} from './scales';



// export let defaultImage: string =
//     'data:image/svg+xml,' + encodeURIComponent(require('../assets/images/hourglass.svg'));

@Component({
  selector: 'g[lb-line]',
  template: `
    <svg:path [attr.d]="d"
          class="line {{line?.name}}"
          [ngClass]="{enabled: line?.enabled, preview: line?.preview}"
          shape-rendering="geometricPrecision">
    </svg:path>
    <svg:g class="focus"
           [ngClass]="{enabled: line?.enabled && focus.visible}"
           [attr.transform]="'translate(' + focus.position.x + ',' + focus.position.y + ')'">
      <circle r="4"></circle>
      <text x="9" dy=".35em">{{ focus.text }}</text>
    </svg:g>
  `
})
export class LineComponent implements OnChanges {
  @Input() line: Line;
  d: string;

  focus = {position: {x: 0, y: 0}, text: '', visible: false};

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

    let path: Array<{time: number, value: number}> = changes['line'].currentValue.path;

    if (path && (!changes['line'].previousValue || path !== changes['line'].previousValue.path)) {
      this.update();
      return true;
    }
    return false;
  }

  mousemove(offsetX: number, offsetXScaled: number) {
    if (!this.line.enabled) {
      return;
    }
    let left = this.bisectTime(this.line.path, offsetXScaled, 1);
    let dLeft = this.line.path[left - 1];
    let dRight = this.line.path[left];
    let value = dLeft.value;

    // add linear intermediate offset
    if (this.line.curve === curveLinear && dRight) {
      let timeInterval = dRight.time - dLeft.time;
      let timeOffset = offsetXScaled - dLeft.time;
      let valueInterval = dRight.value - dLeft.value;
      let valueOffset = valueInterval * (timeOffset / timeInterval);
      value += valueOffset;
    }

    this.focus.position.x = offsetX;
    this.focus.position.y = this.yScale.get()(value);
    this.focus.text = value.toString();
  }

  mouseover() {
    this.focus.visible = true;
  }

  mouseout() {
    this.focus.visible = false;
  }

  update() {
    this.yScale.update(this.findDomain(this.line.path));

    let l = line()
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
    let last = path[path.length - 1].value;
    return this.domains.find(domain => {
      return last < domain[1];
    });
  }
}
