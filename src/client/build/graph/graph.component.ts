import {Component, ElementRef, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {select} from 'd3-selection';
import {CurveFactory, curveLinear, curveStepAfter} from 'd3-shape';

import {settings} from '../../../../config/settings';
import {LolApiService, StatsService} from '../../services';
import {Samples} from '../samples';

import {TimeAxis} from './axes';
import {Line, LineComponent} from './line.component';
import {TimeScale} from './scales';

@Component({
  selector: 'lb-graph',
  styleUrls: ['./graph.component.scss'],
  template: `
    <lb-loading [observable]="lolApi.getCurrentMatchData()">
      <lb-legend [lines]="lines"></lb-legend>
    </lb-loading>
    <svg xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 1500 400"
        (mousedown)="mousedown($event)"
        (mouseup)="dragging = false"
        (mouseleave)="dragging = false"
        (mousemove)="mousemove($event)">
      <g transform="translate(60,20)">
        <g class="lines">
          <g lb-line [line]="line" *ngFor="let line of lines"></g>
        </g>
        <g class="axes">
          <g class="x axis time" transform="translate(0,380)"></g>
        </g>
      </g>
    </svg>`
})

export class GraphComponent implements OnInit {
  dragging = false;
  lines = new Array<Line>();
  @ViewChildren(LineComponent) lineComponents: QueryList<LineComponent>;

  private svg: any;
  private focus: any;
  private overlay: any;

  private xScaleTime = new TimeScale([0, 1420]);
  private xAxisTime = new TimeAxis(380, this.xScaleTime);

  private mouseOffsetX: number;

  constructor(
      @Inject(ElementRef) private elementRef: ElementRef, public lolApi: LolApiService,
      private stats: StatsService) {}

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.focus = this.svg.select('.focus');
    this.overlay = this.svg.select('.overlay');
    this.svg.select('.x.axis.time').call(this.xAxisTime.get());

    this.stats.stats.subscribe((stats) => {
      this.updateLines(stats, curveStepAfter);
    });

    this.lolApi.getCurrentMatchData().subscribe((samples: Samples) => {
      this.updateSamples(samples);
    });
  }

  mousedown(event: MouseEvent) {
    this.dragging = true;
    this.move(event);
  }

  mousemove(event: MouseEvent) {
    if (this.dragging) {
      this.move(event);
    }
  }

  move(event: MouseEvent) {
    if (Math.abs(event.offsetX - this.mouseOffsetX) < 1) {
      return;
    }
    this.mouseOffsetX = event.offsetX;

    const offsetX = this.xScaleTime.get().invert(event.offsetX - 60);
    this.lineComponents.forEach(line => {
      line.move(event.offsetX - 60, offsetX);
    });
  }

  // mouseover() {
  //   this.lineComponents.forEach(line => {
  //     line.mouseover();
  //   });
  // }

  // mouseout() {
  //   this.lineComponents.forEach(line => {
  //     line.mouseout();
  //   });
  // }

  // @HostListener('window:resize')
  // onResize() {
  //   this.xScaleTime.update([0, this.svg.node().getBBox().width]);
  // }

  private updateSamples(samples: Samples) {
    const paths = {};
    for (const name of Object.keys(samples)) {
      paths[name] = [];
      for (const i of Object.keys(samples[name])) {
        const index = parseInt(i, 10);
        const time = index * (settings.gameTime / (settings.match.sampleSize - 1));
        const value = samples[name][index];
        paths[name].push({time: time, value: value});
      }
    }
    this.updateLines(paths, curveLinear);
  }

  private updateLines(
      paths: {[name: string]: Array<{time: number, value: number}>}, curve: CurveFactory) {
    for (const name of Object.keys(paths)) {
      this.updateLine(paths[name], curve, name);
    }

    for (let index = 0; index < this.lines.length; index++) {
      if (this.lines[index].curve !== curve) {
        continue;
      }
      const deleteLine = Object.keys(paths).findIndex((name) => {
        return name === this.lines[index].name;
      }) < 0;
      if (deleteLine) {
        this.lines.splice(index, 1);
        index--;
      }
    }
  }

  private updateLine(
      path: Array<{time: number, value: number}>, curve: CurveFactory, name: string) {
    const lineIndex = this.findLine(name);
    if (lineIndex >= 0 && this.lines[lineIndex].path !== path) {
      const line = {...this.lines[lineIndex]};
      line.path = path;
      this.lines[lineIndex] = line;
    } else {
      this.lines.push(
          {preview: false, enabled: true, name: name, path: path, curve: curve, currentValue: 0});
    }
  }
  private findLine(name: string): number {
    return this.lines.findIndex((path) => {
      return path.name === name;
    });
  }
}
