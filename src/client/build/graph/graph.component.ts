import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {select} from 'd3-selection';
import {curveStepAfter, Line, line} from 'd3-shape';

import {settings} from '../../../../config/settings';
import {LolApiService} from '../../services/lolapi.service';
import {Stats, StatsService} from '../../services/stats.service';
import {Samples} from '../samples';

import {DataAxis, TimeAxis} from './axes';
import {DataScale, TimeScale} from './scales';

export interface Path {
  enabled: boolean;
  preview: boolean;
  name: string;
  d: Line<[number, number]>;
}

@Component({
  selector: 'lb-graph',
  template: `
    <lb-legend [paths]="paths"></lb-legend>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1500 400">
      <g transform="translate(60,20)">
        <g class="lines">
          <path *ngFor="let path of paths"
                [attr.d]="path.d"
                class="line {{path.name}}"
                [ngClass]="{enabled: path.enabled, preview: path.preview}">
          </path>
        </g>
        <g class="axes">
          <g class="x axis time" transform="translate(0,380)"></g>
          <g class="y axis left"></g>
          <g class="y axis right" transform="translate(1380,0)"></g>
        </g>
      </g>
    </svg>`
})

export class GraphComponent implements OnInit {
  paths = new Array<Path>();

  private svg: any;

  private xScaleTime = new TimeScale([0, 1380]);
  private yScaleSamples = new DataScale([380, 0]);
  private yScaleStats = new DataScale([380, 0]);

  private xAxisTime = new TimeAxis(380);
  private yAxisLeft = new DataAxis();
  private yAxisRight = new DataAxis();

  private lineSamples: any =
      line()
          .x((_, i) => {
            return this.xScaleTime.get()(
                i * (settings.gameTime / (settings.matchServer.sampleSize - 1)));
          })
          .y((d: any) => {
            return this.yScaleSamples.get()(d);
          });

  private lineStats: any = line()
                               .x((d) => {
                                 return this.xScaleTime.get()(d['time']);
                               })
                               .y((d) => {
                                 return this.yScaleStats.get()(d['value']);
                               })
                               .curve(curveStepAfter);

  constructor(
      @Inject(ElementRef) private elementRef: ElementRef, private lolApi: LolApiService,
      private stats: StatsService) {}

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.createAxes();

    this.stats.stats.subscribe((stats) => {
      this.addStats(stats);
    });

    this.lolApi.getCurrentMatchData().subscribe((samples: Samples) => {
      if (this.svg) {
        this.addSamples(samples);
      }
    });
  }

  private createAxes() {
    this.xScaleTime.create();
    this.xAxisTime.create(this.xScaleTime);

    this.yScaleSamples.create();
    this.yAxisLeft.create(this.yScaleSamples);
    this.yScaleStats.create([0, 3000]);
    this.yAxisRight.create(this.yScaleStats, false);

    this.svg.select('.x.axis.time').call(this.xAxisTime.get());
    this.svg.select('.y.axis.left').call(this.yAxisLeft.get());
    this.svg.select('.y.axis.right').call(this.yAxisRight.get());
  }

  private addSamples(samples: Samples) {
    this.addPaths(samples, this.lineSamples);
  }

  private addStats(stats: Stats) {
    this.addPaths(stats, this.lineStats);
  }

  private addPaths(
      paths: any /*{[name: string]: Array<number>} Microsoft/TypeScript#5683 */, line) {
    for (let index in paths) {
      this.addPath(paths, line, index);
    }
  }

  private addPath(paths: any, line, name: string) {
    let foundPath = this.findPath(name);

    if (foundPath) {
      foundPath.d = line(paths[name]);
    } else {
      this.paths.push({enabled: true, preview: false, name: name, d: line(paths[name])});
    }
  }

  private findPath(name: string): Path {
    return this.paths.find((path) => {
      return path.name === name;
    });
  }
}
