import {Component, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {select} from 'd3-selection';
import {curveStepAfter, Line, line} from 'd3-shape';

import {settings} from '../../../../config/settings';
import {Samples} from '../samples';
import {BuildService} from '../services/build.service';

import {DataAxis, LevelAxisLine, LevelAxisText, TimeAxis} from './axes';
import {config} from './config';
import {DataScale, LevelScale, TimeScale} from './scales';

export interface Path {
  enabled: boolean;
  preview: boolean;
  name: string;
  d: Line<[number, number]>;
}

@Component({
  selector: 'graph',
  template: `
    <legend [paths]="paths"></legend>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" [attr.viewBox]="'0 0 ' +  config.width + ' ' + config.height">
      <g ability-sequence [attr.transform]="'translate(0,' + (config.graphHeight + config.margin.top + config.margin.bottom) + ')'"></g>
      <g [attr.transform]="'translate(' + config.margin.left + ',' + config.margin.top + ')'">
        <g class="lines">
          <path *ngFor="let path of paths" [attr.d]="path.d" [ngClass]="'line ' + path.name + (path.enabled ? ' enabled' : '') + (path.preview ? ' preview' : '')"></path>
        </g>
        <g class="axes">
          <g class="x axis time" [attr.transform]="'translate(0,' + config.graphHeight + ')'"></g>
          <g class="x axis level-line" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
          <g class="x axis level-text" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
          <g class="y axis left"></g>
          <g class="y axis right" [attr.transform]="'translate(' + config.graphWidth + ',0)'"></g>
        </g>
      </g>
    </svg>`
})

export class GraphComponent implements OnInit {
  private samples: Samples;
  @Input() private stats: any;

  private config = config;

  private svg: any;

  private xScaleTime = new TimeScale();
  private xScaleLevel = new LevelScale();
  private yScaleSamples = new DataScale();
  private yScaleStats = new DataScale();

  private xAxisTime = new TimeAxis();
  private xAxisLevelLine = new LevelAxisLine();
  private xAxisLevelText = new LevelAxisText();
  private yAxisLeft = new DataAxis();
  private yAxisRight = new DataAxis();

  private paths = new Array<Path>();

  private lineSamples: any =
      line()
          .x((d, i) => {
            return this.xScaleTime.get()(
                i * (settings.gameTime / (settings.matchServer.sampleSize - 1)));
          })
          .y((d) => {
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

  constructor(@Inject(ElementRef) private elementRef: ElementRef, private build: BuildService) {}

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.createAxes();

    this.build.stats.subscribe((stats) => {
      this.stats = stats;
      this.createPaths();
    });
    this.build.samples.subscribe((samples: Samples) => {
      this.samples = samples;
      if (this.svg) {
        this.createPaths();
        this.createLevelScale();
      }
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

  createLevelScale() {
    if (!this.samples.xp.length) {
      return;
    }

    this.xScaleLevel.create();
    this.xScaleLevel.update(this.samples);

    this.xAxisLevelLine.create(this.xScaleLevel);
    this.xAxisLevelText.create(this.xScaleLevel);

    this.xAxisLevelText.update(this.samples);

    this.svg.select('.x.axis.level-line').call(this.xAxisLevelLine.get());
    this.svg.select('.x.axis.level-text').call(this.xAxisLevelText.get());

    for (let i = 1; i <= 4; i++) {
      this.svg.selectAll('.x.axis.level-text .tick')
          .append('foreignObject')
          .attr('y', -23 - (50 * (i - 1)) - (i >= 2 ? 5 : 0) - this.config.margin.bottom)
          .attr('x', -10)
          .append('xhtml:label')
          .append('xhtml:input')
          .attr('type', 'checkbox');
    }
  }
}
