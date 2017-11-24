import {Component, OnInit} from '@angular/core';
import {CurveFactory, curveLinear, curveStepAfter} from 'd3-shape';

import {settings} from '../../../../../config/settings';
import {Samples} from '../../../models/samples';
import {ReactiveComponent} from '../../../shared/reactive.component';
import {BuildSandbox} from '../build.sandbox';
import {StatsService} from '../services/stats.service';

import {Line} from './line/line.component';

@Component({
  selector: 'lb-graph-container',
  template: `
    <lb-loading [observable]="sb.matchdata$">
      <lb-legend [lines]="lines"></lb-legend>
    </lb-loading>
    <lb-graph [lines]="lines"></lb-graph>`
})

export class GraphContainerComponent extends ReactiveComponent implements OnInit {
  lines = new Array<Line>();

  constructor(
      public sb: BuildSandbox,
      private stats: StatsService) {
    super();
  }

  ngOnInit() {
    this.stats.stats$.takeUntil(this.takeUntilDestroyed$)
        .subscribe(stats => this.updateLines(stats, curveStepAfter));

    this.sb.matchdata$.takeUntil(this.takeUntilDestroyed$)
        .subscribe(samples => this.updateSamples(samples));
  }

  private updateSamples(samples: Samples) {
    const paths = {};
    for (const name of Object.keys(samples)) {
      paths[name] = [];
      for (const i of Object.keys(samples[name])) {
        const index = parseInt(i, 10);
        const time = index * (settings.match.gameTime / (settings.match.sampleSize - 1));
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
