import {Component, Input} from '@angular/core';

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'g[lbCurve]',
  styleUrls: ['./curve.component.scss'],
  template: `
    <svg:path [attr.d]="'M' + Mx + ',' + My +
                        'Q' + Q1x + ',' + Q1y +
                        ' ' + Q2x + ',' + Q2y +
                        'T' + Tx + ',' + Ty">
    </svg:path>
    <!--
    <svg:circle r="3" [attr.cx]="Mx" [attr.cy]="My"></circle>
    <svg:circle r="3" [attr.cx]="Q1x" [attr.cy]="Q1y"></circle>
    <svg:circle r="3" [attr.cx]="Q2x" [attr.cy]="Q2y"></circle>
    <svg:circle r="3" [attr.cx]="Tx" [attr.cy]="Ty"></circle>
    -->`
})

export class CurveComponent {
  @Input() start: Coordinates;
  @Input() end: Coordinates;

  constructor() {}

  get Mx() {
    return this.start.x;
  }
  get My() {
    return this.start.y;
  }

  get Q1x() {
    return this.end.x - this.start.x < 80 ?
        this.inBetween(this.start.x, this.inBetween(this.start.x, this.end.x)) :
        this.end.x - 60;
  }
  get Q1y() {
    return this.start.y;
  }

  get Q2x() {
    return this.end.x - this.start.x < 80 ? this.inBetween(this.start.x, this.end.x) :
                                            this.end.x - 40;
  }
  get Q2y() {
    return this.inBetween(this.start.y, this.end.y);
  }

  get Tx() {
    return this.end.x;
  }
  get Ty() {
    return this.end.y;
  }

  inBetween(offset1: number, offset2: number): number {
    const diff = (Math.abs(offset1 - offset2) / 2);
    if (offset1 < offset2) {
      return offset1 + diff;
    } else {
      return offset2 + diff;
    }
  }
}
