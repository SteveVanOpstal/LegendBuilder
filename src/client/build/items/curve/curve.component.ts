import {Component, Input} from '@angular/core';

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'g[lbCurve]',
  styleUrls: ['./curve.component.scss'],
  template: `
    <svg:path [attr.d]="'M' + start.x + ',' + start.y +
                        'Q' + quarter(start.x, end.x) + ',' + start.y +
                        ' ' + half(start.x, end.x) + ',' + half(end.y, start.y) +
                        'T' + end.x + ',' + end.y">
    </svg:path>`
})

export class CurveComponent {
  @Input() start: Coordinates;
  @Input() end: Coordinates;

  constructor() {}

  half(offset1: number, offset2: number): number {
    return offset1 + (Math.abs(offset1 - offset2) / 2);
  }

  quarter(offset1: number, offset2: number): number {
    return offset1 + (Math.abs(offset1 - offset2) / 4);
  }
}
