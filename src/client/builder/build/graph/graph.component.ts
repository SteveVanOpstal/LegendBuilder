import {Component, Input, ElementRef, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {select} from 'd3-selection';

import {TimeAxis} from './axes';
import {Line, LineComponent} from './line/line.component';
import {TimeScale} from './scales';

@Component({
  selector: 'lb-graph',
  styleUrls: ['./graph.component.scss'],
  template: `
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
          <g lbLine [line]="line" *ngFor="let line of lines"></g>
        </g>
        <g class="axes">
          <g class="x axis time" transform="translate(0,380)"></g>
        </g>
      </g>
    </svg>`
})

export class GraphComponent implements OnInit {
  @Input() lines = new Array<Line>();
  dragging = false;
  @ViewChildren(LineComponent) lineComponents: QueryList<LineComponent>;

  private svg: any;

  private xScaleTime = new TimeScale([0, 1420]);
  private xAxisTime = new TimeAxis(380, this.xScaleTime);

  private mouseOffsetX: number;

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.svg = select(this.elementRef.nativeElement).select('svg');
    this.svg.select('.x.axis.time').call(this.xAxisTime.get());
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
}
