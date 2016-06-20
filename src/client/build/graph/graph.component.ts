import {NgClass, NgFor} from '@angular/common';
import {AfterContentChecked, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import * as d3 from 'd3';

import {settings} from '../../../../config/settings';
import {DDragonDirective} from '../../misc/ddragon.directive';
import {Samples} from '../samples';

import {AbilitySequenceComponent} from './ability-sequence.component';
import {DataAxis, DataScale} from './axes/data';
import {LevelAxisLine, LevelAxisText, LevelScale} from './axes/level';
import {TimeAxis, TimeScale} from './axes/time';
import {config} from './config';

interface Line {
  enabled: boolean;
  preview: boolean;
  name: string;
  obj: d3.svg.Line<[number, number]>;
}

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [DDragonDirective, AbilitySequenceComponent, NgFor, NgClass],
  template: `
    <ul class="legend">
      <li *ngFor="let line of lines">
        <button [ngClass]="{ enabled: line.enabled }" [attr.name]="line.name" type="button" (click)="clicked(line)" (mouseenter)="mouseEnter(line)" (mouseleave)="mouseLeave(line)">
          {{ line.name }}
        </button>
      </li>
    </ul>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" [attr.viewBox]="'0 0 ' +  config.width + ' ' + config.height">
      <g ability-sequence [champion]="champion" [attr.transform]="'translate(0,' + (config.graphHeight + config.margin.top + config.margin.bottom) + ')'"></g>
      <g [attr.transform]="'translate(' + config.margin.left + ',' + config.margin.top + ')'">
        <g class="lines">
          <path *ngFor="let line of lines" [ngClass]="'line ' + line.name + (line.enabled ? ' enabled' : '') + (line.preview ? ' preview' : '')"></path>
        </g>
        <g class="axes">
          <g class="x axis time" [attr.transform]="'translate(0,' + config.graphHeight + ')'"></g>
          <g class="x axis level-line" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
          <g class="x axis level-text" [attr.transform]="'translate(0,' + (config.height - config.margin.top - config.margin.bottom) + ')'"></g>
          <g class="y axis"></g>
        </g>
      </g>
    </svg>`
})

export class GraphComponent implements OnChanges,
    OnInit, AfterContentChecked {
  @Input() private samples: Samples;
  @Input() private champion: any;

  private config = config;

  private svg: any;

  private xScaleTime = new TimeScale();
  private xScaleLevel = new LevelScale();
  private yScale = new DataScale();

  private xAxisTime = new TimeAxis();
  private xAxisLevelLine = new LevelAxisLine();
  private xAxisLevelText = new LevelAxisText();
  private yAxis = new DataAxis();

  private lines = new Array<Line>();

  private line: any =
      d3.svg.line().interpolate('monotone').x((d, i) => { return this.xScaleTime.get()(i * (settings.gameTime / (settings.sampleSize - 1))); }).y((d) => { return this.yScale.get()(d); });


  constructor(@Inject(ElementRef) private elementRef: ElementRef) {}

  ngOnInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select('svg');
    this.createAxes();
  }

  ngAfterContentChecked() { this.updateLines(); }

  createAxes() {
    this.xScaleTime.create();
    this.xAxisTime.create(this.xScaleTime);

    this.yScale.create();
    this.yAxis.create(this.yScale);

    this.svg.select('.x.axis.time').call(this.xAxisTime.get());
    this.svg.select('.y.axis').call(this.yAxis.get());
  }

  createLines() {
    this.lines = [];
    for (let index in this.samples) {
      this.lines.push({enabled: true, preview: false, name: index, obj: this.line(this.samples[index])});
    }
  }

  updateLines() {
    for (let line of this.lines) {
      this.svg.select('.line.' + line.name).attr('d', line.obj);
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

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (this.svg) {
      this.createLines();
      this.createLevelScale();
    }
  }

  clicked(line: Line) { line.enabled = !line.enabled; }

  mouseEnter(line: Line) {
    if (!line.enabled) {
      line.preview = true;
    }
  }

  mouseLeave(line: Line) {
    if (!line.enabled) {
      line.preview = false;
    }
  }
}
