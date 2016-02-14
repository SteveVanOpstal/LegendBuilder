/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, ChangeDetectionStrategy, OnChanges, OnInit, SimpleChange, Input, Inject, ElementRef} from 'angular2/core';
import {NgClass} from 'angular2/common';

import Config from 'app/config';

import {DDragonDirective} from 'app/ddragon.directive';

import * as d3 from 'd3/d3';

@Component({
  selector: 'line-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [NgClass, DDragonDirective],
  template: `
    <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="'0 0 ' +  width + ' ' + height" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g [attr.transform]="'translate(0,' + (graphHeight + margin.top + margin.bottom) + ')'">
        <g class="ability" [ngClass]="{ult : i == 3}" *ngFor="#spell of champion?.spells; #i = index">
          <g fill="gray">
            <rect x="10" [attr.y]="5 + (i * 50) + (i == 3 ? 5 : 0)" [attr.width]="width" height="30"/>
          </g>
          <image [ddragon]="'spell/' + spell.image.full" [attr.x]="i == 3 ? 0 : 5" [attr.y]="(i * 50)" [attr.height]="i == 3 ? 50 : 40" [attr.width]="i == 3 ? 50 : 40"/>
        </g>
      </g>
      <g [attr.transform]="'translate(' + margin.left + ',' + margin.top + ')'">
        <path class="line xp" clip-path="url(#clip)"></path>
        <path class="line g" clip-path="url(#clip)"></path>
        <g class="x axis time" [attr.transform]="'translate(0,' + graphHeight + ')'"></g>
        <g class="x axis level-line" [attr.transform]="'translate(0,' + (height - margin.top - margin.bottom) + ')'"></g>
        <g class="x axis level-text" [attr.transform]="'translate(0,' + (height - margin.top - margin.bottom) + ')'"></g>
        <g class="y axis"></g>
      </g>
    </svg>`
})
//title="{{spell.name}}"   

export class LineGraphComponent implements OnChanges, OnInit {
  @Input() private config: Config;
  @Input() private champion: any;
  
  private margin: any = { top: 20, right: 20, bottom: 20, left: 60 };
  private width: number = 1500;
  private height: number = 650;
  
  private abilitiesWidth: number = this.width;
  private abilitiesHeight: number = 250 - this.margin.bottom;
  private graphWidth: number = this.width - this.margin.left - this.margin.right;
  private graphHeight: number = this.height - this.abilitiesHeight - this.margin.top - this.margin.bottom;

  private svg: any;
  
  private xScaleTime: any;
  private xScaleLevel: any;
  private yScale: any;
  
  private xAxisTime: any;
  private xAxisLevelLine: any;
  private xAxisLevelText: any;
  private yAxis: any;
  
  private line: any = d3.svg.line()
      .interpolate("monotone")
      .x(function(d, i) {
        return this.xScaleTime(i * (this.config.gameTime / this.config.sampleSize));
      })
      .y(function(d) {
        return this.yScale(d);
      });
  
  private timeMarks: Array<number> = [0, 300000, 600000, 900000, 1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 3000000, 3300000, 3600000];
  private levelXpMarks: Array<number> = [0, 280, 660, 1140, 1720, 2400, 3180, 4060, 5040, 6120, 7300, 8580, 9960, 11440, 13020, 14700, 16480, 18360];
  
  constructor(@Inject(ElementRef) private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select("svg");
    this.createAxes();
    this.updateLines();
  }
  
  createAxes() {
    this.xScaleTime = d3.scale.linear()
      .domain([0, 3600000])
      .range([0, this.graphWidth]);
    
    this.yScale = d3.scale.linear()
      .domain([0, 30000])
      .range([this.graphHeight, 0]);
    
    this.xAxisTime = d3.svg.axis()
      .scale(this.xScaleTime)
      .tickSize(this.graphHeight)
      .tickValues(this.timeMarks)
      .tickFormat(function(d) {
        return d == 0 ? "" : Math.floor(d / 3600000) + ":" + ('00' + Math.floor((d % 3600000) / 60000)).slice(-2);
      })
      .orient("top");
    
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("left");
    
    this.svg.select(".x.axis.time").call(this.xAxisTime);
    this.svg.select(".y.axis").call(this.yAxis);
  }
  
  updateLines() {
    this.svg.select(".line.xp")
      .attr("d", this.line(this.config.xp));
    this.svg.select(".line.g")
      .attr("d", this.line(this.config.g));
  }
  
  createLevelScale() {
    if (!this.config.xp.length) {
      return;
    }  
    
    var lastXpMark = this.config.xp[this.config.xp.length - 1];
    
    this.xScaleLevel = d3.scale.linear()
      .domain([0, lastXpMark])
      .range([0, this.graphWidth]);
    
    this.xAxisLevelLine = d3.svg.axis()
      .scale(this.xScaleLevel)
      .tickSize(-this.height + this.margin.top + this.margin.bottom)
      .tickValues(this.levelXpMarks);
    
    this.xAxisLevelText = d3.svg.axis()
      .scale(this.xScaleLevel)
      .tickSize(-this.height + this.margin.top + this.margin.bottom)
      .tickValues(() => {
        var result = [];
        this.levelXpMarks.forEach(function(v, i, a) {
          result[i] = v + (((!a[i + 1] ? lastXpMark : a[i + 1]) - v) / 2);
        });
        return result;
      })
      .tickFormat(function(d, i) {
        return i + 1;
      });
    
    this.svg.select(".x.axis.level-line").call(this.xAxisLevelLine);
    this.svg.select(".x.axis.level-text").call(this.xAxisLevelText);
    
    for (var i = 1; i <= 4; i++)
    {
      this.svg.selectAll(".x.axis.level-text .tick")
        .append("foreignObject")
        .attr("y", -23 - (50 * (i - 1)) - (i >= 2 ? 5 : 0) - this.margin.bottom)
        .attr("x", -10)
        .append("xhtml:label")
        .append("xhtml:input")
        .attr("type", "checkbox");
    }
  }

  ngOnChanges(changes: { [key: string]: SimpleChange; }) {
    if (this.svg) {
      this.updateLines();
      this.createLevelScale();
    }
  }
} 