/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, OnChanges, OnInit, SimpleChange, Inject, ElementRef} from 'angular2/core';
import * as d3 from 'd3/d3';

@Component({
  selector: 'line-graph',
  template: `
  <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="'0 0 ' +  width + ' ' + height">
    <g [attr.transform]="'translate(' + margin.left + ',' + margin.top + ')'">
      <g class="x axis time" [attr.transform]="'translate(0,' + graphHeight + ')'"></g>
      <g class="x axis level" [attr.transform]="'translate(0,' + graphHeight + ')'"></g>
      <g class="y axis"></g>
    </g>
    <g [attr.transform]="'translate(0,' + (graphHeight + margin.top + margin.bottom) + ')'">
    </g>
  </svg>`
})
  
export class LineGraphComponent implements OnChanges, OnInit {
  private margin: any = { top: 20, right: 50, bottom: 20, left: 50 };
  private width: number = 1500;
  private height: number = 500;
  
  private abilitiesWidth: number = this.width;
  private abilitiesHeight: number = 200;
  private graphWidth: number = this.width - this.margin.left - this.margin.right;
  private graphHeight: number = this.height - this.abilitiesHeight - this.margin.top - this.margin.bottom;

  private svg: any;
  private xAxisTime: any;
  private xAxisLevel: any;
  private yAxis: any;
  private levelXpMarks: Array<number> = [280, 660, 1140, 1720, 2400, 3180, 4060, 5040, 6120, 7300, 8580, 9960, 11440, 13020, 14700, 16480, 18360];
  
  constructor(@Inject(ElementRef) private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select("svg");
    this.createAxesTicks();
  }
  
  createAxesTicks()
  {
    var xTime = d3.time.scale()
      .domain([new Date(2000, 1, 1, 0, 5), new Date(2000, 1, 1, 1, 20)])
      .range([this.graphWidth / 16, this.graphWidth]);
    
    var xLevel = d3.scale.linear()
      .domain([0, 18360])
      .range([0, this.graphWidth]);
    
    var y = d3.scale.linear()
      .domain([0, 1000])
      .range([this.graphHeight, 0]);
    
    this.xAxisTime = d3.svg.axis()
      .scale(xTime)
      .tickSize(-this.graphHeight)
      .tickFormat(d3.time.format('%H:%M'))
      .orient("bottom");
    
    this.xAxisLevel = d3.svg.axis()
      .scale(xLevel)
      .tickSize(-this.graphHeight)
      .tickValues(this.levelXpMarks)
      .orient("bottom");
    
    this.yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
    
    this.svg.select(".x.axis.time").call(this.xAxisTime);
    this.svg.select(".x.axis.level").call(this.xAxisLevel);
    this.svg.select(".y.axis").call(this.yAxis);
  }

  ngOnChanges(changes: {[key: string]: SimpleChange;}) {
    
  }
}