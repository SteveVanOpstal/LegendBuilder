import {Component, ChangeDetectionStrategy, OnChanges, OnInit, SimpleChange, Input, Inject, ElementRef} from '@angular/core';
import * as d3 from 'd3';

import {Samples} from '../samples';
import {settings} from '../../../../config/settings';
import {config} from './config';

import {DDragonDirective} from '../../misc/ddragon.directive';

import {AbilitySequenceComponent} from './ability-sequence.component';

import {TimeAxis, TimeScale} from './axes/time';
import {DataAxis, DataScale} from './axes/data';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [DDragonDirective, AbilitySequenceComponent],
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" [attr.viewBox]="'0 0 ' +  config.width + ' ' + config.height">
      <g ability-sequence [champion]="champion" [attr.transform]="'translate(0,' + (config.graphHeight + config.margin.top + config.margin.bottom) + ')'"></g>
      <g [attr.transform]="'translate(' + config.margin.left + ',' + config.margin.top + ')'">
        <path class="line xp"></path>
        <path class="line g"></path>
        <g class="x axis time" [attr.transform]="'translate(0,' + config.graphHeight + ')'"></g>
        <g class="x axis level-line" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
        <g class="x axis level-text" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
        <g class="y axis"></g>
      </g>
    </svg>`
})

export class GraphComponent implements OnChanges, OnInit {
  @Input() private samples: Samples;
  @Input() private champion: any;

  private config = config;

  private svg: any;

  private xScaleTime = new TimeScale();
  private xScaleLevel: any;
  private yScale = new DataScale();

  private xAxisTime = new TimeAxis();
  private xAxisLevelLine: any;
  private xAxisLevelText: any;
  private yAxis = new DataAxis();

  private line: any = d3.svg.line()
    .interpolate('monotone')
    .x((d, i) => {
      return this.xScaleTime.get()(i * (settings.gameTime / (settings.sampleSize - 1)));
    })
    .y((d) => { return this.yScale.get()(d); });

  private levelMarks: Array<number> = [0, 280, 660, 1140, 1720, 2400, 3180, 4060, 5040, 6120, 7300, 8580, 9960, 11440, 13020, 14700, 16480, 18360];

  constructor( @Inject(ElementRef) private elementRef: ElementRef) { }

  ngOnInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select('svg');
    this.createAxes();
    this.updateLines();
  }

  createAxes() {
    this.xScaleTime.create();
    this.xAxisTime.create(this.xScaleTime);

    this.yScale.create();
    this.yAxis.create(this.yScale);

    this.svg.select('.x.axis.time')
      .call(this.xAxisTime.get());
    this.svg.select('.y.axis')
      .call(this.yAxis.get());
  }

  updateLines() {
    this.svg.select('.line.xp')
      .attr('d', this.line(this.samples.xp));
    this.svg.select('.line.g')
      .attr('d', this.line(this.samples.g));
  }

  createLevelScale() {
    if (!this.samples.xp.length) {
      return;
    }

    let lastXpMark = this.samples.xp[this.samples.xp.length - 1];

    this.xScaleLevel = d3.scale.linear()
      .domain([0, lastXpMark])
      .range([0, config.graphWidth]);

    this.xAxisLevelLine = d3.svg.axis()
      .scale(this.xScaleLevel)
      .tickSize(-this.config.height + this.config.margin.top + this.config.margin.bottom)
      .tickValues(this.levelMarks);

    let values = [];
    this.levelMarks.forEach((v, i, a) => {
      values[i] = v + (((a[i + 1] ? a[i + 1] : lastXpMark) - v) / 2);
    });

    this.xAxisLevelText = d3.svg.axis()
      .scale(this.xScaleLevel)
      .tickSize(-this.config.height + this.config.margin.top + this.config.margin.bottom)
      .tickValues(values)
      .tickFormat((t) => { return (values.indexOf(t) + 1).toString(); });

    this.svg.select('.x.axis.level-line').call(this.xAxisLevelLine);
    this.svg.select('.x.axis.level-text').call(this.xAxisLevelText);

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

  ngOnChanges(changes: { [key: string]: SimpleChange; }) {
    if (this.svg) {
      this.updateLines();
      this.createLevelScale();
    }
  }
}
