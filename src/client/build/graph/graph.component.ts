import {Component, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {select} from 'd3-selection';
import {curveStepAfter, Line, line} from 'd3-shape';

import {settings} from '../../../../config/settings';
import {DataService} from '../../services/data.service';
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
  private samples: Samples;
  @Input() private stats: any;

  private svg: any;

  private xScaleTime = new TimeScale([0, 1380]);
  private yScaleSamples = new DataScale([380, 0]);
  private yScaleStats = new DataScale([380, 0]);

  private xAxisTime = new TimeAxis(380);
  private yAxisLeft = new DataAxis();
  private yAxisRight = new DataAxis();

  private paths = new Array<Path>();

  private lineSamples: any =
      line()
          .x((d, i) => {
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
                               .y((d, i, a) => {
                                 return this.yScaleStats.get()(d['value']);
                               })
                               .curve(curveStepAfter);

  constructor(@Inject(ElementRef) private elementRef: ElementRef, private data: DataService) {}

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.createAxes();

    this.data.samples.subscribe((samples: Samples) => {
      this.samples = samples;
      if (this.svg) {
        this.createPaths();
      }
    });

    this.data.stats.subscribe((stats) => {
      this.stats = stats;
      this.createPaths();
    });
  }

  createAxes() {
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

  createPaths() {
    this.paths = [];
    for (let index in this.samples) {
      this.paths.push(
          {enabled: true, preview: false, name: index, d: this.lineSamples(this.samples[index])});
    }
    for (let index in this.stats) {
      this.paths.push(
          {enabled: true, preview: false, name: index, d: this.lineStats(this.stats[index])});
    }
  }
}
