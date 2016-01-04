/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, OnChanges, OnInit, SimpleChange, Inject, ElementRef} from 'angular2/core';
import * as d3 from 'd3/d3';

@Component({
  selector: 'line-graph',
  template: `
  <svg>
    <g>
      <g class="x axis time"></g>
      <g class="x axis level"></g>
      <g class="y axis"></g>
    </g>
  </svg>`
})
  
export class LineGraphComponent implements OnChanges, OnInit {
  private margin: any     = { top: 0, right: 50, bottom: 50, left: 80 };
  private width: number   = 1500 - this.margin.top - this.margin.bottom;
  private height: number  = 500 - this.margin.left - this.margin.right;

  private svg: any;
  private xAxisTime: any;
  private xAxisLevel: any;
  private yAxis: any;
  private levelXpMarks: Array<number> = [280, 660, 1140, 1720, 2400, 3180, 4060, 5040, 6120, 7300, 8580, 9960, 11440, 13020, 14700, 16480, 18360];
  
  constructor(@Inject(ElementRef) private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select("svg")
      .attr("width", this.width + this.margin.top + this.margin.bottom)
      .attr("height", this.height + this.margin.left + this.margin.right)
      .attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + (this.height + this.margin.left + this.margin.right));
    
    this.svg.select("g")
      .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");
    
    this.createAxesTicks();
  }
  
  createAxesTicks()
  {
    var xTime = d3.time.scale()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 1, 1, 20)])
      .range([0, this.width]);
    
    var xLevel = d3.scale.linear()
      .domain([0, 18360])
      .range([0, this.width]);
    
    var y = d3.scale.linear()
      .domain([0, 1000])
      .range([this.height, 0]);
    
    this.xAxisTime = d3.svg.axis()
      .scale(xTime)
      .tickSize(-this.height)
      .tickFormat(d3.time.format('%H:%M'))
      .orient("bottom");
    
    this.xAxisLevel = d3.svg.axis()
      .scale(xLevel)
      .tickSize(-this.height)
      .tickValues(this.levelXpMarks)
      .orient("bottom");
    
    this.yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
    
    this.svg.select(".x.axis.time").call(this.xAxisTime)
      .attr("transform", "translate(0, " + this.height + ")");
    this.svg.select(".x.axis.level").call(this.xAxisLevel)
      .attr("transform", "translate(0, " + this.height + ")");
    this.svg.select(".y.axis").call(this.yAxis);
  }

  ngOnChanges(changes: {[key: string]: SimpleChange;}) {
    
  }
}